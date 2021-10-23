import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({
      errorCode: "token invalid",
    });
  }

 
  const [, token] = authToken.split(" ");

  try {
    const { sub } = verify(token, process.env.PRJ_SECRET) as IPayload;
    console.log("TOKEN: ", token);
    console.log("SECRET: ", process.env.PRJ_SECRET);
    console.log("USER: ", sub);
    req.user_id = sub;
    return next();
  } catch (error) {
    return res.status(401).json({
      errorCode: "token expired",
    });
  }
}