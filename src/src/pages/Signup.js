import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: connect with backend registration API
    console.log("Signing up:", username, email, password);
    navigate("/feed"); // redirect after signup
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-8 w-96">
      <h2 className="text-2xl font-bold mb-6 text-center">EcoFinds - Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          className="p-2 border rounded-lg"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link to="/" className="text-green-600 font-semibold">
          Login
        </Link>
      </p>
    </div>
  );
}
