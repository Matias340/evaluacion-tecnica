import { useEffect, useState } from "react";
import { Vehicle } from "../domain/vehicle";
import { mockVehicles } from "../mocks/vehicles";
import { getVehicles, saveVehicles } from "../storage/vehicles";

function initializeVehicles(): Vehicle[] {
  const data = getVehicles();

  if (data.length === 0) {
    saveVehicles(mockVehicles);
    return mockVehicles;
  }

  return data;
}

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    setVehicles(initializeVehicles());
  }, []);

  function addVehicle(vehicle: Vehicle) {
    if (vehicles.some((v) => v.plate === vehicle.plate)) {
      throw new Error("Ya existe un vehículo con esa placa");
    }

    const updated = [...vehicles, vehicle];
    setVehicles(updated);
    saveVehicles(updated);
  }

  function getVehiclesByCustomer(customerId: string) {
    return vehicles.filter((v) => v.customerId === customerId);
  }

  return {
    vehicles,
    addVehicle,
    getVehiclesByCustomer,
  };
}
