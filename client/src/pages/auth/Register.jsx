import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Logo from "../../components/common/Logo";
import toast from "react-hot-toast";

const Register = ({ setMode }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", formData);

      toast.success(response.data.message);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <Logo />

      <h2 className="mt-6 text-center text-2xl font-bold text-secondary">
        Create Account
      </h2>

      <form
        onSubmit={handleRegister}
        className="mt-6 space-y-5"
      >
        <Input
          label="Full Name"
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
        />

        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => setMode("login")}
          className="font-semibold text-primary hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}

  export default Register;