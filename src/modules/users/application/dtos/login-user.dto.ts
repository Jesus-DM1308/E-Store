



export class LoginUserDto {
     private constructor( 
        public readonly email: string,
        public readonly password: string,
    ){}


    static create( props: {[key:string]: any}): [string?, LoginUserDto?]{
        
        const { email, password } = props;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if( !email ) return ['Email property is required'];
        if ( !emailRegex.test(email) ) return ['Invalid email format'];

        if( !password ) return ['Password property is required'];
        if( password.length < 8 ) return ['Password too short'];


        return [ '', new LoginUserDto(email, password)];
    }
}