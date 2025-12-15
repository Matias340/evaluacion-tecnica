import { useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { OrderStatus } from "../../domain/orderStatus";
import type { RepairOrder } from "../../domain/repairOrder";
import { useRepairOrders } from "../../hooks/useRepairOrders";
import { getCustomerById } from "../../storage/customers";
import { getVehicleById } from "../../storage/vehicles";

const OrderWorkShopPage = () => {
  const { orders } = useRepairOrders();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");

  const [search, setSearch] = useState("");

  function matchesSearch(order: RepairOrder) {
    const customer = getCustomerById(order.customerId);
    const term = search.toLowerCase();

    return order.orderId.toLowerCase().includes(term) || customer?.name.toLowerCase().includes(term);
  }

  const filteredOrders = orders.filter((order) => {
    const statusOk = statusFilter === "ALL" || order.status === statusFilter;
    const searchOk = !search || matchesSearch(order);

    return statusOk && searchOk;
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold">Órdenes del taller</h1>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full">
        <select
          className="w-full sm:w-60 border border-gray-900 rounded-md px-3 py-2 border-2"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "ALL")}
        >
          <option value="ALL">Todos</option>
          <option value={OrderStatus.CREATED}>Creada</option>
          <option value={OrderStatus.DIAGNOSED}>Diagnosticada</option>
          <option value={OrderStatus.AUTHORIZED}>Autorizada</option>
          <option value={OrderStatus.IN_PROGRESS}>En progreso</option>
          <option value={OrderStatus.WAITING_FOR_APPROVAL}>Pendiente aprobación</option>
          <option value={OrderStatus.COMPLETED}>Completada</option>
          <option value={OrderStatus.DELIVERED}>Entregada</option>
          <option value={OrderStatus.CANCELLED}>Cancelada</option>
        </select>

        <input
          className="w-full sm:flex-1 border border-gray-900 rounded-md px-3 py-2 border-2"
          placeholder="Buscar por folio o cliente"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        {filteredOrders.map((order) => {
          const customer = getCustomerById(order.customerId);
          const vehicle = getVehicleById(order.vehicleId);

          return (
            <div key={order.id} className="shadow-lg border border-gray-100 p-3 rounded">
              <div className="flex justify-between">
                <strong>{order.orderId}</strong>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="text-sm">
                <div>Cliente: {customer?.name ?? "-"}</div>
                <div>
                  Vehículo: {vehicle?.model} ({vehicle?.plate})
                </div>
                <div>
                  Autorizado: ${order.authorizedAmount?.toFixed(2) ?? "-"} | Real: ${order.realTotal?.toFixed(2) ?? "-"}
                </div>
                <div>
                  <button
                    className="cursor-pointer mt-3 border cursor-pointer px-2 py-1 rounded-md border-gray-800 border-2 font-semibold"
                    onClick={() => navigate(`/taller/ordenes/${order.id}`)}
                  >
                    Ver Orden
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredOrders.length === 0 && <p className="text-sm text-gray-500">No se encontraron órdenes</p>}
      </div>
    </div>
  );
};

export default OrderWorkShopPage;
