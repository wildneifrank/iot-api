// src/utils/response.ts
import { Response } from "express";
import { API } from "types";

export const sendResponse = <T>(
  res: Response,
  statusCode: API.Express.HttpStatusCodes,
  message?: string,
  data: T | null = null
): Response<API.Express.IApiResponse<T>> => {
  const responseBody: API.Express.IApiResponse<T> = {
    message,
    data,
    statusCode,
  };

  return res.status(statusCode).json(responseBody);
};
