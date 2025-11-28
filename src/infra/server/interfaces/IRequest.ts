export interface IRequest {
  body: any;
  params: any;
  query: any;
  headers: any;
  method: string;
  path: string;
  file?: any;
  get(name: string): string | undefined;
}
