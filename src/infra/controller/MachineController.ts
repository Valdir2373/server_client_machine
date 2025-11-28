import { WebSocket } from "ws";
import { InputMachineDto } from "../../application/machines/dto/InputMachine";
import { IWssMiddlewares } from "../middlewares/wss/IWssMiddlewares";
import { MachineService } from "../service/MachineService";
import { IHttpsMiddlewares } from "../middlewares/https/IMiddlewaresHttps";
import { IRequest } from "../server/interfaces/IRequest";
import { IResponse } from "../server/interfaces/IResponse";

export class MachineController {
  constructor(
    private MachineService: MachineService,
    private serverHttps: IHttpsMiddlewares,
    private serverWss: IWssMiddlewares
  ) {
    this.serverWss.registerRouterWs(
      "machineRegister",
      this.registerMachine.bind(this),
      this.AuthMachineRegister.bind(this)
    );
    this.serverWss.registerRouterWs("replyUser", this.sendMsgToUser.bind(this));
    this.serverHttps.registerRouter(
      "get",
      "/machines",
      this.getAllMachine.bind(this)
    );
  }
  private async registerMachine(ws: WebSocket, data: any, next?: Function) {
    const machineInputDto: InputMachineDto = {
      ws,
      name: data.machine.name,
      idUser: data.machine.idUser,
    };
    const machine = await this.MachineService.registerMachine(machineInputDto);
    if (machine) {
      ws.send(
        JSON.stringify({
          status: 200,
          message: "Machine registred with successful.",
          timestamp: new Date().toISOString(),
          machine,
        })
      );
    } else {
      ws.send(
        JSON.stringify({
          status: 404,
          message: "user not found",
          timestamp: new Date().toISOString(),
          machine,
        })
      );
    }
  }

  private async sendMsgToUser(ws: WebSocket, data: any, next?: Function) {
    await this.MachineService.sendMessageToUser(data.message, data.queue);
    ws.send(JSON.stringify({ message: "mensagem enviada com sucesso" }));
  }

  private async getAllMachine(req: IRequest, res: IResponse) {
    const allMachines = await this.MachineService.getAllMachines();
    res.json(allMachines);
  }

  private AuthMachineRegister(ws: WebSocket, data: any, next: Function) {
    const validateProperty = (machineInput: InputMachineDto) => {
      return (
        typeof machineInput.idUser === "string" &&
        typeof machineInput.name === "string"
      );
    };
    const machineInputDto: InputMachineDto = {
      ws,
      name: data.machine.name,
      idUser: data.machine.idUser,
    };
    if (validateProperty(machineInputDto)) next();
    else {
      ws.send(
        JSON.stringify({
          status: 400,
          message: "error, machine invalid",
        })
      );
      return;
    }
  }
}
