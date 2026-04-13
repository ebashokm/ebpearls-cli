import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AdminDocument, AdminRepository, RoleRepository, TokenRepository } from '@app/data-access';
import { GetAdminListDTO } from '../dto/input/get-adminList.dto';
import { UpdateAdminDTO } from '../dto/input/update-admin.dto';
// import { Order } from '../../../common/enum/pagination.enum';
import { isAllowedExt } from '@app/common/helpers/genericFunction';
import { S3Service, S3_TEMP_FOLDER_NAME } from '@app/common/services/s3';
import { SignedUrlMethod } from '@app/common/enum/signed-url.enum';
import { UpdateAdminStatusInput } from '../dto/input/update-admin-status.dto';
import { AdminStatus } from '@app/data-access/admin/admin-status.enum';
import { I18nService } from 'nestjs-i18n';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@app/email/email.service';
import { RequestedFor } from '@app/common/enum/otp-request.enum';
import { PaginationOptions as PaginateOptions } from '@app/data-access/repository/pagination.type';
import { FilterQuery } from 'mongoose';
import { UserEventsService } from '@app/common/services/sse/user.events.service';
import { RoleSlugs } from '@app/data-access/roles/role-slugs';
import { PermissionHelperSerivce } from '@app/data-access/permission/permission.helper';
import { Transactional } from '@nestjs-cls/transactional';

/**
 * ${1:Description placeholder}
 *
 * @export
 * @class AdminService
 * @typedef {AdminService}
 */
