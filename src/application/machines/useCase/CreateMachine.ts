import { MachineEntity } from "../../../domain/entity/Machine";
import { IMachineRepository } from "../../../domain/repository/IMachineRepository";

export class CreateMachine {
  constructor(private MachineRepository: IMachineRepository) {}
  async execute(machine: MachineEntity): Promise<MachineEntity> {
    return await this.MachineRepository.saveMachine(machine);
  }
}
