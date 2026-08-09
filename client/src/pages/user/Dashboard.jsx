import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import QueueCard from "../../components/user/QueueCard";
import toast from "react-hot-toast";
import Navbar from "../../components/common/Navbar";

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueues();
    }, []);

    const fetchQueues = async () => {
        try {
            const response = await api.get("/queues");

            console.log(response.data);

            setQueues(response.data.queues || []);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load queues");
        } finally {
            setLoading(false);
        }
    };


    const handleBook = async (queue) => {
        try {
            const response = await api.post("/tokens/book", {
                queueId: queue._id,
            });

            toast.success("Token booked successfully!");

            navigate("/user/my-token");

        } catch (error) {

            // User already has a token
            if (
                error.response?.status === 400 &&
                error.response?.data?.message === "You already have an active token"
            ) {
                toast("You already have an active token. Redirecting...", {
                    icon: "ℹ️",
                });

                setTimeout(() => {
                    navigate("/user/my-token");
                }, 1500);

                return;
            }

            // Log only unexpected errors
            console.error(error);

            // Other errors
            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Booking failed"
            );
        }
    };


    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background p-8">
                <h1 className="mb-2 text-4xl font-bold text-secondary">
                    Welcome, {user?.name} 👋
                </h1>

                <p className="mb-8 text-gray-600">
                    Choose a service to book your token.
                </p>

                {loading ? (
                    <p>Loading queues...</p>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {queues.map((queue) => (
                            <QueueCard
                                key={queue._id}
                                queue={queue}
                                onBook={handleBook}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Dashboard;