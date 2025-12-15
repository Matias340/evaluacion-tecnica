import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { OrderStatus } from "../../domain/orderStatus";
import { useRepairOrders } from "../../hooks/useRepairOrders";
import { getVehicles } from "../../storage/vehicles";

const OrdenesClientesPage = () => {
  const navigate = useNavigate();
  const { orders } = useRepairOrders();
  const [search, setSearch] = useState("");

  const customerId = localStorage.getItem("customerId");
  if (!customerId) return <p>Cliente no logueado</p>;

  const customerOrders = orders.filter((o) => o.customerId === customerId);

  function matchesSearch(order: (typeof orders)[number]) {
    const vehicle = getVehicles().find((v) => v.id === order.vehicleId);
    const term = search.toLowerCase();
    return order.orderId.toLowerCase().includes(term) || vehicle?.model.toLowerCase().includes(term);
  }

  const filteredOrders = customerOrders.filter((o) => !search || matchesSearch(o));

  function requiresAction(order: (typeof orders)[number]) {
    return order.status === OrderStatus.DIAGNOSED || order.status === OrderStatus.WAITING_FOR_APPROVAL;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Mis órdenes</h1>

      <input
        placeholder="Buscar por folio o vehículo"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-2 p-2 rounded w-full"
      />

      <div className="flex flex-col gap-2">
        {filteredOrders.map((order) => {
          const vehicle = getVehicles().find((v) => v.id === order.vehicleId);

          return (
            <div key={order.id} className="border p-3 rounded">
              <div className="flex justify-between">
                <strong>{order.orderId}</strong>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="text-sm">
                <div>
                  Vehículo: {vehicle?.model} ({vehicle?.plate})
                </div>
                <div>
                  Estimado: ${order.subtotalEstimated.toFixed(2)} | Autorizado:{" "}
                  {order.authorizedAmount != null ? `$${order.authorizedAmount.toFixed(2)}` : "-"}
                </div>
                {requiresAction(order) && <div className="text-red-600 font-semibold">Pendiente de acción</div>}
              </div>
              <div>
                <button
                  className="cursor-pointer mt-3 border cursor-pointer px-2 py-1 rounded-md border-gray-800 border-2 font-semibold"
                  onClick={() => navigate(`/cliente/ordenes/${order.id}`)}
                >
                  Ver Orden
                </button>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && <p className="text-sm text-gray-500">No se encontraron órdenes</p>}
      </div>
    </div>
  );
};

export default OrdenesClientesPage;
