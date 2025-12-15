import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge";
import { OrderEventType } from "../../domain/orderEventType";
import { OrderStatus } from "../../domain/orderStatus";
import type { Service } from "../../domain/service";
import { useRepairOrders } from "../../hooks/useRepairOrders";
import { getCustomers } from "../../storage/customers";
import { getVehicles } from "../../storage/vehicles";

const OrdenDetalleTallerPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showAddService, setShowAddService] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [laborEstimated, setLaborEstimated] = useState<number>(0);

  const { orders, diagnose, authorize, start, complete, deliver, cancel, reauthorize, addService } = useRepairOrders();

  const order = orders.find((o) => o.id === id);

  if (!order) {
    return <p>Orden no encontrada</p>;
  }

  const customer = getCustomers().find((c) => c.id === order.customerId);
  const vehicle = getVehicles().find((v) => v.id === order.vehicleId);

  const canEditServices = order.status === OrderStatus.CREATED || order.status === OrderStatus.DIAGNOSED;

  const limit110 = order.authorizedAmount != null ? order.authorizedAmount * 1.1 : null;

  function serviceEstimated(service: Service) {
    const components = service.components.reduce((sum, c) => sum + c.estimated, 0);
    return service.laborEstimated + components;
  }

  function serviceReal(service: Service) {
    const components = service.components.reduce((sum, c) => sum + (c.real ?? 0), 0);
    return (service.laborReal ?? 0) + components;
  }

  function describeEvent(type: OrderEventType) {
    switch (type) {
      case OrderEventType.ORDEN_CREADA:
        return "Orden creada";
      case OrderEventType.ORDEN_DIAGNOSTICADA:
        return "Orden diagnosticada";
      case OrderEventType.ORDEN_AUTORIZADA:
        return "Orden autorizada";
      case OrderEventType.REAUTORIZADA:
        return "Orden reautorizada";
      case OrderEventType.ORDEN_EN_PROGRESO:
        return "Reparación iniciada";
      case OrderEventType.ORDEN_COMPLETADA:
        return "Reparación completada";
      case OrderEventType.ORDEN_ENTREGADA:
        return "Orden entregada";
      case OrderEventType.ORDEN_CANCELADA:
        return "Orden cancelada";
      default:
        return type;
    }
  }

  if (!order) {
    return <p>Orden no encontrada</p>;
  }

  function handleAddService() {
    if (!serviceName || laborEstimated <= 0) return;

    const newService: Service = {
      id: crypto.randomUUID(),
      orderId: order.id,
      name: serviceName,
      description: serviceDescription || undefined,
      laborEstimated,
      components: [],
    };

    addService(order.id, newService);

    setServiceName("");
    setServiceDescription("");
    setLaborEstimated(0);
    setShowAddService(false);
  }

  const canDiagnose = order.status === OrderStatus.CREATED;

  const canAuthorize = order.status === OrderStatus.DIAGNOSED;

  const canStart = order.status === OrderStatus.AUTHORIZED;

  const canComplete = order.status === OrderStatus.IN_PROGRESS;

  const canDeliver = order.status === OrderStatus.COMPLETED;

  const canCancel = order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED;

  return (
    <div className="flex flex-col gap-4">
      <button className="font-semibold cursor-pointer" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <h1 className="text-xl font-bold">Orden {order.orderId}</h1>

      <div className="flex items-center gap-2">
        <OrderStatusBadge status={order.status} />
      </div>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Cliente y vehículo</h2>
        <div>Cliente: {customer?.name}</div>
        <div>Teléfono: {customer?.phone}</div>
        <div>
          Vehículo: {vehicle?.model} ({vehicle?.plate})
        </div>
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Montos</h2>
        <div>Subtotal estimado: {order.subtotalEstimated != null ? `$${order.subtotalEstimated.toFixed(2)}` : "-"}</div>
        <div>Monto autorizado: {order.authorizedAmount != null ? `$${order.authorizedAmount.toFixed(2)}` : "-"}</div>
        <div>Límite 110%: {limit110 != null ? `$${limit110.toFixed(2)}` : "-"}</div>
        <div>Costo real: {order.realTotal != null ? `$${order.realTotal.toFixed(2)}` : "-"}</div>
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3 flex flex-col gap-3">
        <h2 className="font-semibold">Servicios y refacciones</h2>

        {order.services.length === 0 && <p className="text-sm text-gray-500">Sin servicios cargados</p>}

        {order.services.map((service) => (
          <div key={service.id} className="border border-gray-100 shadow-md rounded p-3">
            <div className="flex justify-between">
              <strong>{service.name}</strong>
              <span className="text-sm text-gray-600">
                Estimado: ${serviceEstimated(service).toFixed(2)}
                {service.laborReal != null && <> | Real: ${serviceReal(service).toFixed(2)}</>}
              </span>
            </div>

            {service.description && <p className="text-sm text-gray-500">{service.description}</p>}

            <div className="mt-2 pl-4">
              <p className="text-sm font-medium">Refacciones</p>

              {service.components.length === 0 && <p className="text-sm text-gray-400">Sin refacciones</p>}

              <ul className="text-sm">
                {service.components.map((c) => (
                  <li key={c.id} className="flex justify-between">
                    <span>{c.name}</span>
                    <span>
                      Est: ${c.estimated.toFixed(2)}
                      {c.real != null && <> | Real: ${c.real.toFixed(2)}</>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {canEditServices && (
          <button className="text-md cursor-pointer underline self-start" onClick={() => setShowAddService(true)}>
            + Agregar servicio
          </button>
        )}
      </section>

      {showAddService && (
        <div className="border border-gray-100 shadow-md p-3 rounded mt-3">
          <h4 className="font-semibold mb-2">Nuevo servicio</h4>

          <input
            className="border border-2 rounded-md pl-3 p-1 w-full mb-2"
            placeholder="Nombre del servicio"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />

          <textarea
            className="border border-2 rounded-md pl-3 pt-2 w-full mb-2"
            placeholder="Descripción (opcional)"
            value={serviceDescription}
            onChange={(e) => setServiceDescription(e.target.value)}
          />

          <input
            type="text"
            className="border border-2 rounded-md pl-3 p-1 w-full mb-2"
            placeholder="0"
            value={laborEstimated}
            onChange={(e) => {
              const value = e.target.value;

              const numericValue = value === "" ? 0 : Number(value);
              setLaborEstimated(numericValue);
            }}
          />

          <div className="flex gap-2">
            <button
              className="mt-3 cursor-pointer text-white bg-red-500 hover:bg-red-600 font-semibold px-2 py-1 rounded-md"
              onClick={handleAddService}
            >
              Guardar
            </button>
            <button
              className="mt-3 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-1 rounded-md"
              onClick={() => setShowAddService(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {order.status === OrderStatus.WAITING_FOR_APPROVAL && (
        <section className="border rounded p-3">
          <h2 className="font-semibold">Reautorización</h2>
          <button
            className="mt-3 border border-2 border-gray-800 px-2 py-1 rounded-md cursor-pointer"
            onClick={() =>
              reauthorize(order.id, order.realTotal ?? order.subtotalEstimated, "Reautorización por sobrecosto")
            }
          >
            Registrar nueva autorización
          </button>
        </section>
      )}

      <section className="flex flex-wrap gap-2 mt-4">
        {canDiagnose && (
          <button
            className="mt-3 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-1 rounded-md"
            onClick={() => diagnose(order.id)}
          >
            Diagnosticar
          </button>
        )}

        {canAuthorize && (
          <button
            className="mt-3 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-1 rounded-md"
            onClick={() => authorize(order.id)}
          >
            Autorizar
          </button>
        )}

        {canStart && (
          <button
            className="mt-3 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-1 rounded-md"
            onClick={() => start(order.id)}
          >
            Iniciar reparación
          </button>
        )}

        {canComplete && (
          <button
            className="mt-3 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-1 rounded-md"
            onClick={() => complete(order.id)}
          >
            Completar
          </button>
        )}

        {canDeliver && (
          <button
            className="mt-3 cursor-pointer text-white bg-blue-500 hover:bg-blue-600 font-semibold px-2 py-1 rounded-md"
            onClick={() => deliver(order.id)}
          >
            Entregar
          </button>
        )}

        {canCancel && (
          <button
            className="mt-3 cursor-pointer text-white bg-red-500 hover:bg-red-600 font-semibold px-2 py-1 rounded-md"
            onClick={() => cancel(order.id)}
          >
            Cancelar Orden
          </button>
        )}
      </section>

      <section className="border border-gray-100 shadow-md rounded p-3">
        <h2 className="font-semibold">Historial</h2>

        <ul className="text-sm">
          {order.events.map((e) => (
            <li key={e.id}>
              {new Date(e.timestamp).toLocaleString()} — {describeEvent(e.type)}
            </li>
          ))}
        </ul>
      </section>

      {order.errors?.length > 0 && (
        <section className="border shadow-md rounded p-3 border-red-300">
          <h2 className="font-semibold text-red-600">Errores de negocio</h2>
          <ul className="text-sm text-red-600">
            {order.errors?.map((e, i) => (
              <li key={e.id}>
                <strong>{e.code}</strong>: {e.message}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default OrdenDetalleTallerPage;
