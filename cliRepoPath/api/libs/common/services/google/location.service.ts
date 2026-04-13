import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LocationService {
  private readonly apiKey = '';
  constructor(
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    this.apiKey = this.configService.get('POSITION_STACK_API');
  }

  async getCoordinates(
    address: string,
  ): Promise<{ data: { data: [{ name: string; longitude: number; latitude: number }] } }> {
    try {
      return firstValueFrom(
        this.http.get(
          `http://api.positionstack.com/v1/forward?access_key=${this.apiKey}&query=${address}`,
        ),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
