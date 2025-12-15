import { Link, Navigate, Route, Routes } from "react-router-dom";
import OrdenDetalleClientePage from "./OrdenDetalleClientePage";
import OrdenesClientePage from "./OrdenesClientePage";
import SolicitarReparacionPage from "./SolicitarReparacionPage";

const ClienteLayout = () => {
  return (
    <>
      <header className="p-4 shadow-md bg-white sticky top-0 z-10">
        <nav className="flex gap-4">
          <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
            Volver
          </Link>
          <Link className="text-gray-700 font-medium hover:text-blue-600 transition-colors" to="/cliente/ordenes">
            Mis órdenes
          </Link>
          <Link className="text-gray-700 font-medium hover:text-green-600 transition-colors" to="/cliente/nueva">
            Solicitar reparación
          </Link>
        </nav>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="ordenes" replace />} />

          <Route path="ordenes" element={<OrdenesClientePage />} />

          <Route path="ordenes/:id" element={<OrdenDetalleClientePage />} />

          <Route path="nueva" element={<SolicitarReparacionPage />} />
        </Routes>
      </main>
    </>
  );
};

export default ClienteLayout;
