import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const PublicNavbar = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 shadow-sm backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex cursor-pointer items-center gap-2 sm:gap-3"
        >
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-base font-bold text-white sm:h-10 sm:w-10 sm:text-lg">
            Q
          </div>

          <div>
            <h1 className="whitespace-nowrap text-xs font-bold text-secondary sm:text-xl">
              QueueFlow
            </h1>

            <p className="hidden text-xs text-gray-500 lg:block">
              Smart Queue Management
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">

          <a
            href="#home"
            className="font-medium text-gray-600 transition hover:text-secondary"
          >
            Home
          </a>

          <a
            href="#how-it-works"
            className="font-medium text-gray-600 transition hover:text-secondary"
          >
            How It Works
          </a>

          <a
            href="#features"
            className="font-medium text-gray-600 transition hover:text-secondary"
          >
            Features
          </a>

        </div>

        {/* Buttons + Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">

          <button
            type="button"
            onClick={onLogin}
            className="rounded-lg border-2 border-secondary px-3 py-1.5 text-sm font-medium text-secondary transition hover:bg-secondary hover:text-white sm:px-5 sm:py-2 sm:text-base"
          >
            Login
          </button>

          <button
            type="button"
            onClick={onRegister}
            className="rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 sm:px-5 sm:py-2 sm:text-base"
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMenuOpen && (
        <div className="flex flex-col gap-1 border-t bg-white px-4 py-4 md:hidden">

          <a
            href="#home"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-4 py-3 font-medium text-gray-600 transition hover:bg-secondary/5 hover:text-secondary"
          >
            Home
          </a>

          <a
            href="#how-it-works"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-4 py-3 font-medium text-gray-600 transition hover:bg-secondary/5 hover:text-secondary"
          >
            How It Works
          </a>

          <a
            href="#features"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg px-4 py-3 font-medium text-gray-600 transition hover:bg-secondary/5 hover:text-secondary"
          >
            Features
          </a>

        </div>
      )}

    </nav>
  );
};

export default PublicNavbar;