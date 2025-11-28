import { MessageQueueUser } from "../entity/MessageQueueUser";

export interface IMessageQueueUserRepository {
  getQueue(id: string): Promise<MessageQueueUser>;
  saveResponseOnQueue(
    messageQueue: MessageQueueUser
  ): Promise<MessageQueueUser>;
  deleteQueue(id: string): Promise<boolean>;
}
