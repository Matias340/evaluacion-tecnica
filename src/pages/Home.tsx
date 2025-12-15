import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white px-4">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10">APP TALLER</h1>
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Bienvenido</h1>

      <p className="text-gray-600 mb-6 text-center">Ingresa para continuar al sistema</p>

      <button
        onClick={() => navigate("/login")}
        className="w-64 py-3 cursor-pointer bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-colors"
      >
        Inicia Sesión
      </button>
    </div>
  );
};

export default Home;
