import { IDatabase } from "../../domain/repository/IDatabase";
import { IMessageQueueUserRepository } from "../../domain/repository/IMessageQueueUserRepository";
import { MachineController } from "../controller/MachineController";
import { IHttpsMiddlewares } from "../middlewares/https/IMiddlewaresHttps";
import { IWssMiddlewares } from "../middlewares/wss/IWssMiddlewares";
import { MachineRepository } from "../repository/MachineRepository";
import { UsersRepository } from "../repository/UsersRepository";
import { MachineService } from "../service/MachineService";

export class MachinesModules {
  constructor(
    private database: IDatabase,
    private serverWss: IWssMiddlewares,
    private serverHttps: IHttpsMiddlewares,
    private createId: () => string,
    private IMessageQueueUserRepository: IMessageQueueUserRepository
  ) {
    const machineRepository = new MachineRepository(this.database);
    const usersRepository = new UsersRepository(this.database);
    usersRepository.inicialized();
    const service = new MachineService(
      machineRepository,
      usersRepository,
      this.createId,
      this.IMessageQueueUserRepository
    );
    new MachineController(service, this.serverHttps, this.serverWss);
  }
}
