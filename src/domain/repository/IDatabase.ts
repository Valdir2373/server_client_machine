export interface IDatabase {
  findOne(collectionName: string, id: string): Promise<any | undefined>;
  findAll(collectionName: string): Promise<any[]>;
  create(collectionName: string, entity: any): Promise<any>;
  update(
    collectionName: string,
    id: string,
    changes: Partial<any>
  ): Promise<any | null>;
  delete(collectionName: string, id: string): Promise<boolean>;
}
