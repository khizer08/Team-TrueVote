import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: connect with backend authentication API
    console.log("Logging in with", email, password);
    navigate("/feed"); // redirect to feed on success
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">EcoFinds - Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="p-2 border rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="p-2 border rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-green-600 font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
