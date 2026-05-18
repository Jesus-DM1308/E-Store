


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

        const { name, last_name, email, password, cel,user_type } = props;

        if( !name ) return ['Name property is required'];
        if( !last_name ) return ['Last Name property is required'];
        if( !email ) return ['Email property is required'];
        if( !password ) return ['Password property is required'];
        if( password.length < 8 ) return ['Password too short'];

        if( !cel  ) return ['Cel property is required'];
        if( !user_type ) return ['User type property is required'];



        return ['', new RegisterUserDto( name, last_name, email, password, cel, user_type )];

    }

}