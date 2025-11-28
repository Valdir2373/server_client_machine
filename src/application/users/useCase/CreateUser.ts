import { UserEntity } from "../../../domain/entity/User";
import { IUsersRepository } from "../../../domain/repository/IUsersRepository";
// import { UserInputDto } from "../DTO/InputUser";

export class CreateUser {
  constructor(
    private userRepository: IUsersRepository // private createId: () => string
  ) {}
  async execute(user: UserEntity): Promise<UserEntity> {
    // const userEntity = UserEntity.build(userInput.name, this.createId);
    return this.userRepository.saveUser(user);
  }
}
