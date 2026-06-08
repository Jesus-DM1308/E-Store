import { CustomError } from "../../../../shared/domain/index.js";

interface UpdateOrderStatusProps {
    statusId: number;
}

export class UpdateOrderStatusDto {
    private constructor(
        public readonly props: UpdateOrderStatusProps
    ){};

    static create(object: { [key: string]: any }): UpdateOrderStatusDto {
        const statusId = Number(object.status_id);

        if (!Number.isInteger(statusId) || statusId <= 0) {
            throw CustomError.badRequest('Status id must be a positive integer');
        };

        return new UpdateOrderStatusDto({ statusId });
    };
}
