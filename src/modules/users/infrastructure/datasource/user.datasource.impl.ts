import { eq } from "drizzle-orm";
import { db } from "../../../../shared/infrastructure/database/drizzle/connection.js";
import { usersTable } from "../../../../shared/infrastructure/database/drizzle/schema.js";

import type { RegisterUserDto, UpdateUserDto } from "../../application/index.js";
import { UserEntity, type UserDatasource } from "../../domain/index.js";



export class UserDatasourceImpl implements UserDatasource{


    async create(registerUserDto: RegisterUserDto): Promise<UserEntity> {


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
            .where(eq(usersTable.id, id));
    
        if(!user) throw new Error(`User with id ${ id } not found`);
        return UserEntity.fromObject(user);
    }


    async updateById(updateUserDto: UpdateUserDto): Promise<UserEntity> {
        
        await this.findById( updateUserDto.id );

        const [updatedUser] = await db.update(usersTable)
            .set( updateUserDto.values )
            .where(eq( usersTable.id, updateUserDto.id ))
            .returning();
        
        return UserEntity.fromObject( updatedUser! );
        
    }


    async deleteById(id: string): Promise<UserEntity> {
        await this.findById( id );

        const [deleted] = await db.delete(usersTable)
            .where(eq( usersTable.id, id ))
            .returning();
            
        return UserEntity.fromObject( deleted! );

    }

}

