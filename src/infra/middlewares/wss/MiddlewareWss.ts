import {
  handleMiddleware,
  WebSocketServerAdapter,
} from "../../server/WebSocketServer";
import { IWssMiddlewares } from "./IWssMiddlewares";

export class MiddlewareWss implements IWssMiddlewares {
  constructor(private server: WebSocketServerAdapter) {}
  registerRouterWs(
    route: string,
    prompt: any,
    ...middleWare: handleMiddleware[]
  ) {
    this.server.registerRouter(route, prompt, ...middleWare);
  }
  registerRouterWsPv(
    route: string,
    prompt: any,
    ...middleWare: handleMiddleware[]
  ) {
    const validate: handleMiddleware = (ws, data, next) => {
      if (data.token === "token_123") next();
      else {
        console.log("não pode passar");

        return;
      }
    };
    this.server.registerRouter(route, prompt, validate, ...middleWare);
  }
}
