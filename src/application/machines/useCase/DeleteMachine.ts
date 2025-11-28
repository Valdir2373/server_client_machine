import { IMachineRepository } from "../../../domain/repository/IMachineRepository";

export class DeleteMachine {
  constructor(private machineRepository: IMachineRepository) {}
  async execute(idMachine: string): Promise<boolean> {
    return await this.machineRepository.deleteMachines(idMachine);
  }
}
