

export class UserEntity {


    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly lastName: string, 
        public readonly email: string,
        public readonly password: string,
        public readonly cel: string,
        public readonly userType: string,
        public readonly createdAt?: Date | null,
        public readonly updatedAt?: Date | null,
    ) {}


    public static fromObject( object: {[key: string]: any}): UserEntity {
        const {id, name, last_name, email, password, cel,user_type, created_at, updated_at} = object;
        if( !id ) throw Error('Id is required');
        if( !name ) throw Error('Name is required');
        if( !last_name ) throw Error('Last name is required');
        if( !password ) throw Error('Password is required');
        if( !cel ) throw Error('Cel is required');
        if( !user_type ) throw Error('user type is required');

   

        return new UserEntity(
            id, name, last_name, email, password, cel, user_type, created_at, updated_at );
   }


}