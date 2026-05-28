import { CustomError } from "../../../../shared/domain/errors/custom-error.js";




export class LoginUserDto {
     private constructor( 
        public readonly email: string,
        public readonly password: string,
    ){}


    static create( props: {[key:string]: any}): [string?, LoginUserDto?]{
        
        const { email, password } = props;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if( !email ) {
            throw CustomError.badRequest('Email property is required');
        }

        if ( !emailRegex.test(email) ) {
            throw CustomError.badRequest('Invalid email format');
        }

        if( !password ) {
            throw CustomError.badRequest('Password property is required');
        }

        if( password.length < 8 ) {
            throw CustomError.badRequest('Password too short');
        }


        return [ '', new LoginUserDto(email, password)];
    }
}