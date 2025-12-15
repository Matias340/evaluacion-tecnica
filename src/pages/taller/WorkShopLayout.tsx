import { Link, Navigate, Route, Routes } from "react-router-dom";
import NewOrderWorkShop from "./NewOrderWorkShop";
import OrderWorkShopDetailsPage from "./OrderWorkShopDetailsPage";
import OrderWorkShopPage from "./OrderWorkShopPage";

const WorkShopLayout = () => {
  return (
    <>
      <header className="p-4 shadow-md bg-white sticky top-0 z-10">
        <nav className="flex gap-6">
          <Link to="/login" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
            Volver
          </Link>
          <Link to="/taller/ordenes" className="text-gray-700 font-medium hover:text-blue-600 transition-colors">
            Órdenes
          </Link>
          <Link to="/taller/nueva" className="text-gray-700 font-medium hover:text-green-600 transition-colors">
            Nueva Orden
          </Link>
        </nav>
      </header>

      <main className="p-6 bg-white min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Navigate to="ordenes" replace />} />
          <Route path="ordenes" element={<OrderWorkShopPage />} />
          <Route path="ordenes/:id" element={<OrderWorkShopDetailsPage />} />
          <Route path="nueva" element={<NewOrderWorkShop />} />
        </Routes>
      </main>
    </>
  );
};

export default WorkShopLayout;
