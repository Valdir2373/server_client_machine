import { IRequest } from "./IRequest";
import { IResponse } from "./IResponse";

export type IMiddlewareHandler = (
  req: IRequest,
  res: IResponse,
  next: () => void
) => Promise<void> | void;
