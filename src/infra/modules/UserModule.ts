import { IDatabase } from "../../domain/repository/IDatabase";
import { IMachineRepository } from "../../domain/repository/IMachineRepository";
import { IMessageQueueMachineRepository } from "../../domain/repository/IMessageQueueMachineRepository";
import { IMessageQueueUserRepository } from "../../domain/repository/IMessageQueueUserRepository";
import { IUsersRepository } from "../../domain/repository/IUsersRepository";
import { UsersControllers } from "../controller/UsersController";
import { MiddlewareAdapter } from "../middlewares/https/HttpsMiddlewares";
import { IHttpsMiddlewares } from "../middlewares/https/IMiddlewaresHttps";
import { IWssMiddlewares } from "../middlewares/wss/IWssMiddlewares";
import { MachineRepository } from "../repository/MachineRepository";
import { UsersRepository } from "../repository/UsersRepository";
import { UsersService } from "../service/UsersService";

export class UserModule {
  constructor(
    private createId: () => string,
    private database: IDatabase,
    private middleware: MiddlewareAdapter,
    private middlewareWs: IWssMiddlewares,
    private messageQueueUserRepository: IMessageQueueUserRepository,
    private messageQueueMachineRepository: IMessageQueueMachineRepository
  ) {
    const usersRepository: IUsersRepository = new UsersRepository(
      this.database
    );
    const machineRepository: IMachineRepository = new MachineRepository(
      this.database
    );
    const usersService: UsersService = new UsersService(
      usersRepository,
      machineRepository,
      this.messageQueueUserRepository,
      this.messageQueueMachineRepository,
      this.createId
    );
    new UsersControllers(usersService, this.middleware);
  }
}
