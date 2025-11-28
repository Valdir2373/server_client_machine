import { MessageQueueMachine } from "../../domain/entity/MessageQueueMachine";
import { IDatabase } from "../../domain/repository/IDatabase";
import { IMessageQueueMachineRepository } from "../../domain/repository/IMessageQueueMachineRepository";

export class MessageQueueMachineRepository
  implements IMessageQueueMachineRepository
{
  private collectionName: string = "machines";
  constructor(private database: IDatabase) {}
  async deleteDatasFromQueue(code: string): Promise<boolean> {
    return await this.database.delete(this.collectionName, code);
  }
  async getDatasFromQueue(code: string): Promise<MessageQueueMachine> {
    const queue: MessageQueueMachine = await this.database.findOne(
      this.collectionName,
      code
    );
    await this.deleteDatasFromQueue(queue.id);
    return queue;
  }
  async saveResponseOnQueue(
    MessageQueueMachine: MessageQueueMachine
  ): Promise<MessageQueueMachine> {
    return await this.database.create(this.collectionName, MessageQueueMachine);
  }
}
