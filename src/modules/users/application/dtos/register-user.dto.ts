import { CustomError } from "../../../../shared/domain/errors/custom-error.js";



export class RegisterUserDto {

    private constructor(
        public readonly name: string,
        public readonly lastName: string, 
        public readonly email: string,
        public readonly password: string,
        public readonly cel: string,
        public readonly userType: string,
    ){}


    static create( props: {[key:string]: any}): [string?, RegisterUserDto?]{

        let {name, last_name, password, cel, email, user_type } = props;
       

        const nameRegex = /^[A-ZÁÉÍÓÚÑa-zñáéíóúü][ ]?[A-ZÁÉÍÓÚÑa-zñáéíóúü]+(?:[ ]?[A-ZÁÉÍÓÚÑa-zñáéíóúü]+)*$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-.]).{8,}$/;
 

        const usersType = ['CLIENT', 'SELLER'];
        const number = 10;

        
        if( !name ) {
            throw CustomError.badRequest('Name property is required');
        }
        name = name.trim();
        if( !nameRegex.test( name ) ){
            throw CustomError.badRequest('Invalid name format');
        }


        if( !last_name ) {
            throw CustomError.badRequest('Last Name property is required');
        }
        last_name = last_name.trim();
        if( !nameRegex.test( last_name )){
            throw CustomError.badRequest('Invalid last name format');
        }
        

        if( email && typeof email === 'string'){
            email = email.trim().toLowerCase();
        }
        //email = email.trim();
        if( !email ) {
            throw CustomError.badRequest('Email property is required');
        }
        if ( !emailRegex.test(email) ) {
            throw CustomError.badRequest('Invalid email format');
        }
        

        password = password.trim();
        if( !password ) {
            throw CustomError.badRequest('Password property is required');
        }
        if( !passRegex.test( password )){
            throw CustomError.badRequest('Invalid password format');
        }

        
        cel = String(cel).trim();
        if( !cel  ) {
            throw CustomError.badRequest('Cel property is required');
        }
        if( isNaN(Number( cel ))){
            throw CustomError.badRequest('Phone must contain only numbers');
        }
        if( cel.length !== number ) {
            throw CustomError.badRequest('Phone must be 10 digits');
        }
        

        if( !user_type ) {
            throw CustomError.badRequest('User type property is required');
        }
        
        user_type = user_type.trim().toUpperCase();
        if( !usersType.includes(user_type )) {
            throw CustomError.badRequest('Invalid user type');
        }
        

        return ['', new RegisterUserDto( name, last_name, email, password, cel, user_type )];

    }

}