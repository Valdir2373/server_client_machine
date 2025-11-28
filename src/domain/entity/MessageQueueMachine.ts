export class MessageQueueMachine {
  public id: string;
  public message: any;
  constructor(id: string, message: WebSocket) {
    this.id = id;
    this.message = message;
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

  static build(message: WebSocket): MessageQueueMachine {
    const code = MessageQueueMachine.generateCode();
    const messageQueue = new MessageQueueMachine(code, message);
    return messageQueue;
  }
}
