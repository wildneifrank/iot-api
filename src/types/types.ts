import { API } from "types";
import admin from "firebase-admin";

/**
 * Requests
 */
// Generic
export type IDelete = API.Express.RequestBodies.IDelete;

// Specific
export type IVerifyTokenRequest = API.Express.RequestBodies.IVerifyTokenRequest;

export type ICreateUser = API.Express.RequestBodies.ICreateUser;

export type IGenerateTestToken = API.Express.RequestBodies.IGenerateTestToken;

export type IUpdateUser = API.Express.RequestBodies.IUpdateUser;

export type IGetUser = API.Express.RequestBodies.IGetUser;

export type ICreateDog = API.Express.RequestBodies.ICreateDog;

export type IGetDog = API.Express.RequestBodies.IGetDog;

export type IUpdateDog = API.Express.RequestBodies.IUpdateDog;

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
