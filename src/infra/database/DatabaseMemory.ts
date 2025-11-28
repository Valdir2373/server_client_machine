import { IDatabase } from "../../domain/repository/IDatabase";

export class DatabaseMemory implements IDatabase {
  private collections: Record<string, any[]>;

  constructor() {
    this.collections = {};
  }

  private getCollection(collectionName: string): any[] {
    if (!this.collections[collectionName]) {
      this.collections[collectionName] = [];
    }
    return this.collections[collectionName];
  }

  async findOne(collectionName: string, id: string): Promise<any | undefined> {
    const collection = this.getCollection(collectionName);
    return collection.find((entity) => entity.id === id);
  }

  async findAll(collectionName: string): Promise<any[]> {
    return this.getCollection(collectionName);
  }

  async create(collectionName: string, entity: any): Promise<any> {
    if (!(await this.findOne(collectionName, entity.id))) {
      const collection = this.getCollection(collectionName);
      collection.push(entity);
      return entity;
    }
    throw new Error("Entity already exist");
  }

  async update(
    collectionName: string,
    id: string,
    changes: Partial<any>
  ): Promise<any | null> {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex((entity) => entity.id === id);

    if (index === -1) {
      return null;
    }

    const updatedEntity = {
      ...collection[index],
      ...changes,
      id: id,
    };

    collection[index] = updatedEntity;
    return updatedEntity;
  }

  async delete(collectionName: string, id: string): Promise<boolean> {
    const collection = this.getCollection(collectionName);
    const initialLength = collection.length;
    this.collections[collectionName] = collection.filter(
      (entity) => entity.id !== id
    );

    return this.collections[collectionName].length < initialLength;
  }
}
