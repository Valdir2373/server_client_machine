import { MachineEntity } from "../entity/Machine";

export interface IMachineRepository {
  saveMachine(user: MachineEntity): Promise<MachineEntity>;
  getMachine(id: string): Promise<MachineEntity | null>;
  getAllMachines(): Promise<MachineEntity[]>;
  deleteMachines(id: string): Promise<boolean>;
}
