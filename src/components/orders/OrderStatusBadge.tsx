import { OrderStatus } from "../../domain/orderStatus";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: "Creada",
  [OrderStatus.DIAGNOSED]: "Diagnosticada",
  [OrderStatus.AUTHORIZED]: "Autorizada",
  [OrderStatus.IN_PROGRESS]: "En progreso",
  [OrderStatus.WAITING_FOR_APPROVAL]: "Pendiente aprobación",
  [OrderStatus.COMPLETED]: "Completada",
  [OrderStatus.DELIVERED]: "Entregada",
  [OrderStatus.CANCELLED]: "Cancelada",
};

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  return <span className="px-2 py-1 text-xs border rounded">{STATUS_LABELS[status]}</span>;
};

export default OrderStatusBadge;
