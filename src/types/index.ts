import { Request } from "express";
import { IUser } from "./types";

export namespace API {
  // Models namespace for application-specific data structures
  export namespace Models {
    /**
     * Represents the core data models for the system.
     */
    export interface IUser {
      name: string;
      email: string;
      tel: string;
    }
    export interface IDog {
      ownerId: string;
      name: string;
      age: string;
      breed: string;
      sensors: ISensor[];
    }
    export interface ISensor {
      id: string;
      data: Record<string, any>;
      lastUpdated: string;
      history?: Array<{ timestamp: string; data: Record<string, any> }>;
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
      KEY_REQUIRED = "Key is required",
      EMAIL_REQUIRED = "Email is required to fetch user",
      TOKEN_INVALID = "Token is invalid",
      TOKEN_VALID = "Token is valid",
      UNEXPECTED_ERROR = "An unexpected error occurred",
      USER_UPDATED = "User updated successfully",
      USER_CREATED = "User created successfully",
      USER_DELETED = "User deleted successfully",
      USER_NOT_FOUND = "User not found",
      USER_ALREADY_EXISTS = "User with this email already exists",
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
          key: string;
        };
      }
      export interface ICreateUser extends Request {
        body: IUser;
      }
      export interface IUpdateUser extends Request {
        body: {
          key: string;
        } & Partial<IUser>;
      }
      export interface IGetUser extends Request {
        params: {
          email: string;
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
      find<T>(id: string): Promise<T | null>;
      create<T>(data: T): Promise<void>;
      update<T>(key: string, data: Partial<T>): Promise<void>;
      delete(key: string): Promise<void>;
      all<T>(): Promise<T[]>;
      getKey<T>(key: keyof T, value: any): Promise<string | null>;
      listen<T>(callback: (data: T[]) => void): void;
    }

    /**
     * Enumeration of Firebase data paths.
     */
    export enum DataPaths {
      TEMP_SENSOR = "iot/devices/sensor1",
      GPS_SENSOR = "iot/devices/sensor2",
      USERS = "iot/users",
      DOGS = "iot/dogs",
    }
  }
}
