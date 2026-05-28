import type { Request, Response } from "express";
import type { UserRepository } from "../../domain/index.js";
import { DeleteUser, GetUser, GetUsers, RegisterUser, UpdateUser, RegisterUserDto, UpdateUserDto, LoginUser } from "../../application/index.js";
import { LoginUserDto } from "../../application/dtos/login-user.dto.js";
import { CustomError } from "../../../../shared/domain/errors/custom-error.js";



export class UsersController {

    constructor(
        private readonly userRepository: UserRepository,
    ){}



    public loginUser = async ( req: Request, res: Response ) => {
        
        const [ error, loginUserDto ] = LoginUserDto.create( req.body );
        if ( error ) return res.status(400).json({ error });

        const data = await new LoginUser( this.userRepository ).execute( loginUserDto! );
        return res.json( data );
    }


    public getUsers = async(req: Request, res: Response ) => {

        const users = await new GetUsers( this.userRepository ).execute();
        return res.json( users );
        
    }
    
    public getUserById = async(req: any, res: Response ) => {

        const id = req.params.id as string;

        //console.log(req.userTokenData);
        const { id: tokenUserId } = req.userTokenData;
        if ( id !== tokenUserId ) {
            throw CustomError.forbidden('You cannot see other users profiles.')
            //return res.status(403).json({ error: 'Forbidden: You cannot see other users profiles.' });
        }

        const user = await new GetUser( this.userRepository ).execute( id );
        return res.json( user);

    }

    public registerUser = async( req: Request, res: Response ) => {

        const [ error, registerUserDto] = RegisterUserDto.create( req.body );
        if( error ) return res.status( 400 ).json({ error });

        const user = await new RegisterUser( this.userRepository ).execute( registerUserDto! );
        return res.status(201).json( user );       

    }

    public updateUser = async( req: any, res: Response ) => {

        const id = req.params.id as string;

        const { id: tokenUserId } = req.userTokenData; 
        if ( id !== tokenUserId ) {
            throw CustomError.forbidden(`You cannot modify other people's profiles.`);
            //return res.status(403).json({ error: `Forbidden: You cannot modify other people's profiles.` });
        }

        const [error, updateUserDto] = UpdateUserDto.create({ ...req.body, id });
        if( error ) return res.status( 400 ).json({ error });

        const user = await new UpdateUser( this.userRepository ).execute( updateUserDto! );
        return res.json( user );

    }


    public deleteUser = async( req: any, res: Response ) => {

        const id = req.params.id as string;

        const { id: tokenUserId } = req.userTokenData;
        if ( id !== tokenUserId ) {
            throw CustomError.forbidden('You cannot delete other accounts.')
            //return res.status(403).json({ error: 'Forbidden: You cannot delete other accounts.' });
        }

        const user = await new DeleteUser( this.userRepository ).execute( id );
        return res.json( user );

    }
    

}