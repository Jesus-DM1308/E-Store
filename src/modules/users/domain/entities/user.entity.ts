export class UserEntity {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly lastName: string, 
        public readonly email: string,
        public readonly password: string,
        public readonly cel: string,
        public readonly isActive: boolean,
        public readonly userType: string,
        public readonly createdAt?: Date | null,
        public readonly updatedAt?: Date | null,
        public readonly deletedAt?: Date | null,
    ) {}

}