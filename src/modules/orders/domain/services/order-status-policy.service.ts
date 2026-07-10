import { CustomError } from '../../../../shared/domain/index.js';
import {
  CANCELLABLE_ORDER_STATUSES,
  TRACKING_STATUS_FLOW,
} from '../constants/status.constant.js';
import { OrderStatusCode } from '../constants/order-status.constant.js';

export class OrderStatusPolicyService {
  static getNextTrackingStatus(
    currentStatusCode: OrderStatusCode,
  ): OrderStatusCode | null {
    const currentIndex = TRACKING_STATUS_FLOW.indexOf(
      currentStatusCode as (typeof TRACKING_STATUS_FLOW)[number],
    );

    if (
      currentIndex === -1 ||
      currentIndex === TRACKING_STATUS_FLOW.length - 1
    ) {
      return null;
    }

    return TRACKING_STATUS_FLOW[currentIndex + 1] ?? null;
  }

  static ensureCanCancel(currentStatusCode: OrderStatusCode): void {
    if (
      !CANCELLABLE_ORDER_STATUSES.includes(
        currentStatusCode as (typeof CANCELLABLE_ORDER_STATUSES)[number],
      )
    ) {
      throw CustomError.badRequest(
        'La orden solo puede cancelarse en estado PENDING o APPROVED.',
      );
    }
  }

  static ensureCanChangeStatus(
    currentStatusCode: OrderStatusCode,
    requestedStatusCode: OrderStatusCode,
  ): void {
    if (
      currentStatusCode === OrderStatusCode.CANCELLED ||
      currentStatusCode === OrderStatusCode.REFUNDED
    ) {
      throw CustomError.badRequest('La orden ya no puede cambiar de estado.');
    }

    if (requestedStatusCode === OrderStatusCode.CANCELLED) {
      throw CustomError.badRequest(
        'Para cancelar una orden utiliza la ruta de cancelacion.',
      );
    }

    if (
      requestedStatusCode === OrderStatusCode.REFUNDED &&
      currentStatusCode !== OrderStatusCode.DELIVERED
    ) {
      throw CustomError.badRequest(
        'La orden solo puede pasar a REFUNDED cuando su estado actual es DELIVERED.',
      );
    }

    if (
      currentStatusCode === OrderStatusCode.DELIVERED &&
      requestedStatusCode !== OrderStatusCode.REFUNDED
    ) {
      throw CustomError.badRequest(
        'La orden entregada solo puede cambiar a REFUNDED.',
      );
    }

    if (requestedStatusCode === OrderStatusCode.REFUNDED) {
      return;
    }

    const nextStatusCode = this.getNextTrackingStatus(currentStatusCode);

    if (!nextStatusCode) {
      throw CustomError.badRequest(
        'La orden no puede avanzar a otro estado de seguimiento.',
      );
    }

    if (requestedStatusCode !== nextStatusCode) {
      throw CustomError.badRequest(
        `La orden solo puede cambiar de ${currentStatusCode} a ${nextStatusCode}.`,
      );
    }
  }
}
