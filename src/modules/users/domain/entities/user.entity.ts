export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly password: string,
    public readonly cel: string,
    public readonly isActive: boolean,
    public readonly userType: string,
    public readonly deleteAt?: Date | null,
    public readonly createdAt?: Date | null,
    public readonly updatedAt?: Date | null,
  ) {}

  public static fromObject(object: { [key: string]: any }): UserEntity {
    const {
      id,
      name,
      lastName,
      email,
      password,
      cel,
      isActive,
      userType,
      deletedAt,
      createdAt,
      updatedAt,
    } = object;
    if (!id) throw Error('Id is required');
    if (!name) throw Error('Name is required');
    if (!lastName) throw Error('Last name is required');
    if (!password) throw Error('Password is required');
    if (!cel) throw Error('Cel is required');
    if (!userType) throw Error('user type is required');

    return new UserEntity(
      id,
      name,
      lastName,
      email,
      password,
      cel,
      isActive,
      userType,
      deletedAt,
      createdAt,
      updatedAt,
    );
  }
}
