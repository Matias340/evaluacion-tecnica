import type { Authorization } from "./authorization";
import type { BusinessError } from "./businessError";
import type { Event } from "./event";
import type { OrderSource } from "./orderSource";
import type { OrderStatus } from "./orderStatus";
import type { Service } from "./service";

export interface RepairOrder {
  id: string;
  orderId: string;
  customerId: string;
  vehicleId: string;
  status: OrderStatus;
  subtotalEstimated: number;
  authorizedAmount?: number;
  realTotal?: number;
  authorizations: Authorization[];
  services: Service[];
  events: Event[];
  errors: BusinessError[];
  source: OrderSource;
}
