import { useEffect, useState } from "react";
import type { RepairOrder } from "../domain/repairOrder";
import type { Service } from "../domain/service";
import {
  authorizeOrder,
  cancelOrder,
  completeRepair,
  deliverOrder,
  diagnoseOrder,
  reauthorizeOrder,
  startRepair,
  updateRealTotal,
} from "../services/repairOrderRules";
import { getRepairOrders, saveRepairOrders } from "../storage/repairOrders";

export function useRepairOrders() {
  const [orders, setOrders] = useState<RepairOrder[]>([]);

  useEffect(() => {
    setOrders(getRepairOrders());
  }, []);

  function updateOrder(updated: RepairOrder) {
    const next = orders.map((o) => (o.id === updated.id ? updated : o));
    setOrders(next);
    saveRepairOrders(next);
  }

  function diagnose(id: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(diagnoseOrder(order));
  }

  function authorize(id: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(authorizeOrder(order));
  }

  function cancel(id: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(cancelOrder(order));
  }

  function reauthorize(id: string, newAmount: number, comment?: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(reauthorizeOrder(order, newAmount, comment));
  }

  function start(id: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(startRepair(order));
  }

  function complete(id: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(completeRepair(order));
  }

  function deliver(id: string) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(deliverOrder(order));
  }

  function setRealTotal(id: string, total: number) {
    const order = orders.find((o) => o.id === id);
    if (!order) return;
    updateOrder(updateRealTotal(order, total));
  }

  function addService(orderId: string, service: Service) {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    const updated: RepairOrder = {
      ...order,
      services: [...order.services, service],
    };

    updateOrder(updated);
  }

  function addOrder(newOrder: RepairOrder) {
    const next = [...orders, newOrder];
    setOrders(next);
    saveRepairOrders(next);
  }

  return {
    orders,
    diagnose,
    authorize,
    cancel,
    reauthorize,
    start,
    complete,
    deliver,
    setRealTotal,
    addService,
    addOrder,
  };
}
