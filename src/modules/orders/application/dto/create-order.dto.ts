import { CustomError } from '../../../../shared/domain/index.js';

interface CreateOrderDetailProps {
  productUserId: number;
  quantity: number;
}

interface CreateOrderProps {
  userId: string;
  address: unknown;
  whoReceive: string;
  details: CreateOrderDetailProps[];
}

export class CreateOrderDto {
  private constructor(public readonly props: CreateOrderProps) {}

  static create(object: { [key: string]: any }): CreateOrderDto {
    const { userId, address, whoReceive, details } = object;

    if (!userId) {
      throw CustomError.badRequest('El id del usuario es requerido.');
    }

    if (address === undefined || address === null) {
      throw CustomError.badRequest('La direccion es requerida.');
    }

    if (!whoReceive?.trim()) {
      throw CustomError.badRequest('El nombre de quien recibe es requerido.');
    }

    if (!Array.isArray(details) || details.length === 0) {
      throw CustomError.badRequest('Los detalles de la orden son requeridos.');
    }

    const parsedDetails = details.map((detail, index) => {
      const productUserId = Number(detail.productUserId);
      const quantity = Number(detail.quantity);

      if (!Number.isInteger(productUserId) || productUserId <= 0) {
        throw CustomError.badRequest(
          `Id del producto del vendedor no valida en el detalle ${index + 1}.`,
        );
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw CustomError.badRequest(
          `Cantidad no valida en el detalle ${index + 1}.`,
        );
      }

      return {
        productUserId,
        quantity,
      };
    });

    const detailsBySellerProduct = parsedDetails.reduce<
      CreateOrderDetailProps[]
    >((items, detail) => {
      const existingDetail = items.find(
        (item) => item.productUserId === detail.productUserId,
      );

      if (existingDetail) {
        existingDetail.quantity += detail.quantity;
        return items;
      }

      items.push({ ...detail });
      return items;
    }, []);

    return new CreateOrderDto({
      userId,
      address,
      whoReceive,
      details: detailsBySellerProduct,
    });
  }
}
