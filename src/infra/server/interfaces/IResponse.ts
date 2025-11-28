export interface IResponse {
  status: (code: number) => IResponse;
  json: (data: any) => void;
  send: (data: any) => void;
}
