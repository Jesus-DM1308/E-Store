import { UserEntity } from '../../domain/entities/user.entity.js';

export class UserMapper {

  static toEntity( object: { [ key: string ]: any } ): UserEntity {
    
    const {
      id,
      name,
      lastName,
      email,
      password,
      cel,
      isActive,
      userType,
      createdAt,
      updatedAt,
      deletedAt
    } = object;


    return new UserEntity(
      id,
      name,
      lastName,
      email,
      password,
      cel,
      isActive,
      userType,
      createdAt,
      updatedAt,
      deletedAt
    );
  }
}