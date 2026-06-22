import { eq, and } from "drizzle-orm";
import { db } from "../../../../shared/infrastructure/database/drizzle-orm/connection.js";
import { usersTable } from "../../../../shared/infrastructure/database/drizzle-orm/schema.js";

import type { RegisterUserDto, UpdateUserDto } from "../../application/index.js";
import { UserEntity, type UserDatasource } from "../../domain/index.js";
import { BcryptAdapter } from "../../../../config/bcrypt.adapter.js";
import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import e from "express";



export class UserDatasourceImpl implements UserDatasource{


    async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {

        // const existUser = await this.findByEmail(registerUserDto.email);
        // if(existUser){
        //     throw CustomError.conflict(`Email ${registerUserDto.email} is already registered`)
        // }

        const [user] = await db.insert(usersTable).values({
                name: registerUserDto.name,
                last_name: registerUserDto.lastName,
                email: registerUserDto.email,
                password: registerUserDto.password,
                cel: registerUserDto.cel,
                user_type: registerUserDto.userType,
        }).returning();

        return UserEntity.fromObject( user! );
    }


    async getAll(): Promise<UserEntity[]> {

        const users = await db.select().from(usersTable);
        return users.map( user => UserEntity.fromObject( user ));
        
    }

    async findById(id: string): Promise<UserEntity> {

        const [user] = await db.select()
            .from(usersTable)
            .where(and(
                eq(usersTable.id, id),
                eq(usersTable.is_active, true)
            ));
    
        if(!user) throw CustomError.notFound(`User with id ${ id } not found`);
        return UserEntity.fromObject(user);
    }


    async updateById(updateUserDto: UpdateUserDto): Promise<UserEntity> {
        
        const currentUser = await this.findById( updateUserDto.id );

        const dataToUpdate = updateUserDto.values;

        if ( dataToUpdate.email && dataToUpdate.email !== currentUser.email ) {
            const userWithThatEmail = await this.findByEmail( dataToUpdate.email );
            
            // existe ese correo y NO es el usuario actual ?
            if ( userWithThatEmail && userWithThatEmail.id !== updateUserDto.id ) {
                throw CustomError.badRequest('El correo electrónico ya se encuentra registrado por otro usuario.');
            }
        }
       
        if( dataToUpdate.password ){
            dataToUpdate.password = BcryptAdapter.hash( dataToUpdate.password );
        }

        const [updatedUser] = await db.update(usersTable)
            .set( dataToUpdate )
            .where(and(
                eq( usersTable.id, updateUserDto.id ),
                eq(usersTable.is_active, true)
            ))
            .returning();
        
        if ( !updatedUser ) {
            throw CustomError.badRequest('No se pudo actualizar el usuario.');
        }
    
        return UserEntity.fromObject( updatedUser! );
        
    }

    private applyTimestampEmail(originalEmail: string ): string{
        const timestamp = Date.now(); 
        const [user, domain] = originalEmail.split('@');
        return `${user}+deleted${timestamp}@${domain}`;
    }

    async deleteById(id: string): Promise<UserEntity> {
        const userFound = await this.findById( id );

        const modifiedEmail = this.applyTimestampEmail(userFound.email);
        
        const response = await db.update(usersTable)
        .set({ 
            is_active: false, 
            deleted_at: new Date(),
            email: modifiedEmail
        })
        .where(eq(usersTable.id, id))
        .returning();
        
        const deletedUser = response[0];
        
        if(!deletedUser){
            throw CustomError.internalServer();
        }
        
        return UserEntity.fromObject( deletedUser );
        
        // const [deleted] = await db.delete(usersTable)
        //     .where(eq( usersTable.id, id ))
        //     .returning();
    }

    
    async findByEmail( email: string ): Promise<UserEntity | null> {
        
        const [user] = await db.select()
            .from( usersTable )
            .where( and(
                eq( usersTable.email, email ),
                eq(usersTable.is_active, true)
            ))

        if ( !user ) return null;

        return UserEntity.fromObject( user );
    }
    

}

