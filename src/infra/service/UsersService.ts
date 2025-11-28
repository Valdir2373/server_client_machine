import { FileInfo } from "basic-ftp";
import { UserInputDto } from "../../application/users/DTO/InputUser";
import { UserOutputDto } from "../../application/users/DTO/OutputUser";
import { CreateUser } from "../../application/users/useCase/CreateUser";
import { MessageQueueMachine } from "../../domain/entity/MessageQueueMachine";
import { MessageQueueUser } from "../../domain/entity/MessageQueueUser";
import { UserEntity } from "../../domain/entity/User";
import { IMachineRepository } from "../../domain/repository/IMachineRepository";
import { IMessageQueueMachineRepository } from "../../domain/repository/IMessageQueueMachineRepository";
import { IMessageQueueUserRepository } from "../../domain/repository/IMessageQueueUserRepository";
import { IUsersRepository } from "../../domain/repository/IUsersRepository";
import { IResponse } from "../server/interfaces/IResponse";
import fs from "fs/promises";

export class UsersService {
  private createUser: CreateUser;
  constructor(
    private usersRepository: IUsersRepository,
    private machineRepository: IMachineRepository,
    private messageQueueRepository: IMessageQueueUserRepository,
    private messageQueueMachineRepository: IMessageQueueMachineRepository,
    private createId: () => string
  ) {
    this.createUser = new CreateUser(this.usersRepository);
  }
  async saveUser(userInput: UserInputDto) {
    const user: UserEntity = UserEntity.build(userInput.name, this.createId);
    const userCreated = await this.createUser.execute(user);
    const userOutput: UserOutputDto = {
      name: userCreated.name,
      id: userCreated.id,
    };
    return userOutput;
  }
  async getAllUsers() {
    const users = this.usersRepository.getAllUser();
    return users;
  }
  public async sendCommandOfMachine(
    id: string,
    idMachine: string,
    command: string,
    res: IResponse | null
  ): Promise<boolean> {
    const machine = await this.machineRepository.getMachine(idMachine);
    if (!machine) throw new Error("machine not found");
    if (id === machine.idUser && res) {
      const codeQueue = await this.saveResponseOnQueueUser(res);
      machine.ws.send(
        JSON.stringify({
          command,
          type: "command",
          codeQueue,
        })
      );
      return false;
    } else if (id === machine.idUser) {
      machine.ws.send(
        JSON.stringify({
          command,
          type: "command",
        })
      );
      return true;
    }
    throw new Error("error desconhecido");
  }
  private async saveResponseOnQueueUser(res: IResponse): Promise<string> {
    const queue = MessageQueueUser.build(res);
    const queueMessage = await this.messageQueueRepository.saveResponseOnQueue(
      queue
    );
    return queueMessage.id;
  }
  private async saveResponseOnQueueMachine(
    ws: WebSocket
  ): Promise<MessageQueueMachine> {
    const machineQueue = MessageQueueMachine.build(ws);
    return machineQueue;
  }

  public async sendFileToMachine(
    compressedChunk: any,
    idMachine: string,
    fileDatas: any,
    res: IResponse
  ) {
    const machine = await this.machineRepository.getMachine(idMachine);
    if (!machine) return;
    const wsData = {
      type: "file",
      queue: await this.saveResponseOnQueueUser(res),
      chunk: compressedChunk.toString("base64"), // WebSocket envia String, então Base64 é necessário AQUI
      fileName: fileDatas.fileName,
      isLengthLarge: fileDatas.isLengthLarge,
      end: fileDatas.end,
      idFile: fileDatas.idFile ? fileDatas.idFile : this.createId(),
    };
    machine.ws.send(JSON.stringify(wsData));
  }
}
