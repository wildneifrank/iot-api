import { API } from "types";
import admin from "firebase-admin";

/**
 * Type representing a request object for verifying tokens.
 */
export type IVerifyTokenRequest = API.Express.RequestBodies.IVerifyTokenRequest;

/**
 * Type alias for Firebase data accessor interface.
 */
export type IDataAccessor = API.Firebase.IDataAccessor;

/**
 * Type alias for the Firebase Realtime Database instance.
 */
export type DbInstance = admin.database.Database;

export type IGenerateTestToken = API.Express.RequestBodies.IGenerateTestToken;

export type IDeleteUser = API.Express.RequestBodies.IDeleteUser;

export type IUser = API.Models.IUser;
