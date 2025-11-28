import { ServerExpress } from "../server/ExpressServer";
import { IServer } from "../server/interfaces/IServer";
import { MiddlewareAdapter } from "../middlewares/https/HttpsMiddlewares";
import { WebSocketServerAdapter } from "../server/WebSocketServer";
import WebSocket from "ws";
import { MiddlewareWss } from "../middlewares/wss/MiddlewareWss";
import { UserModule } from "../modules/UserModule";
import * as crypto from "crypto";
import { IDatabase } from "../../domain/repository/IDatabase";
import { DatabaseMemory } from "../database/DatabaseMemory";
import { MachinesModules } from "../modules/MachinesModule";
import { IMessageQueueUserRepository } from "../../domain/repository/IMessageQueueUserRepository";
import { MessageQueueUserRepository } from "../repository/MessageQueueRepository";
import { IMessageQueueMachineRepository } from "../../domain/repository/IMessageQueueMachineRepository";
import { MessageQueueMachineRepository } from "../repository/MessageQueueUserRepository";

export class AppModule {
  private server: IServer;
  private middleWare: MiddlewareAdapter;
  private middleWarews: MiddlewareWss;
  private serverWs: WebSocketServerAdapter;
  private createId: () => string;
  private database: IDatabase;
  private messageQueueUserRepository: IMessageQueueUserRepository;
  private messageQueueMachineRepository: IMessageQueueMachineRepository;

  constructor() {
    this.createId = crypto.randomUUID;
    this.database = new DatabaseMemory();
    this.messageQueueUserRepository = new MessageQueueUserRepository(
      this.database
    );
    this.messageQueueMachineRepository = new MessageQueueMachineRepository(
      this.database
    );
    this.server = new ServerExpress();
    this.serverWs = new WebSocketServerAdapter();
    this.middleWare = new MiddlewareAdapter(this.server);
    this.middleWarews = new MiddlewareWss(this.serverWs);

    this.middleWarews.registerRouterWsPv(
      "chat_message",
      this.handleChatMessage,
      this.validateInput
    );
  }

  private Modules() {
    new UserModule(
      this.createId,
      this.database,
      this.middleWare,
      this.middleWarews,
      this.messageQueueUserRepository,
      this.messageQueueMachineRepository
    );
    new MachinesModules(
      this.database,
      this.middleWarews,
      this.middleWare,
      this.createId,
      this.messageQueueUserRepository
    );
  }

  private validateInput(ws: WebSocket, data: any, next: Function) {
    console.log(`[WS: Middleware] Validando input para rota /${data.route}`);

    if (!data.payload) {
      console.error("[WS: Middleware] Falha de validação: Payload ausente.");
      ws.send(
        JSON.stringify({
          status: 400,
          error: "Bad Request",
          message: "O campo 'payload' é obrigatório.",
        })
      );
      return;
    }

    if (
      typeof data.payload.text !== "string" ||
      data.payload.text.trim().length === 0
    ) {
      console.error(
        "[WS: Middleware] Falha de validação: Payload.text inválido."
      );
      ws.send(
        JSON.stringify({
          status: 400,
          error: "Bad Request",
          message: "O campo 'payload.text' deve ser uma string não vazia.",
        })
      );
      return;
    }

    console.log("[WS: Middleware] Input validado com sucesso.");
    next();
  }

  private handleChatMessage(ws: WebSocket, data: any, next?: Function) {
    const textMessage = data.payload.text;

    console.log(`[WS: Handler] Processando mensagem: "${textMessage}"`);
    ws.send(
      JSON.stringify({
        status: 200,
        message: "Mensagem recebida e processada com sucesso.",
        received_text: textMessage,
        timestamp: new Date().toISOString(),
      })
    );
  }

  start(port: number): void {
    this.Modules();
    const server = this.server.listen(port);
    this.serverWs.listen(server);
  }
}
