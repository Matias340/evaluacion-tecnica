import { OrderSource } from "../domain/orderSource";
import { OrderStatus } from "../domain/orderStatus";
import { RepairOrder } from "../domain/repairOrder";
import { diagnoseOrder } from "../services/repairOrderRules";

const mockOrder: RepairOrder = {
  id: "1",
  orderId: "ORD-1",
  customerId: "c1",
  vehicleId: "v1",
  status: OrderStatus.CREATED,
  subtotalEstimated: 0,
  authorizedAmount: undefined,
  realTotal: undefined,
  services: [],
  authorizations: [],
  events: [],
  errors: [],
  source: OrderSource.CLIENTE,
};

test("diagnosticar solo una orden en CREATED", () => {
  const result = diagnoseOrder(mockOrder);
  expect(result.status).toBe(OrderStatus.DIAGNOSED);
  expect(result.errors.length).toBe(0);
});
