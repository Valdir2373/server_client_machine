import { IResponse } from "../../infra/server/interfaces/IResponse";

export class MessageQueueUser {
  public id: string;
  public res: IResponse;
  constructor(id: string, res: IResponse) {
    this.id = id;
    this.res = res;
  }
  private static generateCode(): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    const codeLength = 6;
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  }

  static build(res: IResponse): MessageQueueUser {
    const code = MessageQueueUser.generateCode();
    const messageQueue = new MessageQueueUser(code, res);
    return messageQueue;
  }
}
