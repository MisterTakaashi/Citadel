import { Response } from "express";

const renderSuccess = <T>(res: Response, data: T) => {
  res.json({
    error: false,
    data: data,
  });
};

const renderError = (res: Response, code: number, message: string) => {
  res.status(code);
  res.json({
    error: true,
    message: message,
  });
};

export { renderSuccess, renderError };
