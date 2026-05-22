import type { UserEntity, UserRepository } from "../../domain/index.js";
import type { RegisterUserDto } from "../index.js";



export interface RegisterUserUseCases {
    execute( dto: RegisterUserDto): Promise<UserEntity>;
}


export class RegisterUser implements RegisterUserUseCases {

    constructor(
        private readonly repository: UserRepository,
    ){}


    async execute(dto: RegisterUserDto): Promise<UserEntity> {
        return this.repository.create(dto);
    }


}


