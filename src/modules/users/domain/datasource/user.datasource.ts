import type { RegisterUserDto, UpdateUserDto } from "../../application/index.js";
import type { UserEntity } from "../entities/user.entity.js";




export abstract class UserDatasource {

    abstract create( registerUserDto: RegisterUserDto): Promise<UserEntity>;
    abstract getAll(): Promise<UserEntity[]>;
    abstract findById( id: string): Promise<UserEntity>;
    abstract findByEmail( email: string): Promise<UserEntity | null>
    
    abstract updateById( updateUserDto: UpdateUserDto ): Promise<UserEntity>;
    abstract deleteById( id: string): Promise<UserEntity>;
    

}