import { BcryptAdapter } from "../../../../config/bcrypt.adapter.js";
import type { UserEntity, UserRepository } from "../../domain/index.js";
import { RegisterUserDto } from "../index.js";



export interface RegisterUserUseCases {
    execute( dto: RegisterUserDto): Promise<UserEntity>;
}


export class RegisterUser implements RegisterUserUseCases {

    constructor(
        private readonly repository: UserRepository,
    ){}


        
    async execute(dto: RegisterUserDto): Promise<UserEntity> {
        

        const hashedPassword = BcryptAdapter.hash( dto.password );
        
        
        const secureData = ({ 
            ...dto, 
            password: hashedPassword 
        }); 

        return this.repository.create( secureData as RegisterUserDto );
    }


}


