import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Logo from "../../components/common/Logo";
import toast from "react-hot-toast";

const Login = ({ setMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save user and token
      login(response.data.user, response.data.token);

      // Admin
      if (response.data.user.role === "admin") {
        navigate("/admin/dashboard");
        return;
      }

      // User
      try {
        await api.get("/tokens/my-token");

        // Active token exists
        navigate("/user/my-token");

      } catch (error) {

        if (error.response?.status === 404) {
          // No active token
          navigate("/user/dashboard");
        } else {
          navigate("/user/dashboard");
        }

      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Logo />

      <h2 className="mt-6 text-center text-2xl font-bold text-secondary">
        Welcome Back
      </h2>

      <form
        onSubmit={handleLogin}
        className="mt-6 space-y-5"
      >
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("register")}
          className="font-semibold text-primary hover:underline"
        >
          Register
        </button>
      </p>
    </div>
  );
}
export default Login;