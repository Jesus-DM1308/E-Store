import { BcryptAdapter } from "../../../../config/bcrypt.adapter.js";
import { JwtAdapter } from "../../../../config/jwt.adapter.js";
import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import { UserRepository } from "../../domain/index.js";
import { LoginUserDto } from "../index.js";


export interface LoginUserUseCase {
    execute( dto: LoginUserDto ): Promise<{
        token: string;
        user: { id: string; name: string; email: string; userType: string; }
    }>;
}

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly userRepository: UserRepository
    ) {}

    async execute( dto: LoginUserDto ) {
      
        const user = await this.userRepository.findByEmail( dto.email );
        if ( !user ) throw CustomError.badRequest('Incorrect credentials');

       

        const isPasswordMatch = BcryptAdapter.compare( dto.password, user.password );
   
        //const isPasswordMatch = dto.password === user.password; 
        if ( !isPasswordMatch ) throw CustomError.badRequest('Incorrect credentials');

       
        const token = await JwtAdapter.generateToken({ id: user.id, role: user.userType });
        if ( !token ) throw CustomError.internalServer();

        
        return {
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                userType: user.userType
            }
        };
    }
}