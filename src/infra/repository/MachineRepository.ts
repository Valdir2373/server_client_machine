import { MachineEntity } from "../../domain/entity/Machine";
import { IDatabase } from "../../domain/repository/IDatabase";
import { IMachineRepository } from "../../domain/repository/IMachineRepository";

export class MachineRepository implements IMachineRepository {
  private collectionName: string = "machines";

  constructor(private database: IDatabase) {}
  saveMachine(machine: MachineEntity): Promise<MachineEntity> {
    return this.database.create(this.collectionName, machine);
  }
  getMachine(id: string): Promise<MachineEntity | null> {
    return this.database.findOne(
      this.collectionName,
      id
    ) as Promise<MachineEntity | null>;
  }
  getAllMachines(): Promise<MachineEntity[]> {
    return this.database.findAll(this.collectionName) as Promise<
      MachineEntity[]
    >;
  }
  async deleteMachines(id: string): Promise<boolean> {
    return await this.database.delete(this.collectionName, id);
  }
}
