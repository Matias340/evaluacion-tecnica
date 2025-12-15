import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { mockCustomers } from "./mocks/customers";
import { mockVehicles } from "./mocks/vehicles";
import CustomerLayout from "./pages/cliente/CustomerLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import WorkShopLayout from "./pages/taller/WorkShopLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { getCustomers, saveCustomers } from "./storage/customers";
import { getVehicles, saveVehicles } from "./storage/vehicles";

if (getCustomers().length === 0) saveCustomers(mockCustomers);
if (getVehicles().length === 0) saveVehicles(mockVehicles);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/taller/*"
            element={
              <ProtectedRoute allowedRoles={["TALLER"]}>
                <WorkShopLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cliente/*"
            element={
              <ProtectedRoute allowedRoles={["CLIENTE"]}>
                <CustomerLayout />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
