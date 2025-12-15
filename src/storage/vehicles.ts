import type { Vehicle } from "../domain/vehicle";
import { loadFromStorage, saveToStorage } from "./storage";

const STORAGE_KEY = "vehicles";

export function getVehicles(): Vehicle[] {
  return loadFromStorage<Vehicle[]>(STORAGE_KEY, []);
}

export function saveVehicles(vehicles: Vehicle[]) {
  saveToStorage(STORAGE_KEY, vehicles);
}

export function getVehicleById(id: string): Vehicle | undefined {
  return getVehicles().find((v) => v.id === id);
}
