import { CustomError } from "../../../../shared/domain/errors/custom-error.js";
import type { UserEntity, UserRepository } from "../../domain/index.js";


export interface GetUserUseCases {
    execute( id: string ): Promise<UserEntity>;
}



export class GetUser implements GetUserUseCases {


    constructor(
        private readonly repository: UserRepository,
    ){}

    async execute(id: string): Promise<UserEntity> {


        return this.repository.findById( id );
    }

}