import { Server } from "http";

export type routesWs = {
  route: string;
  prompt: any;
  middleWare: Function[];
};
export interface IServerWs {
  registerRouter(route: string, prompt: any, ...middleWare: Function[]): any;
  listen(server: Server): any;
}
