import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateAppointmentResponse } from '../dto/response/create-appointment.response';
import { CreateAppointmentDTO, EditAppointmentDTO } from '../dto/input/create-appointment.dto';
import { UseGuards } from '@nestjs/common';
import { AuthUserGuard } from '@api/guards/auth.user.guard';
import { LoginDetail } from '@api/modules/auth/decorator/login.decorator';
import { AppointmentService } from '../service/appointment.service';
import { MessageResponse } from '@app/common/dto/response/message.response';
import {
  CalendarListClassAppointmentResponse,
  CalenderSavedFilterResponse,
} from '../dto/response/appointment-list.response';
import { CalendarListClassAppointmentDTO } from '../dto/input/list-appointment.dto';
import moment from 'moment-timezone';
import { GetAppointmentSettingsDetailResponse } from '../dto/response/appointment-setting.response';
import { GetAppointmentSettingDTO } from '../dto/input/appointment-setting.dto';
import {
  AppointmentInstanceDetailDTO,
  CancelAppointmentInstanceDTO,
  GetAllClientFutureBookingsForAnAppointmentDTO,
} from '../dto/input/detail-dto';
import {
  AppointmentInstanceDetailResponse,
  GetAllClientFutureBookingsForAnAppointmentResponse,
} from '../dto/response/detail.response';
import { SaveClassAppointmentFilterDTO } from '../dto/input/save-appointment-filter.dto';
import {
  GetPractitionerByLocationDTO,
  GetStaffsScheduleDTO,
  InputValueForUsers,
} from '../dto/input/user-input.dto';

import { TimezoneType } from '../dto/response/timezone-type';
import { CheckAvailableDateDTO } from '../dto/input/check-available-date.dto';
import { CheckAvailableDateResponse } from '../dto/response/check-available-date.response';
import { AppointmentTypeListingDto } from '../dto/input/list-appointment-type.dto';
import { ListAppointmentTypeResponse } from '../dto/response/list-appointment-type.response';
import { ListAdminBlocksInput } from '../dto/input/list-admin-block.input';
import { AdminBlockListResponse } from '../dto/response/list-admin-block.response';
import { ListBusinessLocationResponse } from '../dto/response/address.response';
import { LoginDetailType } from '@api/modules/auth/types/login-detail.type';
import { SearchValueForUsersResponse } from '@api/modules/users/dto/response/search-value-response';
import { GetStaffsScheduleResponse } from '../dto/response/user-response';
import { CheckLocationDTO } from '../dto/input/check-available-location.dto';
import { CheckAvailableLocationResponse } from '../dto/response/check-available-location.response';
import { AppointmentRecord } from '@app/data-access/appointment/types/appointment.types';

