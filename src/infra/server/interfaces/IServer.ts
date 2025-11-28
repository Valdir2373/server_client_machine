import { Server } from "http";
import { IMiddlewareHandler } from "./IMiddlewareHandler";
export type methodHTTP = "get" | "post" | "delete" | "put";

export interface IServer {
  registerRouter(
    methodHTTP: methodHTTP,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): any;
  registerRouterFile(
    methodHTTP: methodHTTP,
    path: string,
    ...handlers: IMiddlewareHandler[]
  ): any;
  listen(port: number): Server;
}
