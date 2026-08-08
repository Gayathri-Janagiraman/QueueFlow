import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">

                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                        Q
                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-secondary">
                            QueueFlow
                        </h1>

                        <p className="hidden text-xs text-gray-500 sm:block">
                            Smart Queue Management
                        </p>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-4 md:flex">
                    {user?.role === "user" && (
                        <NavLink
                            to="/user/my-token"
                            className={({ isActive }) =>
                                `rounded-lg px-4 py-2 font-medium transition ${isActive
                                    ? "bg-primary text-white"
                                    : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                                }`
                            }
                        >
                            My Token
                        </NavLink>
                    )}

                </div>

                {/* Desktop User */}
                <div className="hidden items-center gap-4 md:flex">

                    <div className="text-right">
                        <p className="font-semibold text-secondary">
                            {user?.name}
                        </p>

                        <p className="text-sm capitalize text-gray-500">
                            {user?.role}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
                    >
                        <LogOut size={18} />
                        <span className="font-medium">
                            Logout
                        </span>
                    </button>

                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

            </div>



            {/* Mobile Menu Panel */}
            {isMenuOpen && (
                <div className="border-t bg-white px-4 py-4 md:hidden">

                    <div className="flex flex-col gap-1">
                        {user?.role === "user" && (
                            <NavLink
                                to="/user/my-token"
                                className={({ isActive }) =>
                                    `rounded-lg px-4 py-2 font-medium transition ${isActive
                                        ? "bg-primary text-white"
                                        : "text-gray-600 hover:bg-primary/10 hover:text-primary"
                                    }`
                                }
                            >
                                My Token
                            </NavLink>
                        )}
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                        <div>
                            <p className="font-semibold text-secondary">
                                {user?.name}
                            </p>
                            <p className="text-sm capitalize text-gray-500">
                                {user?.role}
                            </p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-red-600 transition hover:bg-red-100"
                        >
                            <LogOut size={18} />
                            <span className="font-medium">
                                Logout
                            </span>
                        </button>
                    </div>

                </div>
            )}

        </nav>
    );
};

export default Navbar;