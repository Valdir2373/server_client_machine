import { InputMachineDto } from "../../application/machines/dto/InputMachine";
import { OutputMachine } from "../../application/machines/dto/OutputMachine";
import { CreateMachine } from "../../application/machines/useCase/CreateMachine";
import { DeleteMachine } from "../../application/machines/useCase/DeleteMachine";
import { MachineEntity } from "../../domain/entity/Machine";
import { IMachineRepository } from "../../domain/repository/IMachineRepository";
import { IMessageQueueUserRepository } from "../../domain/repository/IMessageQueueUserRepository";
import { IUsersRepository } from "../../domain/repository/IUsersRepository";

export class MachineService {
  private createMachine: CreateMachine;
  private deleteMachineOnMemory: DeleteMachine;
  constructor(
    private machineRepository: IMachineRepository,
    private userRepository: IUsersRepository,
    private createId: () => string,
    private messageQueueRepository: IMessageQueueUserRepository
  ) {
    this.deleteMachineOnMemory = new DeleteMachine(this.machineRepository);
    this.createMachine = new CreateMachine(this.machineRepository);
  }
  public async registerMachine(
    machineInputDto: InputMachineDto
  ): Promise<undefined | OutputMachine> {
    const machineEntity = MachineEntity.build(
      machineInputDto.name,
      machineInputDto.idUser,
      machineInputDto.ws,
      this.createId
    );

    const user = await this.getUserOfMachine(machineEntity.idUser);
    if (!user) return;
    machineEntity.ws.on("close", async () => {
      await this.deleteMachine(machineEntity.id);
    });
    machineEntity.ws.on("message", async (data) => {
      // this.handleMessageOfMachine(data);
    });

    this.createMachine.execute(machineEntity);
    return {
      name: machineEntity.name,
      idUser: machineEntity.idUser,
      id: machineEntity.id,
    };
  }
  public async deleteMachine(idMachine: string) {
    return await this.deleteMachineOnMemory.execute(idMachine);
  }
  public async getUserOfMachine(idUser: string) {
    const user = await this.userRepository.getUser(idUser);
    return user;
  }
  public async getAllMachines(): Promise<OutputMachine[]> {
    const machinesEntity = await this.machineRepository.getAllMachines();
    const machinesOutput: OutputMachine[] = machinesEntity.map((e) => {
      return {
        name: e.name,
        id: e.id,
        idUser: e.idUser,
      };
    });
    return machinesOutput;
  }

  public async getMachine(id: string) {
    const machine = await this.machineRepository.getMachine(id);
    if (!machine) return;
    const machineOutput: OutputMachine = {
      name: machine.name,
      idUser: machine.idUser,
      id: machine.id,
    };
    return machineOutput;
  }
  // public async handleMessageOfMachine(text: any) {
  //   const data = JSON.parse(text.toString());
  //   switch (data.type) {
  //     case "replyUser":
  //       await this.sendMessageToUser(data.message, data.codeQueue);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  public async sendMessageToUser(message: string, codeQueue: string) {
    const queue = await this.messageQueueRepository.getQueue(codeQueue);

    queue.res.json({ type: "machine", message });
  }
}
