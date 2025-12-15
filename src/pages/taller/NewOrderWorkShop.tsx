import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderEventType } from "../../domain/orderEventType";
import { OrderSource } from "../../domain/orderSource";
import { OrderStatus } from "../../domain/orderStatus";
import { addCustomer } from "../../storage/customers";
import { getRepairOrders, saveRepairOrders } from "../../storage/repairOrders";
import { getVehicles, saveVehicles } from "../../storage/vehicles";

const NewOrderWorkShop = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");

  function handleSubmit() {
    const customerId = crypto.randomUUID();
    const vehicleId = crypto.randomUUID();
    const internalId = crypto.randomUUID();
    const visibleOrderId = `ORD-${Date.now()}`;

    addCustomer({ id: customerId, name, phone });

    saveVehicles([...getVehicles(), { id: vehicleId, model, plate, customerId }]);

    const orders = getRepairOrders();

    orders.push({
      id: internalId,
      orderId: visibleOrderId,
      customerId,
      vehicleId,
      status: OrderStatus.CREATED,

      subtotalEstimated: 0,
      authorizedAmount: undefined,
      realTotal: undefined,

      services: [],
      authorizations: [],
      events: [
        {
          id: crypto.randomUUID(),
          orderId: internalId,
          type: OrderEventType.ORDEN_CREADA,
          timestamp: new Date().toISOString(),
        },
      ],
      errors: [],
      source: OrderSource.TALLER,
    });

    saveRepairOrders(orders);
    navigate("/taller/ordenes");
  }

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-xl font-bold">Nueva orden</h1>

      <input
        className="border border-gray-800 pl-3 py-1 rounded-md"
        placeholder="Cliente"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border border-gray-800 pl-3 py-1 rounded-md"
        placeholder="Teléfono"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className="border border-gray-800 pl-3 py-1 rounded-md"
        placeholder="Modelo vehículo"
        value={model}
        onChange={(e) => setModel(e.target.value)}
      />
      <input
        className="border border-gray-800 pl-3 py-1 rounded-md"
        placeholder="Patente"
        value={plate}
        onChange={(e) => setPlate(e.target.value)}
      />

      <button className="bg-blue-500 text-white font-semibold cursor-pointer rounded-md py-1" onClick={handleSubmit}>
        Guardar
      </button>
    </div>
  );
};

export default NewOrderWorkShop;
