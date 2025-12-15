import { useNavigate, useParams } from "react-router-dom";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { OrderStatus } from "../../domain/orderStatus";
import { useRepairOrders } from "../../hooks/useRepairOrders";
import { getVehicles } from "../../storage/vehicles";

const OrdenCustomerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, authorize, reauthorize, cancel } = useRepairOrders();

  const order = orders.find((o) => o.id === id);
  const vehicle = order ? getVehicles().find((v) => v.id === order.vehicleId) : null;

  if (!order) return <p>Orden no encontrada</p>;

  const canAccept = order.status === OrderStatus.DIAGNOSED;
  const canReauthorize = order.status === OrderStatus.WAITING_FOR_APPROVAL;

  const handleAccept = () => {
    if (canAccept) {
      authorize(order.id);
      alert("Propuesta aceptada ✅");
    }
  };

  const handleReauthorize = () => {
    if (canReauthorize) {
      const newAmount = order.realTotal ?? order.subtotalEstimated;
      reauthorize(order.id, newAmount, "Reautorización aceptada por cliente");
      alert("Reautorización aceptada ✅");
    }
  };

  const handleReject = () => {
    cancel(order.id);
    alert("Orden rechazada / solicitud de aclaración enviada ❌");
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-4 p-4">
      <button className="font-semibold text-gray-700 hover:text-gray-900 cursor-pointer" onClick={() => navigate(-1)}>
        ← Volver
      </button>
      <h1 className="text-xl font-bold">Orden {order.orderId}</h1>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Vehículo</h2>
        <p>
          {vehicle?.model} ({vehicle?.plate})
        </p>
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Montos</h2>
        <p>Subtotal estimado: ${order.subtotalEstimated.toFixed(2)}</p>
        <p>Monto autorizado: {order.authorizedAmount != null ? `$${order.authorizedAmount.toFixed(2)}` : "-"}</p>
        <p>
          Estado de autorización: <OrderStatusBadge status={order.status} />
        </p>
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Servicios propuestos</h2>
        {order.services.length > 0 ? (
          <ul className=" ml-3">
            {order.services.map((s) => (
              <li key={s.id}>
                <strong>{s.name}</strong> - {s.description ?? "Sin descripción"}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay servicios cargados</p>
        )}
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3 flex gap-2 flex-wrap">
        {canAccept && (
          <button
            onClick={handleAccept}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
          >
            Aceptar propuesta
          </button>
        )}
        {canReauthorize && (
          <button
            onClick={handleReauthorize}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 cursor-pointer"
          >
            Aceptar reautorización
          </button>
        )}
        {(canAccept || canReauthorize) && (
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
          >
            Rechazar / Solicitar cambios
          </button>
        )}
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Historial</h2>
        <ul className=" ml-3">
          {order.events.map((e) => (
            <li key={e.id}>
              {new Date(e.timestamp).toLocaleString()} — {e.type.replaceAll("_", " ")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default OrdenCustomerDetailsPage;
