import { MessageQueueUser } from "../../domain/entity/MessageQueueUser";
import { IDatabase } from "../../domain/repository/IDatabase";
import { IMessageQueueUserRepository } from "../../domain/repository/IMessageQueueUserRepository";

export class MessageQueueUserRepository implements IMessageQueueUserRepository {
  private collectionName: string = "users";
  constructor(private database: IDatabase) {}
  async deleteQueue(code: string): Promise<boolean> {
    return await this.database.delete(this.collectionName, code);
  }
  async getQueue(code: string): Promise<MessageQueueUser> {
    const queue: MessageQueueUser = await this.database.findOne(
      this.collectionName,
      code
    );
    await this.deleteQueue(queue.id);
    return queue;
  }
  async saveResponseOnQueue(
    MessageQueueUser: MessageQueueUser
  ): Promise<MessageQueueUser> {
    return await this.database.create(this.collectionName, MessageQueueUser);
  }
}
