import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await loginApi({ email, password });

      // ✅ SET TOKEN + USER U CONTEXT
      login(res.token, res.user);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-6 border rounded">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      {error && (
        <p className="bg-red-100 text-red-700 p-2 mb-4 text-center">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-black text-white p-2 hover:bg-gray-800"
        >
          Login
        </button>
      </form>
    </div>
  );
}
