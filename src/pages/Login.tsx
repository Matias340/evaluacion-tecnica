import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { mockCustomers } from "../mocks/customers";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (role: "TALLER" | "CLIENTE") => {
    login(role);

    if (role === "CLIENTE") {
      const customer = mockCustomers[0];
      localStorage.setItem("customerId", customer.id);
    }

    navigate(role === "TALLER" ? "/taller" : "/cliente");
  };

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen bg-gradient-to-br">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-6">APP TALLER</h1>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6">Seleccionar rol</h1>

      <button
        onClick={() => handleLogin("TALLER")}
        className="w-64 py-3 bg-blue-600 text-white cursor-pointer font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
      >
        Ingresar como Taller
      </button>

      <button
        onClick={() => handleLogin("CLIENTE")}
        className="w-64 py-3 bg-green-500 text-white cursor-pointer font-semibold rounded-xl shadow-md hover:bg-green-600 transition-colors"
      >
        Ingresar como Cliente
      </button>
    </div>
  );
};

export default Login;
