import bcrypt from 'bcrypt';

export class BcryptAdapter {

  
    static hash( password: string ): string {
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync( password, salt );
    }

    
    static compare( password: string, hashed: string ): boolean {
        return bcrypt.compareSync( password, hashed );
    }

}