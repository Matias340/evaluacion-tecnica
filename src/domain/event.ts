import type { OrderEventType } from "./orderEventType";
import type { OrderStatus } from "./orderStatus";

export interface Event {
  id: string;
  orderId: string;
  type: OrderEventType;
  fromStatus?: OrderStatus;
  toStatus?: OrderStatus;
  timestamp: string;
}
