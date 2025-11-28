import { WebSocket } from "ws";

export class MachineEntity {
  public name: string;
  public idUser: string;
  public id: string;
  public ws: WebSocket;
  constructor(name: string, ws: WebSocket, id: string, idUser: string) {
    this.name = name;
    this.idUser = idUser;
    this.id = id;
    this.ws = ws;
  }
  static build(
    name: string,
    idUser: string,
    ws: WebSocket,
    createId: () => string
  ): MachineEntity {
    const user = new MachineEntity(name, ws, createId(), idUser);
    return user;
  }
}
