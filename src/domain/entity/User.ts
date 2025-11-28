export class UserEntity {
  public name: string;
  public id: string;
  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
  static build(name: string, createId: () => string) {
    const user = new UserEntity(name, createId());
    return user;
  }
}
