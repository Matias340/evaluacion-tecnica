import type { RepairOrder } from "../domain/repairOrder";

const STORAGE_KEY = "repair_orders";

export function getRepairOrders(): RepairOrder[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as RepairOrder[];
  } catch {
    return [];
  }
}

export function saveRepairOrders(orders: RepairOrder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function clearRepairOrders() {
  localStorage.removeItem(STORAGE_KEY);
}
