import { CustomError } from "../../../../shared/domain/index.js";

interface CreateOrderDetailProps {
    productId: number;
    quantity: number;
}

interface CreateOrderProps {
    userId: string;
    address: unknown;
    deliveryDate?: Date;
    details: CreateOrderDetailProps[];
}

export class CreateOrderDto {
    private constructor(
        public readonly props: CreateOrderProps
    ){};

    static create(object: { [key: string]: any }): CreateOrderDto {
        const {
            userId,
            address,
            delivery_date,
            details
        } = object;

        if (!userId) {
            throw CustomError.badRequest('User id is required');
        };

        if (address === undefined || address === null) {
            throw CustomError.badRequest('Address is required');
        };

        if (!Array.isArray(details) || details.length === 0) {
            throw CustomError.badRequest('Order details are required');
        };

        const parsedDetails = details.map((detail, index) => {
            const productId = Number(detail.product_id);
            const quantity = Number(detail.quantity);

            if (!Number.isInteger(productId) || productId <= 0) {
                throw CustomError.badRequest(`Invalid product id at detail ${index + 1}`);
            };

            if (!Number.isInteger(quantity) || quantity <= 0) {
                throw CustomError.badRequest(`Invalid quantity at detail ${index + 1}`);
            };

            return {
                productId,
                quantity
            };
        });

        const detailsByProduct = parsedDetails.reduce<CreateOrderDetailProps[]>((acc, detail) => {
            const existingDetail = acc.find(item => item.productId === detail.productId);

            if (existingDetail) {
                existingDetail.quantity += detail.quantity;
                return acc;
            };

            acc.push({ ...detail });
            return acc;
        }, []);

        let deliveryDate: Date | undefined;
        if (delivery_date !== undefined) {
            deliveryDate = new Date(delivery_date);
            if (deliveryDate.toString() === 'Invalid Date') {
                throw CustomError.badRequest('Delivery date must be a valid date');
            };
        };

        return new CreateOrderDto({
            userId,
            address,
            ...(deliveryDate !== undefined ? { deliveryDate } : {}),
            details: detailsByProduct
        });
    };
}
