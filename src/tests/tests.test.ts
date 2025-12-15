import { beforeEach, describe, expect, it } from "vitest";
import { OrderEventType } from "../domain/orderEventType";
import { OrderStatus } from "../domain/orderStatus";
import type { RepairOrder } from "../domain/repairOrder";
import {
  authorizeOrder,
  cancelOrder,
  completeRepair,
  deliverOrder,
  diagnoseOrder,
  reauthorizeOrder,
  startRepair,
} from "../services/repairOrderRules";

let baseOrder: RepairOrder;

beforeEach(() => {
  baseOrder = {
    id: "test-order-1",
    orderId: "ORD-123",
    customerId: "c1",
    vehicleId: "v1",
    status: OrderStatus.CREATED,
    subtotalEstimated: 0,
    authorizedAmount: undefined,
    realTotal: undefined,
    services: [
      {
        id: "s1",
        orderId: "test-order-1",
        name: "Motor",
        laborEstimated: 100,
        components: [],
      },
    ],
    authorizations: [],
    events: [],
    errors: [],
    source: "CLIENTE",
  };
});

describe("RepairOrderRules", () => {
  it("flujo completo de orden correctamente", () => {
    let order = { ...baseOrder };

    order = diagnoseOrder(order);
    expect(order.status).toBe(OrderStatus.DIAGNOSED);
    expect(order.errors.length).toBe(0);
    expect(order.events[0].type).toBe(OrderEventType.ORDEN_DIAGNOSTICADA);

    order = authorizeOrder(order);
    expect(order.status).toBe(OrderStatus.AUTHORIZED);
    expect(order.authorizedAmount).toBeDefined();
    expect(order.errors.length).toBe(0);

    order = startRepair(order);
    expect(order.status).toBe(OrderStatus.IN_PROGRESS);

    order = completeRepair(order);
    expect(order.status).toBe(OrderStatus.COMPLETED);
    expect(order.realTotal).toBeGreaterThan(0);

    order = deliverOrder(order);
    expect(order.status).toBe(OrderStatus.DELIVERED);
  });

  it("intento de diagnosticar sin estar en CREATED genera error", () => {
    let order = { ...baseOrder, status: OrderStatus.DIAGNOSED };
    const result = diagnoseOrder(order);

    expect(result.status).toBe(OrderStatus.DIAGNOSED);
    expect(result.errors.some((e) => e.code === "INVALID_STATUS_TRANSITION")).toBe(true);
  });

  it("intento de autorizar sin servicios genera error", () => {
    let order = { ...baseOrder, services: [], status: OrderStatus.DIAGNOSED };
    const result = authorizeOrder(order);

    expect(result.status).toBe(OrderStatus.DIAGNOSED);
    expect(result.errors.some((e) => e.code === "NO_SERVICES")).toBe(true);
  });

  it("reauthorization funciona correctamente", () => {
    let order = { ...baseOrder, status: OrderStatus.WAITING_FOR_APPROVAL, realTotal: 150 };
    order = reauthorizeOrder(order, 160, "Reautorización de prueba");

    expect(order.status).toBe(OrderStatus.AUTHORIZED);
    expect(order.authorizedAmount).toBe(160);
    expect(order.authorizations.length).toBe(1);
    expect(order.events.some((e) => e.type === OrderEventType.REAUTORIZADA)).toBe(true);
  });

  it("cancelación bloquea otras acciones", () => {
    let order = { ...baseOrder, status: OrderStatus.CREATED };
    order = cancelOrder(order);

    expect(order.status).toBe(OrderStatus.CANCELLED);

    const result = diagnoseOrder(order);
    expect(result.status).toBe(OrderStatus.CANCELLED);
    expect(result.errors.length).toBe(0);
  });
});
