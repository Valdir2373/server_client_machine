import { IMiddlewareHandler } from "../../server/interfaces/IMiddlewareHandler";
import { IRequest } from "../../server/interfaces/IRequest";
import { IResponse } from "../../server/interfaces/IResponse";
import { IServer, methodHTTP } from "../../server/interfaces/IServer";

export class MiddlewareAdapter {
  constructor(private server: IServer) {}
  public registerRouter(
    methodHTTP: methodHTTP,
    path: string,
    ...MiddlewareHandler: IMiddlewareHandler[]
  ) {
    this.server.registerRouter(methodHTTP, path, ...MiddlewareHandler);
  }
  public registerRouterpv(
    methodHTTP: methodHTTP,
    path: string,
    ...MiddlewareHandler: IMiddlewareHandler[]
  ) {
    async function teste(req: IRequest, res: IResponse, next: () => void) {
      if (req.headers.te === "teste") next();
      else res.send("unauthorized");
    }
    this.server.registerRouter(methodHTTP, path, teste, ...MiddlewareHandler);
  }
  public registerRouterFile(
    methodHTTP: methodHTTP,
    path: string,
    ...MiddlewareHandler: IMiddlewareHandler[]
  ) {
    this.server.registerRouterFile(
      methodHTTP,
      path,
      (req, res, next) => {
        next();
      },
      ...MiddlewareHandler
    );
  }
}
