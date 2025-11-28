import { UserEntity } from "../../domain/entity/User";
import { IDatabase } from "../../domain/repository/IDatabase";
import { IUsersRepository } from "../../domain/repository/IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private database: IDatabase;
  private collectionName: string = "users";

  constructor(database: IDatabase) {
    this.database = database;
  }

  inicialized() {
    const user = {
      name: "vavaadmin",
      id: "83750f18-cbd8-4fc1-8bb2-e29355932172",
    };
    this.saveUser(user);
  }

  saveUser(user: UserEntity): Promise<UserEntity> {
    return this.database.create(this.collectionName, user);
  }

  getUser(id: string): Promise<UserEntity | null> {
    return this.database.findOne(
      this.collectionName,
      id
    ) as Promise<UserEntity | null>;
  }

  getAllUser(): Promise<UserEntity[]> {
    return this.database.findAll(this.collectionName) as Promise<UserEntity[]>;
  }

  async deleteUser(id: string): Promise<void> {
    return this.database.delete(this.collectionName, id).then(() => {});
  }

  async updateUser(
    id: string,
    changes: Partial<UserEntity>
  ): Promise<UserEntity | null> {
    return this.database.update(
      this.collectionName,
      id,
      changes
    ) as Promise<UserEntity | null>;
  }
}
