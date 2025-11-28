import { UserEntity } from "../entity/User";

export interface IUsersRepository {
  saveUser(user: UserEntity): Promise<UserEntity>;
  getUser(id: string): Promise<UserEntity | null>;
  getAllUser(): Promise<UserEntity[]>;
  deleteUser(id: string): Promise<void>;
  updateUser(
    id: string,
    changes: Partial<UserEntity>
  ): Promise<UserEntity | null>;
}
