


export class UpdateUserDto{

    private constructor(
        public readonly id: string,
        public readonly name?: string,
        public readonly lastName?: string, 
        public readonly email?: string,
        public readonly password?: string,
        public readonly cel?: string,
        public readonly userType?: string,
        public readonly updatedAt?: Date,
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
        
        const { id, name, last_name, email, password, cel ,user_type, updated_at } = props;
        let newUpdateAt = updated_at;


        if( !id ){
            return ['id must be a valid string'];
        }

        if ( email ) { 
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if ( !emailRegex.test(email) ) {
                return ['Invalid email format'];
            }
        }

        if( password ){
            if( password.length < 8 ) return ['Password too short'];
        }
        
        if( cel ) {
            if( cel.length < 10 ) return ['Phone too short'];
        }

        if ( user_type ) {
            const usersType = ['CLIENT', 'SELLER'];
            if ( !usersType.includes(user_type) ) {
                return ['Invalid user type'];
            }
        }


        if ( updated_at ) {
            newUpdateAt = new Date( updated_at)
            if ( newUpdateAt.toString() === 'Invalid Date' ) {
                return ['updatedAt must be a valid date']
            }
        }

        return [ '' , new UpdateUserDto( 
                id, name, last_name, email, password, cel, user_type, updated_at)];
    }


    
}


