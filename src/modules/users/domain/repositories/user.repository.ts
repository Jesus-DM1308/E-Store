import { RegisterUserDto } from '../dtos/users/register-user';
import { UpdateUserDto } from '../dtos/users/update-user';
import { UserEntity } from "../entities/user.entity";




export abstract class UserRepository {
    
    
    abstract create( registerUserDto: RegisterUserDto): Promise<UserEntity>;


    abstract getAll(): Promise<UserEntity[]>;

    abstract findById( id: string): Promise<UserEntity>;
    abstract updateById( id: string): Promise<UserEntity>;
    abstract updateById( updateUserDto: UpdateUserDto ): Promise<UserEntity>;
    abstract deleteById( id: string): Promise<UserEntity>;
    




}