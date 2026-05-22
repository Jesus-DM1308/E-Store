import type { UserDatasource, UserEntity, UserRepository } from "../../domain/index.ts";
import { RegisterUserDto } from '../../application/index.js';
import type { UpdateUserDto } from "../../application/index.ts";




export class UserRepositoryImpl implements UserRepository {


    constructor(
        private readonly datasource: UserDatasource
    ){}

    create( registerUserDto: RegisterUserDto):Promise<UserEntity> {
        return this.datasource.create( registerUserDto );
    }


    getAll(): Promise<UserEntity[]> {
        return this.datasource.getAll();
    }

    findById(id: string): Promise<UserEntity> {
        return this.datasource.findById( id );
    }

    updateById(updateUserDto: UpdateUserDto ): Promise<UserEntity> {
        return this.datasource.updateById( updateUserDto );
    }

    deleteById(id: string): Promise<UserEntity> {
        return this.datasource.deleteById( id );
    }
    
}