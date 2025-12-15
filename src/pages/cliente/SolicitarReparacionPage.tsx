import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderEventType } from "../../domain/orderEventType";
import { OrderSource } from "../../domain/orderSource";
import { OrderStatus } from "../../domain/orderStatus";
import type { RepairOrder } from "../../domain/repairOrder";
import { useRepairOrders } from "../../hooks/useRepairOrders";
import { getVehicles } from "../../storage/vehicles";

const SolicitarReparacionPage = () => {
  const navigate = useNavigate();
  const { addOrder } = useRepairOrders();
  const [vehicleId, setVehicleId] = useState("");
  const [description, setDescription] = useState("");

  const customerId = localStorage.getItem("customerId");
  if (!customerId) return <p>Cliente no logueado</p>;

  const vehicles = getVehicles().filter((v) => v.customerId === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleId || !description) return alert("Completa todos los campos");

    const orderId = `ORD-${Date.now()}`;
    const newOrder: RepairOrder = {
      id: crypto.randomUUID(),
      orderId,
      customerId: customerId!,
      vehicleId,
      status: OrderStatus.CREATED,
      subtotalEstimated: 0,
      authorizedAmount: undefined,
      realTotal: undefined,
      authorizations: [],
      services: [],
      events: [
        {
          id: crypto.randomUUID(),
          orderId: "",
          type: OrderEventType.ORDEN_CREADA,
          timestamp: new Date().toISOString(),
        },
      ],
      errors: [],
      source: OrderSource.CLIENTE,
    };

    newOrder.events = newOrder.events.map((ev) => ({ ...ev, orderId: newOrder.id }));

    addOrder(newOrder);

    alert("Orden creada correctamente ✅");

    navigate("/cliente/ordenes");
  };

  return (
    <div className="max-w-md mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Solicitar reparación</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label>
          Vehículo
          <select
            className="ml-5 border border-gray-900 border-2 rounded-md px-3 py-1"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
          >
            <option value="">Selecciona un vehículo</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.model} ({v.plate})
              </option>
            ))}
          </select>
        </label>

        <label>
          Descripción del problema
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el problema de tu vehículo"
            className="border mt-2 border-2 p-2 rounded w-full"
          />
        </label>

        <button
          type="submit"
          className="bg-blue-600 cursor-pointer font-semibold text-white py-2 rounded hover:bg-blue-700"
        >
          Solicitar reparación
        </button>
      </form>
    </div>
  );
};

export default SolicitarReparacionPage;
