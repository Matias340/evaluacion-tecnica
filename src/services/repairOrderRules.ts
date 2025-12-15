import { v4 as uuid } from "uuid";
import { BusinessErrorCode } from "../domain/businessErrorCodes";
import { OrderEventType } from "../domain/orderEventType";
import { OrderStatus } from "../domain/orderStatus";
import type { RepairOrder } from "../domain/repairOrder";
import { createError } from "../utils/createError";
import { createEvent } from "../utils/createEvent";

export function canModifyServices(order: RepairOrder): boolean {
  return order.status === OrderStatus.CREATED || order.status === OrderStatus.DIAGNOSED;
}

function isCancelled(order: RepairOrder): boolean {
  return order.status === OrderStatus.CANCELLED;
}

export function diagnoseOrder(order: RepairOrder): RepairOrder {
  if (isCancelled(order)) return order;

  if (order.status !== OrderStatus.CREATED) {
    return {
      ...order,
      errors: [
        ...order.errors,
        createError(
          BusinessErrorCode.INVALID_STATUS_TRANSITION,
          "Solo se puede diagnosticar una orden en estado CREATED"
        ),
      ],
    };
  }

  return {
    ...order,
    status: OrderStatus.DIAGNOSED,
    events: [
      ...order.events,
      createEvent(order.id, OrderEventType.ORDEN_DIAGNOSTICADA, OrderStatus.CREATED, OrderStatus.DIAGNOSED),
    ],
  };
}

export function authorizeOrder(order: RepairOrder): RepairOrder {
  if (isCancelled(order)) return order;

  if (order.status !== OrderStatus.DIAGNOSED) {
    return {
      ...order,
      errors: [
        ...order.errors,
        createError(
          BusinessErrorCode.INVALID_STATUS_TRANSITION,
          "No se puede autorizar una orden que no está diagnosticada"
        ),
      ],
    };
  }

  if (order.services.length === 0) {
    return {
      ...order,
      errors: [
        ...order.errors,
        createError(BusinessErrorCode.NO_SERVICES, "No se puede autorizar una orden sin servicios"),
      ],
    };
  }

  const subtotal = order.services.reduce((sum, service) => {
    const componentsTotal = service.components.reduce((cSum, c) => cSum + c.estimated, 0);
    return sum + service.laborEstimated + componentsTotal;
  }, 0);

  const authorizedAmount = Number((subtotal * 1.16).toFixed(2));

  return {
    ...order,
    status: OrderStatus.AUTHORIZED,
    subtotalEstimated: subtotal,
    authorizedAmount,
    authorizations: [
      ...order.authorizations,
      { id: uuid(), orderId: order.id, amount: authorizedAmount, createdAt: new Date().toISOString() },
    ],
    events: [
      ...order.events,
      createEvent(order.id, OrderEventType.ORDEN_AUTORIZADA, OrderStatus.DIAGNOSED, OrderStatus.AUTHORIZED),
    ],
  };
}

export function checkOvercost(order: RepairOrder): RepairOrder {
  if (!order.authorizedAmount || order.realTotal == null) return order;

  const limit = order.authorizedAmount * 1.1;

  if (order.realTotal > limit) {
    return {
      ...order,
      status: OrderStatus.WAITING_FOR_APPROVAL,
      errors: [
        ...order.errors,
        createError(BusinessErrorCode.REQUIRES_REAUTH, "El costo excede el 110% del monto autorizado"),
      ],
    };
  }

  return order;
}

export function reauthorizeOrder(order: RepairOrder, newAmount: number, comment?: string): RepairOrder {
  if (isCancelled(order)) return order;
  if (order.status !== OrderStatus.WAITING_FOR_APPROVAL) return order;

  return {
    ...order,
    status: OrderStatus.AUTHORIZED,
    authorizedAmount: newAmount,
    authorizations: [
      ...order.authorizations,
      {
        id: uuid(),
        orderId: order.id,
        amount: newAmount,
        createdAt: new Date().toISOString(),
        comment,
      },
    ],
    events: [...order.events, createEvent(order.id, OrderEventType.REAUTORIZADA)],
  };
}

export function cancelOrder(order: RepairOrder): RepairOrder {
  if (order.status === OrderStatus.CANCELLED) return order;

  return {
    ...order,
    status: OrderStatus.CANCELLED,
    events: [
      ...order.events,
      createEvent(order.id, OrderEventType.ORDEN_CANCELADA, order.status, OrderStatus.CANCELLED),
    ],
  };
}

export function startRepair(order: RepairOrder): RepairOrder {
  if (isCancelled(order)) return order;

  if (order.status !== OrderStatus.AUTHORIZED) {
    return {
      ...order,
      errors: [
        ...order.errors,
        createError(BusinessErrorCode.INVALID_STATUS_TRANSITION, "No se puede iniciar la reparación sin autorización"),
      ],
    };
  }

  return {
    ...order,
    status: OrderStatus.IN_PROGRESS,
    events: [
      ...order.events,
      createEvent(order.id, OrderEventType.ORDEN_EN_PROGRESO, OrderStatus.AUTHORIZED, OrderStatus.IN_PROGRESS),
    ],
  };
}

export function completeRepair(order: RepairOrder): RepairOrder {
  if (isCancelled(order)) return order;
  if (order.status !== OrderStatus.IN_PROGRESS) return order;

  const realTotal = order.services.reduce((sum, service) => {
    const labor = service.laborReal ?? service.laborEstimated;
    const componentsTotal = service.components.reduce((cSum, c) => cSum + (c.real ?? c.estimated), 0);
    return sum + labor + componentsTotal;
  }, 0);

  return {
    ...order,
    status: OrderStatus.COMPLETED,
    realTotal,
    events: [
      ...order.events,
      createEvent(order.id, OrderEventType.ORDEN_COMPLETADA, OrderStatus.IN_PROGRESS, OrderStatus.COMPLETED),
    ],
  };
}

export function deliverOrder(order: RepairOrder): RepairOrder {
  if (isCancelled(order)) return order;
  if (order.status !== OrderStatus.COMPLETED) return order;

  return {
    ...order,
    status: OrderStatus.DELIVERED,
    events: [
      ...order.events,
      createEvent(order.id, OrderEventType.ORDEN_ENTREGADA, OrderStatus.COMPLETED, OrderStatus.DELIVERED),
    ],
  };
}

export function updateRealTotal(order: RepairOrder, realTotal: number): RepairOrder {
  if (isCancelled(order)) return order;
  const updated = { ...order, realTotal };
  return checkOvercost(updated);
}
