import { CustomError } from "../../../../shared/domain/index.js";

interface CreateOrderDetailProps {
    productId: number;
    quantity: number;
}

interface CreateOrderProps {
    userId: string;
    address: unknown;
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
            const productId = Number(detail.productId);
            const quantity = Number(detail.quantity);

            if (!Number.isInteger(productId) || productId < 0) {
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

        // Sumando productos repetidos en los detalles del pedido
        const detailsByProduct = parsedDetails.reduce<CreateOrderDetailProps[]>((items, detail) => {
            const existingDetail = items.find(item => item.productId === detail.productId);

            if (existingDetail) {
                existingDetail.quantity += detail.quantity;
                return items;
            };

            items.push({ ...detail });
            return items;
        }, []);

        return new CreateOrderDto({
            userId,
            address,
            details: detailsByProduct
        });
    };
}
