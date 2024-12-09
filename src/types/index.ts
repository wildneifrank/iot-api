import { Request } from "express";

export namespace API {
  // Models namespace for application-specific data structures
  export namespace Models {
    /**
     * Represents a generic data item with ID, title, and votes amount.
     */
    export interface IDataItem {
      id: number;
      title: string;
      votes_amount: number;
    }
    export interface IUser {
      id: number;
      name: string;
      email: string;
    }
  }

  // Express namespace for HTTP-related types and helpers
  export namespace Express {
    /**
     * HTTP Status Codes enumeration for API responses.
     */
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
    /**
     * Enumeration for organizing response messages used throughout the application.
     */
    export enum ResponseMessages {
      TOKEN_REQUIRED = "Token is required",
      TOKEN_INVALID = "Token is invalid",
      TOKEN_VALID = "Token is valid",
      UNEXPECTED_ERROR = "An unexpected error occurred",
    }

    /**
     * Request body interfaces for API endpoints.
     */
    export namespace RequestBodies {
      /**
       * Request interface for token verification.
       */
      export interface IVerifyTokenRequest<T = unknown> extends Request {
        body: {
          token: string;
          data?: T;
        };
      }

      export interface IGenerateTestToken extends Request {
        body: {
          uid: string;
        };
      }
      export interface IDeleteUser extends Request {
        params: {
          id: string;
        };
      }
    }

    /**
     * Generic API response interface.
     * @template T - The type of the data being returned.
     */
    export interface IApiResponse<T = null> {
      message?: string;
      data?: T | null;
      statusCode: HttpStatusCodes;
    }
  }

  // Firebase namespace for Firebase-related types and paths
  export namespace Firebase {
    /**
     * Interface for data accessor methods.
     */
    export interface IDataAccessor {
      where<T>(key: keyof T, value: any): Promise<T[]>;
      find<T>(id: number): Promise<T | null>;
      create<T>(data: T): Promise<void>;
      update<T>(id: number, data: Partial<T>): Promise<void>;
      delete(id: number): Promise<void>;
      all<T>(): Promise<T[]>;
      listen<T>(callback: (data: T[]) => void): void;
    }

    /**
     * Enumeration of Firebase data paths.
     */
    export enum DataPaths {
      TEMP_SENSOR = "iot/devices/sensor1",
      GPS_SENSOR = "iot/devices/sensor2",
      USER = "iot/users",
    }
  }
}
