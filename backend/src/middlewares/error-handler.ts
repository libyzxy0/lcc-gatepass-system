import type { Request, Response, NextFunction } from "express";
import { CustomAPIError } from "@/errors/custom-error";

const errorHandlerMiddleware = (
  err: Error | CustomAPIError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  return res.status(500).json({ code: 500, msg: "Something went wrong" });
};

export default errorHandlerMiddleware;
