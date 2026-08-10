import { BcryptAdapter } from "../../../../config/bcrypt.adapter.js";
import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
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



        const existUser = await this.repository.findByEmail( dto.email );
                if(existUser){
                    throw CustomError.conflict(`Email is already registered`)
                }
        

        return this.repository.create( secureData as RegisterUserDto );
    }


}


