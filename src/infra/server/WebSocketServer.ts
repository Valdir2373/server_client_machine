import { IncomingMessage, Server } from "http";
import WebSocket, { WebSocketServer } from "ws";
import { IServerWs, routesWs } from "./interfaces/IServerWs";

export type handleMiddleware = (
  ws: WebSocket,
  data: any,
  next: Function
) => void;

export class WebSocketServerAdapter implements IServerWs {
  private wss: WebSocket.Server<
    typeof WebSocket,
    typeof IncomingMessage
  > | null;
  private routes: routesWs[];
  constructor() {
    this.routes = [];
    this.wss = null;
  }
  registerRouter(
    route: string,
    prompt: any,
    ...middleWare: handleMiddleware[]
  ) {
    this.routes.push({
      route,
      prompt,
      middleWare,
    });
    console.log(`ROTA REGISTRADA: "${route.toUpperCase()}"`);
  }
  listen(server: Server) {
    if (this.wss) return console.error("conexão ws já foi estabelecida!");
    this.wss = new WebSocketServer({ server });

    this.wss.on("connection", (ws: WebSocket) => {
      ws.on("message", (data) => {
        try {
          const msgReceived = data.toString();
          console.log(msgReceived);

          const jsonReveived = JSON.parse(msgReceived);

          if (typeof jsonReveived.route === "string") {
            const rotaEncontrada = this.routes.find(
              (routeWs) => jsonReveived.route === routeWs.route
            );

            if (rotaEncontrada) {
              const allMiddlewaresWithPromptOfClient = [
                ...rotaEncontrada.middleWare,
                rotaEncontrada.prompt,
              ];

              let currentMiddlewareIndex = -1;

              const next = () => {
                currentMiddlewareIndex++;

                if (
                  currentMiddlewareIndex <
                  allMiddlewaresWithPromptOfClient.length
                ) {
                  const middleWare =
                    allMiddlewaresWithPromptOfClient[currentMiddlewareIndex];

                  middleWare(ws, jsonReveived, next);
                }
              };

              next();
            } else {
              ws.send(
                JSON.stringify({
                  error: "Rota não encontrada",
                  route: jsonReveived.route,
                })
              );
            }
          }
        } catch (e: any) {
          console.log(`Erro no parsing de mensagem: ${e.message}`);
          ws.send(
            JSON.stringify({
              error: "Formato de mensagem inválido (JSON esperado)",
            })
          );
        }
      });
      ws.send(
        JSON.stringify({
          type: "status",
          message: "Conexão Web Socket estabelecida!",
          timestamp: new Date().toISOString(),
        })
      );
    });
  }
}
