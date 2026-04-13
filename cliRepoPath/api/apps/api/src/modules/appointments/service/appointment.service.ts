import {
  AdminBlockRepository,
  AppointmentDocument,
  AppointmentRepository,
  AppointmentTypeDocument,
  BusinessRepository,
  CalendarFilterRepository,
  LocationsDocument,
  LocationsRepository,
  ScheduleRepository,
  UserDocument,
  UsersRepository,
} from '@app/data-access';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAppointmentDTO, EditAppointmentDTO } from '../dto/input/create-appointment.dto';
import {
  calculateStartEndDate,
  hasRecurrencePatternChanged,
  recurrenceInstance,
  recurrencePatternValidator,
  validateRecurrenceInput,
} from '@app/common/helpers/recurrence-validator';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { ClientSession, PipelineStage } from 'mongoose';
import { AppointmentInstanceRepository } from '@app/data-access/appointment/appointment-instance.repository';
import { endTypeEnum } from '@app/common/enum/recurrence.enum';
import { AppointmentTypeRepository } from '@app/data-access/appointment/appointment-type.repository';
import {
  AppointmentStatus,
  BookingsStatus,
  CancelClassOption,
  UpdateAppointmentOption,
} from '@app/common/enum/appointment.enum';
import {
  addTimeToDate,
  checkIfFutureDate,
  DEFAULT_LOCATION_TIMEZONE,
  isSameDate,
} from '@app/common/helpers/date-utils';
import moment from 'moment-timezone';
import { checkIfAppointmentIsRescheduled } from '@app/common/helpers/genericFunction';
import { AppointmentSettingsRepository } from '@app/data-access/appointment/appointment-setting.repository';
import { CalendarListClassAppointmentDTO } from '../dto/input/list-appointment.dto';
import {
  AppointmentInstanceDetailDTO,
  CancelAppointmentInstanceDTO,
  GetAllClientFutureBookingsForAnAppointmentDTO,
} from '../dto/input/detail-dto';
import { toMongoId } from '@app/common/helpers/mongo-helper';
import { SaveClassAppointmentFilterDTO } from '../dto/input/save-appointment-filter.dto';
import { weekDays } from '@api/constants/recurring';
import { AppointmentTypeListingDto } from '../dto/input/list-appointment-type.dto';
import { ListAdminBlocksInput } from '../dto/input/list-admin-block.input';
import {
  GetPractitionerByLocationDTO,
  GetStaffsScheduleDTO,
  InputValueForUsers,
} from '../dto/input/user-input.dto';
import { LoginDetailType } from '@api/modules/auth/types/login-detail.type';
import { I18nService } from 'nestjs-i18n';
import { GetAppointmentSettingDTO } from '../dto/input/appointment-setting.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private appointmentRepository: AppointmentRepository,
    private appointmentTypeRepository: AppointmentTypeRepository,
    private userRepository: UsersRepository,
    private appointmentInstanceRepository: AppointmentInstanceRepository,
    private appointmentSettingsRepository: AppointmentSettingsRepository,
    private calenderSavedFilterRepository: CalendarFilterRepository,
    private businessRepository: BusinessRepository,
    private practitionerScheduleRepository: ScheduleRepository,
    private locationRepository: LocationsRepository,
    private adminBlockRepository: AdminBlockRepository,
    private locationsRepository: LocationsRepository,
    private scheduleRepository: ScheduleRepository,
    private readonly i18nService: I18nService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async convertToLocationTimezone(
    date: Date,
    locationTimezone: string = DEFAULT_LOCATION_TIMEZONE,
  ) {
    // Convert the date to a moment object in the specified timezone
    const momentDate = moment(date).tz(locationTimezone);

    // Format the date and time
    const formattedDate = momentDate.format('DD-MM-YYYY');
    const formattedTime = momentDate.format('hh:mm A');

    return {
      dates: formattedDate,
      times: formattedTime,
      zone: locationTimezone,
    };
  }

  async appointmentBookingsCancellationService(instanceId, cancelReason, cancelNote, option) {
    const appointmentInstanceDetail =
      await this.appointmentInstanceRepository.getAppointmentsInstanceWithDetail({ instanceId });

    if (!appointmentInstanceDetail) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Appointment' } }),
      );
    }

    if (appointmentInstanceDetail.isUnavailableBlock) {
      await this.appointmentInstanceRepository.updateById(instanceId, {
        status: BookingsStatus.cancelled,
        cancelReason,
        cancelNote,
        cancelledAt: new Date(),
        ...(option === CancelClassOption.thisAndFollowing
          ? { isShowInListing: false }
          : { isShowInListing: true }),
      });

      return { message: this.i18nService.t('appointment.unavailable_block_cancelled') };
    }

    const appointmentTypeDetail: AppointmentTypeDocument =
      await this.appointmentTypeRepository.findOne({
        _id: appointmentInstanceDetail?.appointmentTypeId,
      });

    if (!appointmentTypeDetail) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Appointment type' } }),
      );
    }

    const appointmentSettings = await this.appointmentSettingsRepository.findOne({
      businessId: appointmentInstanceDetail.businessId,
    });

    if (!appointmentSettings) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Appointment settings' } }),
      );
    }

    const appointmentClient = await this.userRepository.findOne({
      _id: appointmentInstanceDetail.clientId,
    });

    if (!appointmentClient) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', {
          args: { entity: 'Client associated with this appointment' },
        }),
      );
    }

    //appending appointment booking start time to instance date's time

    const appointmentStartTime = new Date(appointmentInstanceDetail.startTime);

    const appointmentStartHour = appointmentStartTime.getUTCHours();
    const appointmentStartMinute = appointmentStartTime.getUTCMinutes();

    const appointmentDay = new Date(appointmentInstanceDetail.instanceDate);

    appointmentDay.setUTCHours(appointmentStartHour);
    appointmentDay.setUTCMinutes(appointmentStartMinute);

    await this.appointmentInstanceRepository.updateById(instanceId, {
      status: BookingsStatus.cancelled,
      cancelReason,
      cancelNote,
      cancelledAt: new Date(),
      ...(option === CancelClassOption.thisAndFollowing
        ? { isShowInListing: false }
        : { isShowInListing: true }),
    });

    return {
      message: this.i18nService.t('common.s_cancelled', { args: { entity: 'Appointment' } }),
    };
  }

  async createAppointment(input: CreateAppointmentDTO, user) {
    const startAndEndDate = calculateStartEndDate({
      startDate: input.startDate,
      isRecurring: input.isRecurring,
      recurrencePattern: input.recurrencePattern,
    });

    validateRecurrenceInput(
      input.isRecurring,
      input.recurrencePattern,
      input.startDate,
      input.timezoneRegion,
    );

    const inputData = {
      ...input,
      ...startAndEndDate,
      recurrencePattern: input.isRecurring
        ? {
            ...startAndEndDate,
            ...recurrencePatternValidator(input.recurrencePattern),
          }
        : null,
      multiPractitioner: false,
      createdBy: user._id,
      clientId: input.clientId,
      businessId: user.businessId,
    };

    let appointment: AppointmentDocument = null;

    const session = await this.connection.startSession();

    await session.withTransaction(async () => {
      appointment = await this.appointmentRepository.create(inputData, { session });
      await this.createAppointmentInstance(appointment, inputData, session);
    });

    await session.endSession();

    return appointment;
  }

  async updateAppointment(input: EditAppointmentDTO, user) {
    const { action, ...rest } = input;

    input = { ...rest };

    const instanceDetail = await this.appointmentInstanceRepository.findById(input.instanceId);
    const appointmentDetail = await this.appointmentRepository.findById(
      instanceDetail.appointmentId.toString(),
    );
    if (!instanceDetail || !appointmentDetail) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Appointment' } }),
      );
    }

    let reminderNotificationSent: boolean;

    let dateAfterAddingTimer: Date = null;

    const appointmentType = await this.appointmentTypeRepository.findById(input.appointmentTypeId);

    if (
      appointmentType?.reminderNotification?.notificationTimer &&
      instanceDetail.status === AppointmentStatus.upcoming
    ) {
      dateAfterAddingTimer = addTimeToDate(
        Number(appointmentType.reminderNotification.notificationTimer),
        input.startTime,
        'hour',
      );

      if (checkIfFutureDate(dateAfterAddingTimer) && instanceDetail?.reminderNotificationSent) {
        reminderNotificationSent = false;
      }
    }

    const practitionerSearched = await this.userRepository.findPractitionerForCreateAppointment(
      input.practitionerIds,
    );

    const practitioners = practitionerSearched?.map((practitioner: any) => ({
      userId: practitioner._id,
      fullName: practitioner.firstName + ' ' + practitioner.lastName,
      profilePicture: practitioner.profilePicture,
    }));

    let appointmentTiming = { dates: '', zone: '', times: '' };

    const isSameStartTime = isSameDate(instanceDetail.startTime, input.startTime);

    const isStartTimeInFuture = checkIfFutureDate(input?.startTime);

    if (!isSameStartTime && isStartTimeInFuture) {
      appointmentTiming = await this.convertToLocationTimezone(
        input.startTime,
        input?.timezoneRegion ?? instanceDetail?.timezoneRegion,
      );
    }

    if (appointmentDetail.isRecurring === false && input.isRecurring === false) {
      const startAndEndDate = calculateStartEndDate({
        startDate: input.startDate,
        isRecurring: input.isRecurring,
        recurrencePattern: input.recurrencePattern,
      });

      let inputData = {
        ...input,
        ...startAndEndDate,
        practitonerIds: practitioners,
        multiPractitioner: practitioners.length > 1,
        updatedBy: user._id,
        businessId: user.businessId,
      } as any;

      const appointment: any = null;

      const session = await this.connection.startSession();

      await session.withTransaction(async () => {
        //update occurance
        //appointment = await this.appointmentRepository.create(inputData, session);
        await this.updateAppointmentInstance(appointment, inputData, session);
      });

      await session.endSession();
    } else if (appointmentDetail.isRecurring === false && input.isRecurring === true) {
      // non recurring to recurring
      const session = await this.connection.startSession();

      await session.withTransaction(async () => {
        // update parent class
        const startAndEndDate = calculateStartEndDate({
          startDate: input.startDate,
          isRecurring: input.isRecurring,
          recurrencePattern: input.recurrencePattern,
        });

        // update the reoccuring part
        await this.appointmentInstanceRepository.updateOne(
          {
            _id: instanceDetail._id,
          },
          {
            $set: {
              isRecurring: input.isRecurring,
              recurrencePattern: input.isRecurring
                ? {
                    ...startAndEndDate,
                    ...recurrencePatternValidator(input.recurrencePattern),
                  }
                : null,
              reminderNotificationSent:
                reminderNotificationSent === false
                  ? false
                  : instanceDetail.reminderNotificationSent,
            },
          },
          session,
        );

        validateRecurrenceInput(
          input.isRecurring,
          input.recurrencePattern,
          input.startDate,
          input.timezoneRegion,
        );

        const newAppointmentData = {
          ...input,
          ...startAndEndDate,
          recurrencePattern: input.isRecurring
            ? {
                ...startAndEndDate,
                ...recurrencePatternValidator(input.recurrencePattern),
              }
            : null,
          practitonerIds: practitioners,
          multiPractitioner: practitioners.length > 1,
          createdBy: user._id,
          businessId: user.businessId,
        };

        const updatedAppointmentDetail = await this.appointmentRepository.updateById(
          appointmentDetail._id.toString(),
          newAppointmentData,
          { new: true, session },
        );

        // generate instances
        await this.createAppointmentInstance(updatedAppointmentDetail, newAppointmentData, session);
      });

      await session.endSession();
    } else if (appointmentDetail.isRecurring === true && input.isRecurring === false) {
      // recurring to non recurring

      const startAndEndDate = calculateStartEndDate({
        startDate: input.startDate,
        isRecurring: input.isRecurring,
        recurrencePattern: input.recurrencePattern,
      });

      let inputData = {
        ...input,
        ...startAndEndDate,
        practitonerIds: practitioners,
        multiPractitioner: practitioners.length > 1,
        createdBy: user._id,
        businessId: user.businessId,
        instanceDate: startAndEndDate.startDate, // as it is not recurring so its instance date is set to the start date
      } as any;

      const session = await this.connection.startSession();

      await session.withTransaction(async () => {
        await this.appointmentRepository.updateById(
          appointmentDetail._id.toString(),
          {
            $set: {
              'recurrencePattern.endType': endTypeEnum.date,
              'recurrencePattern.endAfterOccurrence': null,
              'recurrencePattern.endDate': instanceDetail.instanceDate,
              endDate: instanceDetail.instanceDate,
            },
          },
          { session },
        );

        // delete all upcoming class instances of the class
        await this.appointmentInstanceRepository.deleteMany(
          {
            appointmentId: instanceDetail.appointmentId,
            businessId: instanceDetail.businessId,
            instanceDate: { $gt: instanceDetail.instanceDate },
          },
          session,
        );

        await this.appointmentInstanceRepository.updateById(
          inputData.instanceId,
          { $set: { ...inputData } },
          { session },
        );
      });

      await session.endSession();
    } else if (appointmentDetail.isRecurring === true && input.isRecurring === true) {
      //recurring to recurring
      const isRecurrenceConditionUpdated = hasRecurrencePatternChanged(
        appointmentDetail.recurrencePattern,
        input.recurrencePattern,
      );
      if (isRecurrenceConditionUpdated && input.updateOption === UpdateAppointmentOption.thisOnly) {
        throw new BadRequestException('Cannot update this only because recurrence is updated.');
      }
      if (input.updateOption === UpdateAppointmentOption.thisOnly) {
        const startAndEndDate = calculateStartEndDate({
          startDate: input.startDate,
          isRecurring: input.isRecurring,
          recurrencePattern: input.recurrencePattern,
        });

        let updatedData = {
          ...input,
          ...startAndEndDate,
          recurrencePattern: undefined,
          practitonerIds: practitioners,
          multiPractitioner: practitioners.length > 1,
          createdBy: user._id,
          businessId: user.businessId,
        } as any;

        if (reminderNotificationSent === false) {
          updatedData = {
            ...updatedData,
            reminderNotificationSent,
          };
        }

        // const appointment: any = null;
        let caseData: any = null;
        const session = await this.connection.startSession();

        await session.withTransaction(async () => {
          // this is updating the instance so it is not deleting the associated instance
          await this.appointmentInstanceRepository.updateById(
            instanceDetail._id.toString(),
            updatedData,
            { session },
          );
        });
      } else if (input.updateOption === UpdateAppointmentOption.thisAndFuture) {
        // find the previous class instance
        const previousAppointmentInstance = await this.appointmentInstanceRepository.findPrevious({
          appointmentId: instanceDetail.appointmentId,
          businessId: instanceDetail.businessId,
          instanceDate: { $lt: instanceDetail.instanceDate },
        });
        let newAppointmentData: any = {
          ...input,
          startDate: instanceDetail.instanceDate,
          instanceId: undefined,
          updateOption: undefined,
        };
        const startAndEndDate = calculateStartEndDate({
          //startDate: newAppointmentData.startDate,
          startDate: input.startDate, // instanceDetail.instanceDate,
          isRecurring: newAppointmentData.isRecurring,
          recurrencePattern: newAppointmentData.recurrencePattern,
        });
        validateRecurrenceInput(
          newAppointmentData.isRecurring,
          newAppointmentData.recurrencePattern,
          instanceDetail.instanceDate,
          input.timezoneRegion,
          // newAppointmentData.startDate,
        );

        newAppointmentData = {
          ...newAppointmentData,
          recurrencePattern: newAppointmentData.isRecurring
            ? {
                ...startAndEndDate,
                ...recurrencePatternValidator(newAppointmentData.recurrencePattern),
              }
            : null,

          practitonerIds: practitioners,
          multiPractitioner: practitioners.length > 1,
          createdBy: user._id,
          businessId: user.businessId,
          ...startAndEndDate,
          instanceDate: input.startTime,
        };

        let caseData: any = null;
        const session = await this.connection.startSession();
        await session.withTransaction(async () => {
          // delete all upcoming class instances of the class
          await this.appointmentInstanceRepository.deleteMany(
            {
              appointmentId: instanceDetail.appointmentId,
              businessId: instanceDetail.businessId,
              instanceDate: { $gte: instanceDetail.instanceDate },
            },
            session,
          );
          let newAppointmentDetail: AppointmentDocument | null = null;
          if (!previousAppointmentInstance) {
            // if no previous instances of class is there, that means all the class instances of this class will be updated
            // updating existing class schedule with new startDate and recurrence pattern instead.
            newAppointmentDetail = await this.appointmentRepository.updateById(
              appointmentDetail._id.toString(),
              newAppointmentData,
              { new: true, session },
            );
          } else {
            // add endDate of classSchedule upto previous class instance.
            await this.appointmentRepository.updateById(
              appointmentDetail._id.toString(),
              {
                $set: {
                  'recurrencePattern.endType': endTypeEnum.date,
                  'recurrencePattern.endAfterOccurrence': null,
                  'recurrencePattern.endDate': previousAppointmentInstance.instanceDate,
                  endDate: previousAppointmentInstance.instanceDate,
                },
              },
              { session },
            );
            // create new class schedule to be used for generating new class instances from upcoming instances
            newAppointmentDetail = await this.appointmentRepository.create(newAppointmentData, {
              session,
            });
          }
          await this.createAppointmentInstance(newAppointmentDetail, newAppointmentData, session);
        });
        await session.endSession();
        // create new class with updated recurrence pattern and instances.
      }
    } else {
      throw new BadRequestException(this.i18nService.t('common.something_went_wrong'));
    }

    // handle update case for checking treatment plan limit after update transaction is completes for simplicity

    return { message: this.i18nService.t('update_success', { args: { entity: 'Appointment' } }) };
  }

  async createAppointmentInstance(
    appointmentData,
    inputData,
    session: ClientSession | null = null,
    appointmentCoverage = null,
  ) {
    if (!appointmentData.isRecurring) {
      const appointmentInstanceData = {
        ...inputData,
        appointmentId: appointmentData._id,
        bookedFrom: appointmentData.bookedFrom,
        instanceDate: inputData.startDate,
      };

      // create 1 instance for non recurring
      const createdAppointment = await this.appointmentInstanceRepository.create(
        {
          ...appointmentInstanceData,
        },
        { session },
      );

      return createdAppointment;
    }

    let appointmentInstances = recurrenceInstance(appointmentData, inputData, 'appointment');

    console.log(
      'DEBUG: createAppointmentInstance',
      appointmentInstances.map((i) => i.instanceDate),
    );
    appointmentInstances.sort(
      (a, b) => new Date(a.instanceDate).getTime() - new Date(b.instanceDate).getTime(),
    );

    if (!appointmentInstances.length) {
      throw new BadRequestException(this.i18nService.t('common.at_least_one_instance_required'));
    }

    // in case of endType occurrence update endDate class as well as all generated instances
    if (inputData.recurrencePattern.endType === endTypeEnum.occurrence) {
      const endDate = appointmentInstances[appointmentInstances.length - 1].instanceDate;
      appointmentInstances = appointmentInstances.map((instance) => ({
        ...instance,
        endDate,
      }));

      appointmentData.endDate = endDate;
      appointmentData.save({ session });
    }

    const createdAppointments = await this.appointmentInstanceRepository.createMany(
      appointmentInstances,
      { session },
    );

    return createdAppointments;
  }

  async updateAppointmentInstance(
    appointmentData,
    inputData,
    session: ClientSession | null = null,
  ) {
    // create 1 instance for non recurring
    const updatedAppointment = await this.appointmentInstanceRepository.updateById(
      inputData.instanceId,
      { $set: { ...inputData, instanceDate: inputData.startDate } },
      { session },
    );

    return updatedAppointment;
  }

  async getAppointmentSettingForBusiness(user) {
    return await this.appointmentSettingsRepository.findOne({
      businessId: user.businessId,
    });
  }

  async listClassAppointment(input: CalendarListClassAppointmentDTO, user, appointmentSettings) {
    const { startDate, endDate, addressIds, appointmentTypeIds, coachIds } = input;

    const data = await this.appointmentInstanceRepository.calendarListAppointment(
      {
        startDate,
        endDate,
        addressIds,
        appointmentTypeIds,
        coachIds,
        appointmentSettings,
      },
      user,
    );
    return data;
  }

  async getAppointmentSettingsDetail(input: GetAppointmentSettingDTO, user: LoginDetailType) {
    const appointmentSettings = await this.appointmentSettingsRepository.findOne({
      businessId: user.businessId,
    });
    if (!appointmentSettings) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Appointment settings' } }),
      );
    }

    const [members] = await this.appointmentSettingsRepository.getAppointmentSettingsDetail(
      user.businessId,
      input,
    );
    return {
      ...members,
      teamMembersOrder: members.userDetails,
      onlinePractitioners: members.onlinePractitioners,
    };
  }

  async cancelAppoinmentInstance(
    {
      instanceId,
      cancelReason,
      cancelNote,
      notifyAll,
      deductCancellationcharge,
      option,
    }: CancelAppointmentInstanceDTO,
    user: UserDocument,
  ) {
    if (option === CancelClassOption.thisAndFollowing) {
      const instance = await this.appointmentInstanceRepository.findById(instanceId);

      if (!instance) {
        throw new BadRequestException(
          this.i18nService.t('common.not_exist', { args: { entity: 'Appointment' } }),
        );
      }

      const startingInstanceId = instance._id;

      const futureAppointmentInstances = await this.appointmentInstanceRepository.find(
        {
          appointmentId: instance?.appointmentId,
          businessId: instance?.businessId,
          startTime: { $gte: instance?.startTime },
          status: { $ne: BookingsStatus.cancelled },
          clientId: instance?.clientId,
        },
        { _id: 1, startTime: 1 },
      );

      const futureAppointmentInstancesIds = futureAppointmentInstances.map(
        (instance) => instance._id,
      );

      if (!futureAppointmentInstancesIds || futureAppointmentInstancesIds.length === 0) {
        throw new BadRequestException(
          this.i18nService.t('common.not_exist', {
            args: { entity: 'Recurring future appointments' },
          }),
        );
      }

      let iterationCount = 0;
      for (const instanceId of futureAppointmentInstancesIds) {
        //to send one general notification for all the cancelled appointments
        //one general notification is sent on the first iteration of the loop then on the rest on the iterations the notification sendins is skipped since the notificationStatus value becomes true from second iteration onwards
        iterationCount++;
        const notificationStatus = iterationCount > 1;

        const isShowInListing = futureAppointmentInstancesIds.length === iterationCount;

        await this.appointmentBookingsCancellationService(
          instanceId,
          cancelReason,
          cancelNote,
          option,
        );

        //mark isShowInListing true only of the starting appointment instance of all the recurring instances
        if (isShowInListing) {
          await this.appointmentInstanceRepository.updateById(startingInstanceId.toString(), {
            isShowInListing: true,
          });
        }
      }
    } else {
      await this.appointmentBookingsCancellationService(
        instanceId,
        cancelReason,
        cancelNote,
        option,
      );
    }

    return {
      message: this.i18nService.t('common.s_cancelled', { args: { entity: 'Appointment' } }),
    };
  }

  async appoinmentInstanceDetail({ instanceId }: AppointmentInstanceDetailDTO) {
    const appoinmentInstanceDetail =
      await this.appointmentInstanceRepository.getAppointmentsInstanceWithDetail({ instanceId });
    if (!appoinmentInstanceDetail) {
      throw new BadRequestException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Appointment' } }),
      );
    }

    appoinmentInstanceDetail.practitioners = appoinmentInstanceDetail.practitioners.map(
      (practitioner) => ({
        ...practitioner,
        role: practitioner.role.role,
      }),
    );

    let fullyPaid = false;
    // if (
    //   appoinmentInstanceDetail?.appointmentTypeValue?.[0]?.billingItemPrice ===
    //   appoinmentInstanceDetail?.appointmentTypeValue?.[0]?.minimumOnlinePayment
    // ) {
    //   fullyPaid = true;
    // }

    if (appoinmentInstanceDetail?.paidInvoices?.length) {
      const fullyPaidInvoices = appoinmentInstanceDetail?.paidInvoices?.filter(
        (item) => item.totalRemaining === 0,
      );

      if (fullyPaidInvoices?.length) {
        fullyPaid = true;
      }
    }

    return { ...appoinmentInstanceDetail, fullyPaid };
  }

  async getAllClientFutureBookingsForAnAppointment(
    input: GetAllClientFutureBookingsForAnAppointmentDTO,
  ) {
    const futureAppointmentInstances = await this.appointmentInstanceRepository.find(
      {
        appointmentId: toMongoId(input.appointmentId),
        startTime: { $gte: input.appointmentStartDate },
        businessId: toMongoId(input.businessId),
        status: { $ne: BookingsStatus.cancelled },
        ...(input.clientId ? { clientId: toMongoId(input.clientId) } : {}),
      },
      { _id: 1, startTime: 1, isUnavailableBlock: 1 },
    );

    return { data: futureAppointmentInstances };
  }

  async saveClassAppointmentFilter(
    {
      appointmentLocations,
      appointmentTypes,
      appointmentPractitioners,
      filterType,
      appointmentDays,
      activeCalendarTab,
    }: SaveClassAppointmentFilterDTO,
    user,
  ) {
    if (filterType === 'appointment') {
      await this.calenderSavedFilterRepository.updateOne(
        { businessId: user.businessId, userId: user.sub },
        {
          $set: {
            appointmentLocations,
            appointmentDays,
            appointmentTypes,
            appointmentPractitioners,
            appointmentSavedAt: new Date(),
          },
        },
        { upsert: true },
      );
    } else if (filterType === 'activeCalendarTab') {
      await this.calenderSavedFilterRepository.updateOne(
        { businessId: user.businessId, userId: user.sub },
        {
          $set: {
            activeCalendarTab,
          },
        },
        { upsert: true },
      );
    }

    return {
      message: this.i18nService.t('common.saved_success', { args: { entity: 'Calender Filter' } }),
    };
  }

  async getPractitionerByLocation(input: GetPractitionerByLocationDTO, user) {
    const locationIds = input.locationIds;

    const { dayRange } = input;

    if (!user?.businessId) {
      throw new BadRequestException('Access denied');
    }

    //from regular schedule
    const daysOfWeek = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    // Adjusting for Monday as the first day of the week
    const getDayIndex = (day) => daysOfWeek.indexOf(day.toLowerCase());
    const parseDayRange = (dayRange) => {
      const [startDay, endDay] = dayRange.split('-'); // Split the range into start and end days
      const startIndex = getDayIndex(startDay); // Get the index for the start day
      const endIndex = getDayIndex(endDay); // Get the index for the end day

      let daysToCheck = [];

      if (startIndex <= endIndex) {
        // Normal case: no wrapping (range within the same week)
        daysToCheck = daysOfWeek.slice(startIndex, endIndex + 1);
      } else {
        // Wrapping case: range spans across the end of the week
        daysToCheck = [
          ...daysOfWeek.slice(startIndex), // From startIndex to Sunday
          ...daysOfWeek.slice(0, endIndex + 1), // From Monday to endIndex
        ];
      }

      return daysToCheck;
    };

    const daysToCheck = parseDayRange(dayRange);
    const scheduleQuery = {
      $or: daysToCheck.map((day) => ({
        [`${day}.locationId`]: { $in: locationIds },
      })),
    };

    const practitionerScheduleByLocation = await this.scheduleRepository.find(scheduleQuery);

    const schedulePractitionerIds = [
      ...new Set(practitionerScheduleByLocation.flatMap((item) => item.userId.toString())),
    ];

    return schedulePractitionerIds;
  }

  async getDefaultBusinessTimezone(user) {
    try {
      if (!user?.businessId) {
        throw new BadRequestException(
          this.i18nService.t('users.user_not_associated_with_any_business'),
        );
      }
      return this.businessRepository.getDefaultBusinessTimezone(user.businessId);
    } catch (error: any) {
      throw error;
    }
  }

  async checkCalenderDateTimeAvailable(input, user) {
    const appointmentSettings = await this.appointmentSettingsRepository.findOne({
      businessId: user.businessId,
    });

    if (appointmentSettings) {
      if (
        appointmentSettings.hoursOfOperationStartTime &&
        appointmentSettings.hoursOfOperationEndTime
      ) {
        const settingStartHour = new Date(appointmentSettings.hoursOfOperationStartTime).getHours();
        const settingEndHour = new Date(appointmentSettings.hoursOfOperationEndTime).getHours();

        const inputStartHour = new Date(input.startTime).getHours();
        const inputEndHour = new Date(input.endTime).getHours();

        if (settingStartHour > settingEndHour) {
          // setting start and end hour spans two days
          const isValid =
            (inputStartHour >= settingEndHour || inputStartHour <= settingStartHour) &&
            (inputEndHour >= settingEndHour || inputEndHour <= settingStartHour);

          if (!isValid) {
            return { success: false, message: 'Invalid business time' };
          }
        } else {
          const isValid = inputStartHour >= settingStartHour && inputEndHour <= settingEndHour;

          if (!isValid) {
            return { success: false, message: 'Invalid business time' };
          }
        }
      }
    }

    return { success: true };
  }

  async isTimeInRange(inputStartTime, inputEndTime, schedule) {
    //convert the scheduled time (UTC in db) to time of selected timezoneRegion
    const startTime = moment
      .tz(schedule.startTime, schedule.timezoneRegion)
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
    const endTime = moment
      .tz(schedule.endTime, schedule.timezoneRegion)
      .format('YYYY-MM-DDTHH:mm:ss[Z]');
    const inputStart =
      new Date(inputStartTime).getUTCHours() * 60 + new Date(inputStartTime).getUTCMinutes();
    let inputEnd =
      new Date(inputEndTime).getUTCHours() * 60 + new Date(inputEndTime).getUTCMinutes();
    const start = new Date(startTime).getUTCHours() * 60 + new Date(startTime).getUTCMinutes();
    let end = new Date(endTime).getUTCHours() * 60 + new Date(endTime).getUTCMinutes();

    // Handle case where end time is past midnight
    if (end < start) end += 24 * 60;
    if (inputEnd < inputStart) inputEnd += 24 * 60;

    // Check if input times are within range
    return (
      (inputStart >= start && inputEnd <= end) ||
      (inputStart + 24 * 60 >= start && inputEnd + 24 * 60 <= end) ||
      (inputStart >= start + 24 * 60 && inputEnd <= end + 24 * 60)
    );
  }

  async checkCalenderLocationAvailable(user, input) {
    const practitionerSchedule = await this.practitionerScheduleRepository.findOne({
      userId: input.practitionerIds[0],
    });

    if (practitionerSchedule) {
      const appointmentDay = new Date(input.appointmentDate).getDay();
      const dayOfWeek = weekDays[appointmentDay];

      if (practitionerSchedule[dayOfWeek].length > 0) {
        for (const scheduleItem of practitionerSchedule[dayOfWeek]) {
          const res = await this.isTimeInRange(input.startTime, input.endTime, scheduleItem);
          if (res) {
            const locationInfo = await this.locationRepository.findById(scheduleItem.locationId);

            return {
              success: true,
              location: locationInfo._id,
            };
          }
        }
      }
    }
  }

  async listAppointmentType(payload: AppointmentTypeListingDto, user: LoginDetailType) {
    return this.appointmentTypeRepository.listAppointmentType(
      payload,
      user?.businessId?.toString(),
    );
  }

  async findAllAdminBlocks(input: ListAdminBlocksInput, businessId: string) {
    const adminBlocks = await this.adminBlockRepository.listAll(input, businessId);

    return adminBlocks;
  }

  async getLocations(user: LoginDetailType) {
    const locations = await this.locationRepository.getLocations(user.businessId);

    if (!locations) {
      throw new NotFoundException(
        this.i18nService.t('common.not_exist', { args: { entity: 'Business' } }),
      );
    }
    return {
      locations,
    };
  }

  async listStaffsAndClientsForTask(userValue: InputValueForUsers, user) {
    if (!user?.businessId) {
      throw new BadRequestException(
        this.i18nService.t('users.user_not_associated_with_any_business'),
      );
    }
    return await this.userRepository.listStaffsAndClientsForTask(userValue, user);
  }

  async getClassAppointmentFilter(user) {
    return await this.calenderSavedFilterRepository.getFilterDetail(user.businessId, user.userId);
  }

  async getStaffsSchedule(input: GetStaffsScheduleDTO, user) {
    if (!user?.businessId) {
      throw new BadRequestException('Access denied');
    }
    const { staffIds, startDate, endDate } = input;

    const staffSchedules = await this.scheduleRepository.find({
      userId: { $in: staffIds.map((id) => toMongoId(id)) },
    });

    return staffSchedules;
  }
}
