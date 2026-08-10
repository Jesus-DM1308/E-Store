import type { UserEntity, UserRepository } from "../../domain/index.js";




export interface GetUsersUseCases{
    execute( ): Promise<UserEntity[]>;
}


export class GetUsers implements GetUsersUseCases{

    constructor(
        private readonly repository: UserRepository,
    ){}

    async execute(): Promise<UserEntity[]> {
        return this.repository.getAll();
    }


}