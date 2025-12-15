import { v4 as uuid } from "uuid";
import type { Event } from "../domain/event";
import { OrderEventType } from "../domain/orderEventType";
import { OrderStatus } from "../domain/orderStatus";

export function createEvent(
  orderId: string,
  type: OrderEventType,
  fromStatus?: OrderStatus,
  toStatus?: OrderStatus
): Event {
  return {
    id: uuid(),
    orderId,
    type,
    fromStatus,
    toStatus,
    timestamp: new Date().toISOString(),
  };
}
