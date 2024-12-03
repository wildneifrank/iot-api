export namespace API {
  export namespace Models {
    export interface IDataItem {
      id: number;
      title: string;
      votes_amount: number;
    }
  }

  export namespace Express {
    export enum HttpStatusCodes {
      OK = 200,
      CREATED = 201,
      NO_CONTENT = 204,
      BAD_REQUEST = 400,
      UNAUTHORIZED = 401,
      FORBIDDEN = 403,
      NOT_FOUND = 404,
      INTERNAL_SERVER_ERROR = 500,
    }

    export interface IApiResponse<T = any> {
      message?: string;
      data?: T | null;
      statusCode: HttpStatusCodes;
    }
  }
  export namespace Firebase {
    export interface DataAccessorInterface {
      where<T>(key: keyof T, value: any): Promise<T[]>;
      find<T>(id: number): Promise<T | null>;
      create<T>(data: T): Promise<void>;
      update<T>(id: number, data: Partial<T>): Promise<void>;
      all<T>(): Promise<T[]>;
      listen<T>(callback: (data: T[]) => void): void;
    }
    export enum DataPaths {
      TEMP_SENSOR = "iot/devices/sensor1",
      GPS_SENSOR = "iot/devices/sensor2",
      USER = "iot/devices/users",
    }
  }
}
