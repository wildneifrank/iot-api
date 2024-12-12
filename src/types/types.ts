import { API } from "types";
import admin from "firebase-admin";

/**
 * Requests
 */
export type IVerifyTokenRequest = API.Express.RequestBodies.IVerifyTokenRequest;

export type ICreateUser = API.Express.RequestBodies.ICreateUser;

export type IGenerateTestToken = API.Express.RequestBodies.IGenerateTestToken;

export type IDeleteUser = API.Express.RequestBodies.IDeleteUser;

export type IUpdateUser = API.Express.RequestBodies.IUpdateUser;

export type IGetUser = API.Express.RequestBodies.IGetUser;
/**
 * Firebase
 */
export type IDataAccessor = API.Firebase.IDataAccessor;

/**
 * Models
 */
export type IUser = API.Models.IUser;

export type IDog = API.Models.IDog;

export type ISensor = API.Models.ISensor;

/**
 * Third-party
 */
export type DbInstance = admin.database.Database;
