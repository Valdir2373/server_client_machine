import { IMiddlewareHandler } from "../../server/interfaces/IMiddlewareHandler";
import { methodHTTP } from "../../server/interfaces/IServer";

export interface IHttpsMiddlewares {
  registerRouter(
    methodHTTP: methodHTTP,
    path: string,
    ...MiddlewareHandler: IMiddlewareHandler[]
  ): void;
  registerRouterpv(
    methodHTTP: methodHTTP,
    path: string,
    ...MiddlewareHandler: IMiddlewareHandler[]
  ): void;
}
