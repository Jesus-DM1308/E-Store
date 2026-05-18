import type { RegisterUserDto, UpdateUserDto } from "../../application/index.ts";
import type { UserEntity } from "../entities/user.entity.ts";




export abstract class UserRepository {
    
    
    abstract create( registerUserDto: RegisterUserDto): Promise<UserEntity>;


    abstract getAll(): Promise<UserEntity[]>;

    abstract findById( id: string): Promise<UserEntity>;
    abstract updateById( id: string): Promise<UserEntity>;
    abstract updateById( updateUserDto: UpdateUserDto ): Promise<UserEntity>;
    abstract deleteById( id: string): Promise<UserEntity>;
    




}