@Injectable()
export class AdminService {
  /**
   * Creates an instance of AdminService.
   *
   * @constructor
   * @param {AdminRepository} adminRepository
   * @param {S3Service} s3Service
   */
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly s3Service: S3Service,
    private readonly emailTokenRepository: TokenRepository,
    private readonly i18nService: I18nService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly userEventsService: UserEventsService,
    private readonly roleRepository: RoleRepository,
    private readonly permissionHelperService: PermissionHelperSerivce,
  ) {}

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {GetAdminListDTO} input
   * @param {*} user
   * @returns {Promise<any>}
   */
  async getAllAdmins(input: GetAdminListDTO, user) {
    const { searchText, orderBy, order, limit, skip } = input;

    try {
      const pageMeta: PaginateOptions = { limit, skip, orderBy, order };

      const superAdminRole = await this.roleRepository.findOne({ slug: RoleSlugs.SUPER_ADMIN });

      // Build filter object
      const filter: FilterQuery<AdminDocument> = {
        roles: { $ne: superAdminRole._id },
        _id: { $ne: user.id },
      };

      if (searchText) {
        filter.$or = [
          { firstName: { $regex: searchText, $options: 'i' } },
          { lastName: { $regex: searchText, $options: 'i' } },
          { email: { $regex: searchText, $options: 'i' } },
        ];
      }

      // Fetch paginated admins
      return await this.adminRepository.getAllAdmins(pageMeta, filter);
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Sends a reset password mail to the user with the given email.
   *
   * @param {string} email - The email of the user.
   * @param {string} userId - The ID of the user.
   * @param {string} name - The name of the user.
   * @return {Promise<boolean>} - A promise that resolves to true if the reset password mail is sent successfully.
   * @throws {NotFoundException} - If the user with the given email is not found.
   * @throws {HttpException} - If there is an error in performing the database operation.
   */
  async sendAdminResetPasswordMail(email: string, userId: string, name: string): Promise<boolean> {
    try {
      const user = await this.adminRepository.findOne({ email: email });
      if (!user) {
        throw new NotFoundException(
          this.i18nService.t('common.not_exist', { args: { entity: 'User' } }),
        );
      }

      //   /* send reset password link */
      let token = await this.tokenService.getToken(userId);
      if (!token) {
        token = await this.tokenService.generateToken(userId);
      }

      /* build the reset link */

      const link = `${this.configService.get('CMS_PORTAL_URI')}/reset-password?userId=${
        userId
      }&token=${token.token}`;

      this.emailService.sendEmail({
        to: email,
        values: {
          link,
          name,
        },
        slug: RequestedFor.reset_password,
      });

      return true;
    } catch (error) {
      if (error.message.includes('E11000')) {
        throw new HttpException(
          this.i18nService.t('common.error_operation', { args: { entity: 'database' } }),
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @returns {Promise<any>}
   */
  async getAdminById(id: string): Promise<AdminDocument> {
    try {
      return await this.adminRepository.getAdminById(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Transactional()
  async updateAdmin(
    id: string,
    userId: string,
    userRoles: string[],
    data: UpdateAdminDTO,
  ): Promise<AdminDocument> {
    const { phone, profileImage } = data;
    try {
      const adminToUpdate = await this.adminRepository.findById(id);
      if (!adminToUpdate) {
        throw new BadRequestException(
          this.i18nService.t('common.not_exist', { args: { entity: 'UserId' } }),
        );
      }

      const hasUpdatePermission = await this.permissionHelperService.hasPermission(userRoles, [
        'update-admin',
      ]);
      const canUpdate = hasUpdatePermission || userId.toString() === id.toString();

      if (!canUpdate) {
        throw new ForbiddenException(this.i18nService.t('auth.insufficient_privilege'));
      }

      // Phone validation
      await this.validatePhone(id, phone, adminToUpdate?.phone);

      const currentRoleSet = new Set(adminToUpdate.roles.map((r) => r.toString()));
      const incomingRoleSet = new Set(data.roles);

      const hasSameRoles =
        currentRoleSet.size === incomingRoleSet.size &&
        [...currentRoleSet].every((id) => incomingRoleSet.has(id));

      if (!hasSameRoles) {
        const hasUpdateRolePermission = await this.permissionHelperService.hasPermission(
          userRoles,
          ['update-admin-role'],
        );
        if (!hasUpdateRolePermission) {
          throw new ForbiddenException(this.i18nService.t('auth.insufficient_privilege'));
        }
      }

      // Profile image update handling
      const isProfileUpdated = await this.handleProfileImageUpdate(
        profileImage,
        adminToUpdate?.profileImage,
      );

      // Update admin
      const updatedAdmin = await this.adminRepository.updateById(id, data, { new: true });

      // Handle profile image in S3 if needed
      if (updatedAdmin?.profileImage && isProfileUpdated) {
        await this.updateProfileImageInS3(updatedAdmin.profileImage);
      }

      return updatedAdmin;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Validate if phone number exists
  private async validatePhone(
    id: string,
    phone: string | undefined,
    prevPhone: string | undefined,
  ) {
    if (phone && prevPhone !== phone) {
      const phoneExists = await this.adminRepository.findOne({
        phone: phone,
        //_id: { $ne: id },
      });

      if (phoneExists) {
        throw new BadRequestException(
          this.i18nService.t('common.already_in_use', { args: { entity: 'Phone' } }),
        );
      }
    }
  }

  // Handle profile image update logic
  private async handleProfileImageUpdate(
    profileImage: string | undefined,
    prevImageKey: string | undefined,
  ) {
    let isProfileUpdated = false;

    if (profileImage !== undefined) {
      const allowedExtensions = ['jpg', 'png', 'jpeg'];
      if (profileImage && !isAllowedExt(profileImage, allowedExtensions)) {
        throw new BadRequestException(
          this.i18nService.t('common.extension_not_allowed', { args: { entity: 'Image' } }),
        );
      }

      if (profileImage !== prevImageKey) {
        isProfileUpdated = true;
      }
    }

    return isProfileUpdated;
  }

  // Update profile image in S3 if updated
  private async updateProfileImageInS3(profileImage: string) {
    const profileImageKey = `public/cms-profiles/${profileImage}`;
    await this.s3Service.copyObject(`${S3_TEMP_FOLDER_NAME}/${profileImage}`, profileImageKey);
    return this.s3Service.getPreSignedUrl(profileImageKey, SignedUrlMethod.GET);
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} userId
   * @param {string} userRole
   * @param {UpdateAdminStatusInput} data
   * @returns {Promise<any>}
   */
  @Transactional()
  async updateAdminStatus(userId: string, userRole: string[], data: UpdateAdminStatusInput) {
    const { id, status } = data;

    try {
      const hasUpdatePermission = await this.permissionHelperService.hasPermission(userRole, [
        'update-admin-status',
      ]);
      const canUpdate = hasUpdatePermission || userId.toString() === id.toString();

      if (!canUpdate) {
        throw new ForbiddenException(this.i18nService.t('auth.insufficient_privilege'));
      }
      const adminToUpdate = await this.adminRepository.findById(id);
      if (!adminToUpdate) {
        throw new BadRequestException('UserID does not exist');
      }
      const updatedAdmin = await this.adminRepository.updateById(
        id,
        {
          status,
        },
        {
          new: true,
        },
      );

      if (updatedAdmin.status === AdminStatus.DISABLED) {
        await this.emailTokenRepository.deleteMany({
          userId: adminToUpdate?._id,
        });

        this.userEventsService.sendEventToUser(id.toString(), {
          type: 'disable-admin',
          data: { userId: id.toString() },
        });
      }

      return updatedAdmin;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * ${1:Description placeholder}
   *
   * @async
   * @param {string} id
   * @param {string} userId
   * @returns {Promise<any>}
   */
  async deleteAdminById(id: string, userId: string) {
    try {
      const admin = await this.adminRepository.findById(userId);
      const adminToDelete = await this.adminRepository.findById(id);

      if (!adminToDelete) {
        throw new BadRequestException('UserID does not exist');
      }

      const hasDeletePermission = this.permissionHelperService.hasPermission(admin.roles, [
        'delete-admin',
      ]);
      const canDelete = hasDeletePermission || userId.toString() === id.toString();

      if (!canDelete) {
        throw new ForbiddenException(this.i18nService.t('auth.insufficient_privilege'));
      }
      await this.adminRepository.softDeleteById(id);

      this.userEventsService.sendEventToUser(id, {
        type: 'delete-admin',
        data: { userId: id },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
