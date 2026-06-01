import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import type { UserEntity, UserRepository } from "../../domain/index.js";



export interface DeleteUserUseCases {
    execute( id: string ): Promise<UserEntity>;
}



export class DeleteUser implements DeleteUserUseCases {


    constructor(
        private readonly repository: UserRepository,
    ){}

    async execute(id: string): Promise<UserEntity> {

      
        return this.repository.deleteById( id );
    }

}