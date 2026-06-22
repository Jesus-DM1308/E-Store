import { CustomError } from "../../../../shared/domain/errors/custom-error.js";




export class LoginUserDto {
     private constructor( 
        public readonly email: string,
        public readonly password: string,
    ){}


    static create( props: {[key:string]: any}): [string?, LoginUserDto?]{
        
        let { password, email } = props;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;


        if( !email ) {
            throw CustomError.badRequest('Email property is required');
        }
        if( email && typeof email === 'string'){
            email = email.trim().toLowerCase();
        }

        if ( !emailRegex.test(email) ) {
            throw CustomError.badRequest('Invalid email format');
        }

   
        if( !password ) {
            throw CustomError.badRequest('Password property is required');
        }
        password = password.trim();
        if( !passRegex.test( password )){
            throw CustomError.badRequest('Invalid password format');
        }

        return [ '', new LoginUserDto(email, password)];
    }
}