import type { UserEntity, UserRepository } from "../../domain/index.js";
import type { UpdateUserDto } from "../index.js";



export interface UpdateUserUseCases{
    execute( dto: UpdateUserDto ): Promise<UserEntity>,
}

export class UpdateUser implements UpdateUserUseCases{

    constructor(
        private readonly repository: UserRepository,
    ){}


    async execute(dto: UpdateUserDto): Promise<UserEntity> {

        
        
        return this.repository.updateById( dto );
    }

}