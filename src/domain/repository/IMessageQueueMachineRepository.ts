import { MessageQueueMachine } from "../entity/MessageQueueMachine";

export interface IMessageQueueMachineRepository {
  getDatasFromQueue(id: string): Promise<MessageQueueMachine>;
  saveResponseOnQueue(
    messageQueue: MessageQueueMachine
  ): Promise<MessageQueueMachine>;
  deleteDatasFromQueue(id: string): Promise<boolean>;
}
