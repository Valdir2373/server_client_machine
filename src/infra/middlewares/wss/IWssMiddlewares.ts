import { handleMiddleware } from "../../server/WebSocketServer";

export interface IWssMiddlewares {
  registerRouterWs(
    route: string,
    prompt: any,
    ...middleWare: handleMiddleware[]
  ): void;
  registerRouterWsPv(
    route: string,
    prompt: any,
    ...middleWare: handleMiddleware[]
  ): void;
}