@Resolver()
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Mutation(() => CreateAppointmentResponse, { name: 'createAppointment' })
  @UseGuards(AuthUserGuard)
  async createBusinessAppointment(@Args('input') input: CreateAppointmentDTO, @LoginDetail() user) {
    return this.appointmentService.createAppointment(input, user);
  }

  @Mutation(() => MessageResponse, { name: 'updateAppointment' })
  @UseGuards(AuthUserGuard)
  async updateAppointment(@Args('input') input: EditAppointmentDTO, @LoginDetail() user) {
    return this.appointmentService.updateAppointment(input, user);
  }

  @Query(() => [CalendarListClassAppointmentResponse])
  @UseGuards(AuthUserGuard)
  async calendarListClassAppointment(
    @Args('input') input: CalendarListClassAppointmentDTO,
    @LoginDetail() user,
  ) {
    const appointmentSetting = await this.appointmentService.getAppointmentSettingForBusiness(user);

    const [appointments] = await Promise.all([
      this.appointmentService.listClassAppointment(input, user, appointmentSetting),
    ]);

    const appointmentClass = [...appointments];

    const countData = [];
    const uniqueKeys = new Set();
    const groupedAppointmentClasses: Record<string, (AppointmentRecord & { uniqueKey: string })[]> =
      {};

    for (const data of appointmentClass) {
      const timezoneRegion = data?.locationTimezone;
      const startHour = moment.tz(data.startTime, timezoneRegion).hour();
      const date = moment.tz(data.startTime, timezoneRegion).date();

      const uniqueKey = `date-${date}-hour-${startHour}-${data.user?._id?.toString() || ''}`;

      uniqueKeys.add(uniqueKey);
      if (!groupedAppointmentClasses[uniqueKey]) {
        groupedAppointmentClasses[uniqueKey] = [];
      }
      groupedAppointmentClasses[uniqueKey].push({
        ...data,
        uniqueKey: uniqueKey,
      });

      (data as any).uniqueKey = uniqueKey;

      if (countData[uniqueKey] !== undefined) {
        countData[uniqueKey] = countData[uniqueKey] + 1;
      } else {
        countData[uniqueKey] = 1;
      }
    }
    let result = [];

    for (const uniqueK of uniqueKeys) {
      const instances =
        groupedAppointmentClasses[uniqueK as string].sort(
          (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
        ) || [];

      const subgroups = [];
      let currentSubgroup = [];

      for (let i = 0, insLength = instances.length; i < insLength; i++) {
        const instance = instances[i];

        if (i === 0) {
          currentSubgroup.push(instance);
          continue;
        }

        const prevDate = moment.tz(
          currentSubgroup[currentSubgroup.length - 1].endTime,
          currentSubgroup[currentSubgroup.length - 1].locationTimezone,
        );

        const EndMinPrevious = prevDate.hour() * 60 + prevDate.minute();

        const curDate = moment.tz(instance.startTime, instance.locationTimezone);

        const startMinCurrent = curDate.hour() * 60 + curDate.minute();

        if (startMinCurrent >= EndMinPrevious) {
          // End current subgroup and start a new one
          if (currentSubgroup.length > 0) {
            subgroups.push([...currentSubgroup]);
          }
          currentSubgroup = [instance];
        } else {
          // Add to current subgroup
          currentSubgroup.push(instance);
        }
      }

      // add the last subgroup if exists
      if (currentSubgroup.length > 0) {
        subgroups.push([...currentSubgroup]);
      }

      //assign count and currentCount to each item in each subgroup
      const groupResultData = [];

      for (const subgroup of subgroups) {
        const subgroupCount = subgroup.length;

        for (let itemIndex = 0; itemIndex < subgroupCount; itemIndex++) {
          const item = subgroup[itemIndex];
          groupResultData.push({
            ...item,
            count: subgroupCount,
            currentCount: itemIndex + 1,
          });
        }
      }

      result = [...result, ...groupResultData];
    }

    return result;
  }

  @Query(() => GetAppointmentSettingsDetailResponse)
  @UseGuards(AuthUserGuard)
  getAppointmentSettingsDetail(
    @Args('input') input: GetAppointmentSettingDTO,
    @LoginDetail()
    user: LoginDetailType,
  ) {
    return this.appointmentService.getAppointmentSettingsDetail(input, user);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard)
  cancelAppointmentInstance(
    @Args('input') input: CancelAppointmentInstanceDTO,
    @LoginDetail() user,
  ) {
    return this.appointmentService.cancelAppoinmentInstance(input, user);
  }

  @Query(() => AppointmentInstanceDetailResponse, { nullable: true })
  @UseGuards(AuthUserGuard)
  calendarAppointmentInstanceDetail(@Args('input') input: AppointmentInstanceDetailDTO) {
    return this.appointmentService.appoinmentInstanceDetail(input);
  }

  @Query(() => GetAllClientFutureBookingsForAnAppointmentResponse)
  @UseGuards(AuthUserGuard)
  getAllClientFutureBookingsForAnAppointment(
    @Args('input') input: GetAllClientFutureBookingsForAnAppointmentDTO,
  ) {
    return this.appointmentService.getAllClientFutureBookingsForAnAppointment(input);
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthUserGuard)
  saveClassAppointmentFilter(
    @Args('input') input: SaveClassAppointmentFilterDTO,
    @LoginDetail() user,
  ) {
    return this.appointmentService.saveClassAppointmentFilter(input, user);
  }

  @Query(() => [String], { nullable: true })
  @UseGuards(AuthUserGuard)
  async getPractitionersByLocation(
    @Args('input') input: GetPractitionerByLocationDTO,
    @LoginDetail() user,
  ) {
    return await this.appointmentService.getPractitionerByLocation(input, user);
  }

  @Query(() => TimezoneType)
  @UseGuards(AuthUserGuard)
  async getDefaultBusinessTimezone(@LoginDetail() user): Promise<any> {
    return this.appointmentService.getDefaultBusinessTimezone(user);
  }

  @Query(() => CheckAvailableDateResponse, { nullable: true })
  @UseGuards(AuthUserGuard)
  checkCalenderDateTimeAvailable(@Args('input') input: CheckAvailableDateDTO, @LoginDetail() user) {
    return this.appointmentService.checkCalenderDateTimeAvailable(input, user);
  }

  @Query(() => CheckAvailableLocationResponse, { nullable: true })
  @UseGuards(AuthUserGuard)
  checkLocationAvailable(@Args('input') input: CheckLocationDTO, @LoginDetail() user) {
    return this.appointmentService.checkCalenderLocationAvailable(user, input);
  }

  @Query(() => ListAppointmentTypeResponse)
  @UseGuards(AuthUserGuard)
  async ListAppointmentType(
    @Args('ListAppointmentType') payload: AppointmentTypeListingDto,
    @LoginDetail()
    user: LoginDetailType,
  ) {
    return this.appointmentService.listAppointmentType(payload, user);
  }

  @Query(() => AdminBlockListResponse)
  @UseGuards(AuthUserGuard)
  listAdminBlocks(@Args('input') input: ListAdminBlocksInput, @LoginDetail() user) {
    return this.appointmentService.findAllAdminBlocks(input, user.businessId);
  }

  @Query(() => ListBusinessLocationResponse)
  @UseGuards(AuthUserGuard)
  async getBusinessLocations(@LoginDetail() loginDetail: LoginDetailType) {
    return await this.appointmentService.getLocations(loginDetail);
  }

  @Query(() => SearchValueForUsersResponse, { name: 'searchValueForUsers' })
  @UseGuards(AuthUserGuard)
  async listBothUsers(
    @Args('input') input: InputValueForUsers,
    @LoginDetail() user: LoginDetailType,
  ) {
    const result = await this.appointmentService.listStaffsAndClientsForTask(input, user);

    return { users: result.data, pagination: result.pagination };
  }

  @Query(() => CalenderSavedFilterResponse, { nullable: true })
  @UseGuards(AuthUserGuard)
  getClassAppointmentFilter(@LoginDetail() user: LoginDetailType) {
    return this.appointmentService.getClassAppointmentFilter(user);
  }

  @Query(() => [GetStaffsScheduleResponse], { nullable: true })
  @UseGuards(AuthUserGuard)
  async getStaffsSchedules(
    @Args('input') input: GetStaffsScheduleDTO,
    @LoginDetail() user: LoginDetailType,
  ) {
    return await this.appointmentService.getStaffsSchedule(input, user);
  }
}
