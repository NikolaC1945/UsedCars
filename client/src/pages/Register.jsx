import { useState } from "react";
import { register } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

/* =====================
   PASSWORD VALIDATION
===================== */
function validatePassword(password) {
  if (password.length < 7) {
    return "Password must be at least 7 characters long";
  }

  let hasLetter = false;
  let hasNumber = false;

  for (const char of password) {
    if (
      (char >= "a" && char <= "z") ||
      (char >= "A" && char <= "Z")
    ) {
      hasLetter = true;
    }
    if (char >= "0" && char <= "9") {
      hasNumber = true;
    }
  }

  if (!hasLetter || !hasNumber) {
    return "Password must contain at least one letter and one number";
  }

  return null;
}

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const navigate = useNavigate();

  const passwordError = validatePassword(password);
  const hasPasswordError = submitAttempted && passwordError;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitAttempted(true);

    if (passwordError) {
      return;
    }

    try {
      await register({ name, email, password });
      alert("Registration successful. You can now login.");
      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          className="w-full border p-2"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full border p-2 pr-20 ${
                hasPasswordError ? "border-red-500" : ""
              }`}
              placeholder="Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError(null);
              }}
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* HELPER TEXT (always visible) */}
          <p className="text-xs text-gray-500 mt-1">
            Minimum 7 characters, must contain at least one letter and one number
          </p>

          {/* INLINE ERROR */}
          {hasPasswordError && (
            <p className="text-sm text-red-500 mt-1">
              {passwordError}
            </p>
          )}
        </div>

        {/* BACKEND / GENERAL ERROR */}
        {error && !hasPasswordError && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button
          type="submit"
          className={`w-full p-2 text-white transition ${
            hasPasswordError
              ? "bg-red-600"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          Register
        </button>
      </form>
    </div>
  );
}
