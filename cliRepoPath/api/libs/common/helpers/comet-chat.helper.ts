import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RawAxiosRequestHeaders } from 'axios';

export type UserMetadata = {
  [key: string]: string;
};

export type UserPayload = {
  uid: string;
  name: string;
  avatar?: string;
  link?: string;
  role?: string;
  metadata?: UserMetadata;
  tags?: string[];
  withAuthToken?: boolean;
};

export type GroupPayload = {
  guid: string;
  name: string;
  type: string;
  password: string;
  icon: string;
  description: string;
  metadata: {
    listingName: string;
    icon?: string;
  };
  owner?: string;
  tags?: string[];
  members?: {
    admins?: string[];
    moderators?: string[];
    participants?: string[];
    usersToBan?: string[];
  };
};

export type AuthTokenPayload = {
  uid: string;
  force?: boolean;
};

@Injectable()
export class CometChatHelperService {
  private readonly appId?: string;
  private readonly apiKey?: string;
  private readonly url?: string;
  private readonly headers?: RawAxiosRequestHeaders;

  constructor(private readonly httpService: HttpService) {
    this.appId = process.env.COMET_CHAT_APP_ID;
    this.apiKey = process.env.COMET_CHAT_SECRET_KEY;
    this.url = process.env.COMET_CHAT_API_URL;
    this.headers = {
      apiKey: process.env.COMET_CHAT_SECRET_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async createCometChatUser(payload: UserPayload) {
    const { uid, name, avatar, link, role, metadata, withAuthToken, tags } = payload;
    const url = `${this.url}/users`;

    try {
      const body = {
        uid,
        name,
        avatar,
        link,
        role,
        metadata,
        withAuthToken,
        tags,
      };

      const resp = await firstValueFrom(
        this.httpService.post(url, body, {
          headers: this.headers,
        }),
      );

      return resp?.data?.data;
    } catch (err) {
      console.log('create comet chat user error: ', uid, err?.message);
      return null;
    }
  }

  async updateCometChatUser(payload: Partial<UserPayload>) {
    const { uid, name, avatar, link, metadata, withAuthToken, tags } = payload;
    const url = `${this.url}/users/${uid}`;

    try {
      const body = {
        name,
        avatar,
        link,
        metadata,
        withAuthToken,
        tags,
      };

      await firstValueFrom(
        this.httpService.put(url, body, {
          headers: this.headers,
        }),
      );

      return true;
    } catch (err) {
      console.log('update comet chat user error : ', uid, err?.message);
      return false;
    }
  }

  async getCometChatAuthToken(payload: AuthTokenPayload) {
    const { uid } = payload;
    const url = `${this.url}/users/${uid}/auth_tokens`;

    try {
      const info = await firstValueFrom(
        this.httpService.post(url, null, {
          headers: this.headers,
        }),
      );

      return info?.data?.data;
    } catch (err) {
      console.log('User not foundgetCometChatAuthToken error : ', uid);
      return null;
    }
  }

  async getCometChatUser(uid: string) {
    const url = `${this.url}/users/${uid}`;

    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
        }),
      );

      return resp?.data?.data;
    } catch (err) {
      console.log('get comet chat user error: ', uid, err?.message);

      return null;
    }
  }

  async getCometChatGroup(guid: string) {
    const url = `${this.url}/groups/${guid}`;

    try {
      const resp = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
        }),
      );

      return resp?.data?.data;
    } catch (err) {
      console.log('get comet chat group error: ', guid, err?.message);
      return null;
    }
  }

  async updateCometChatGroup(payload: Partial<GroupPayload>) {
    const { guid, icon, metadata } = payload;
    const url = `${this.url}/groups/${guid}`;

    try {
      const body = {
        icon,
        metadata,
      };

      await firstValueFrom(
        this.httpService.put(url, body, {
          headers: this.headers,
        }),
      );

      return true;
    } catch (err) {
      console.log('update comet chat group error : ', guid, err?.message);
      return false;
    }
  }

  async deleteCometChatUser(uid: string) {
    const url = `${this.url}/users/${uid}`;

    try {
      const resp = await firstValueFrom(
        this.httpService.delete(url, {
          headers: this.headers,
          data: {
            permanent: false,
            // Note: To permanently delete the user, set permanent to true
            // permanent: true, // Permanently deletes the user along with all the messages, conversations, etc.
          },
        }),
      );

      return resp?.data?.data;
    } catch (err) {
      console.log('delete comet chat user error: ', uid, err?.message);

      return null;
    }
  }

  async deleteCometChatGroup(guid: string) {
    const url = `${this.url}/groups/${guid}`;

    try {
      const resp = await firstValueFrom(
        this.httpService.delete(url, {
          headers: this.headers,
        }),
      );

      return resp?.data?.data;
    } catch (err) {
      console.log('delete comet chat group error: ', guid, err?.message);

      return null;
    }
  }
}
