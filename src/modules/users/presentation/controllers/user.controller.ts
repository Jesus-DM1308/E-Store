import type { Request, Response } from "express";
import type { UserRepository } from "../../domain/index.js";
import { DeleteUser, GetUser, GetUsers, RegisterUser, UpdateUser, RegisterUserDto, UpdateUserDto } from "../../application/index.js";



export class UsersController {

    constructor(
        private readonly userRepository: UserRepository,
    ){}




    public getUsers = async(req: Request, res: Response ) => {

        const users = await new GetUsers( this.userRepository ).execute();
        return res.json( users );
        
    }
    
    public getUserById = async(req: Request, res: Response ) => {

        const id = req.params.id as string;

        const user = await new GetUser( this.userRepository ).execute( id );
        return res.json( user);

    }

    public registerUser = async( req: Request, res: Response ) => {

        const [ error, registerUserDto] = RegisterUserDto.create( req.body );
        if( error ) return res.status( 400 ).json({ error });

        const user = await new RegisterUser( this.userRepository ).execute( registerUserDto! );
        return res.status(201).json( user );       

    }

    public updateUser = async( req: Request, res: Response ) => {

        const id = req.params.id as string;
        const [error, updateUserDto] = UpdateUserDto.create({ ...req.body, id });
        if( error ) return res.status( 400 ).json({ error });

        const user = await new UpdateUser( this.userRepository ).execute( updateUserDto! );
        return res.json( user );

    }


    public deleteUser = async( req: Request, res: Response ) => {

        const id = req.params.id as string;

        const user = await new DeleteUser( this.userRepository ).execute( id );
        return res.json( user );

    }
    

}