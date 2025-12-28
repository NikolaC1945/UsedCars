import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import EditCar from "./pages/EditCar";
import CreateCar from "./pages/CreateCar";
import CarDetails from "./pages/CarDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars/:id" element={<CarDetails />} />

          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <CreateCar />
              </ProtectedRoute>
            }
          />

          {/* ✅ EDIT ROUTE */}
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditCar />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}
