import { WebSocket } from "ws";

export interface InputMachineDto {
  ws: WebSocket;
  name: string;
  idUser: string;
}
