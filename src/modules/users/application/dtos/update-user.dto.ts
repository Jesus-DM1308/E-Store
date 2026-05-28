import { CustomError } from "../../../../shared/domain/errors/custom-error.js";



export class UpdateUserDto{

    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly lastName?: string, 
        public readonly email?: string,
        public readonly password?: string,
        public readonly cel?: string,
        public readonly userType?: string,
    ){}


    get values() {
        const returnObj: {[key: string]: any} = {};

        if( this.name ) returnObj['name'] = this.name;

        if( this.lastName ) returnObj['last_name'] = this.lastName;

        if( this.email ) returnObj['email'] = this.email;
        if( this.password ) returnObj['password'] = this.password;

        if( this.cel ) returnObj['cel'] = this.cel;

        if( this.userType ) returnObj['user_type'] = this.userType;

        //if( this.updatedAt ) returnObj['updated_at'] = this.updatedAt;

        returnObj['updated_at'] = new Date();

        return returnObj;
    }


    static create(  props: {[key:string]: any}): [string?, UpdateUserDto?] {
        
        let {name, last_name, password, cel } = props;
        const { id, email,user_type } = props;
        //let newUpdateAt = updated_at;

        const nameRegex = /^[A-ZÁÉÍÓÚÑa-zñáéíóúü][ ]?[A-ZÁÉÍÓÚÑa-zñáéíóúü]+(?:[ ]?[A-ZÁÉÍÓÚÑa-zñáéíóúü]+)*$/;


        // if( !id ){
        //     return ['id must be a valid string'];
        // }

        if( name ){
            
            if( typeof name !== 'string' ){
                return ['Name must be a valid text string']
            }

            name = name.trim();
            if( !nameRegex.test( name )){
                return ['Invalid name format'];
            }

        }

        if( last_name ){

            if( typeof last_name !== 'string' ){
                return ['Last name must be a valid text string'];
            }

            last_name = last_name.trim();
            if( !nameRegex.test( last_name )){
                return ['Invalid last name format'];
            }

        }


        if ( email ) { 
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if ( !emailRegex.test(email) ) {
                return ['Invalid email format'];
            }
        }

        // if( password ){
        //     if( password.length < 8 ) return ['Password too short'];
        // }


        if( password ){ // minimo    MAY        min         num          caracter        8 caracteres
            const passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
            //validar si es string
            if( typeof password !== 'string'){
                return ['Password must be a valid text string']
            }

            password = password.trim();
            if( !passRegex.test( password )){
                return ['Invalid password format'];
            }

        }


        
        if( cel ){
            const number = 10;
            cel = cel.trim();

            // validar que sea una cadena
            if( typeof cel !== 'string' ){
                return ['Phone must be a valid text string'];
            }

            //comprobar si no lleva algun otro caracter aparte de numeros
            if( isNaN(Number( cel ))){
                return ['Phone must contain only numbers'];
            }

            //validar la cantidad de caracteres quitando los espacios
            if(  cel.length !== number ){
                return ['Phone must be 10 digits'];
            }

        }



        if ( user_type ) {
            const usersType = ['CLIENT', 'SELLER'];
            if ( !usersType.includes(user_type) ) {
                return ['Invalid user type'];
            }
        }


        // if ( updated_at ) {
        //     newUpdateAt = new Date( updated_at)
        //     if ( newUpdateAt.toString() === 'Invalid Date' ) {
        //         return ['updatedAt must be a valid date']
        //     }
        // }

        return [ '' , new UpdateUserDto( 
                id, name, last_name, email, password, cel, user_type)];
    }


    
}


