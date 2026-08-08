import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Hospital,
    Ticket,
    Clock3,
    BellRing,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

import PublicNavbar from "../components/common/PublicNavbar";
import Button from "../components/common/Button";
import axios from "axios";
import api from "../services/api";
import socket from "../socket/socket";
import AuthModal from "../components/auth/AuthModal";

const LandingPage = () => {
    const navigate = useNavigate();

    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState("login");

    const handleLogin = () => {
        setAuthMode("login");
        setShowAuthModal(true);
    };

    const handleRegister = () => {
        setAuthMode("register");
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const [liveQueues, setLiveQueues] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchLiveQueues = async () => {
        try {
            const res = await api.get("/queues/live");

            setLiveQueues(res.data.queues || []);
        } catch (err) {
            console.error("Failed to fetch live queues:", err);
        }
    };

    useEffect(() => {
        socket.on("queueUpdated", () => {
            console.log("Queue updated");
            fetchLiveQueues();
        });

        return () => {
            socket.off("queueUpdated");
        };
    }, []);

    // Fetch queues when page loads
    useEffect(() => {
        fetchLiveQueues();
    }, []);

    // Rotate the displayed queue every 3 seconds
    useEffect(() => {
        if (liveQueues.length === 0) return;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % liveQueues.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [liveQueues]);

    // Current queue being displayed
    const current =
        liveQueues.length > 0 ? liveQueues[currentIndex] : null;

    const steps = [
        {
            number: "01",
            icon: Ticket,
            title: "Book your token",
            description:
                "Pick a department and reserve a digital token in under a minute — no phone calls, no front-desk line.",
        },
        {
            number: "02",
            icon: Clock3,
            title: "Track your position",
            description:
                "Watch your place in line update live, with a running estimate of your wait time.",
        },
        {
            number: "03",
            icon: BellRing,
            title: "Get notified",
            description:
                "Your queue status updates in real time as the tokens ahead of you are served.",
        },
        {
            number: "04",
            icon: Hospital,
            title: "Walk in on time",
            description:
                "Arrive as your turn approaches — skip the waiting room entirely.",
        },
    ];

    const benefits = [
        {
            title: "No more waiting rooms",
            description:
                "Track your place from home, work, or your car — walk in only when you're close to being served.",
        },
        {
            title: "Live, not estimated once",
            description:
                "Your position updates the moment a token is served, skipped, or recalled — not on a fixed timer.",
        },
        {
            title: "One account, every department",
            description:
                "Book across Cardiology, Dental, Eye Checkup, and more from a single dashboard.",
        },
        {
            title: "Built for real clinic operations",
            description:
                "Admins manage daily limits, recalls, and skipped visits — so your position reflects what's actually happening at the counter.",
        },
    ];

    const audiences = [
        {
            icon: Hospital,
            title: "Hospitals",
            description: "Coordinate queues across departments from one admin dashboard.",
        },
        {
            icon: ShieldCheck,
            title: "Clinics",
            description: "Cut walk-in wait times without adding front-desk staff.",
        },
        {
            icon: BellRing,
            title: "Diagnostic centers",
            description: "Sequence patient visits for tests without a crowded waiting area.",
        },
        {
            icon: Ticket,
            title: "Any queue-based practice",
            description: "If patients wait for a turn, QueueFlow can manage that line.",
        },
    ];

    return (
        <>
            <PublicNavbar
                onLogin={handleLogin}
                onRegister={handleRegister}
            />

            <AuthModal
                isOpen={showAuthModal}
                mode={authMode}
                setMode={setAuthMode}
                onClose={closeAuthModal}
            />

            <div className="min-h-screen bg-background">

                {/* Hero */}
                <section
                    id="home"
                    className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24"
                >

                    <div className="text-center md:text-left">
                        <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                            <ShieldCheck size={16} />
                            Smart Hospital Queue Management
                        </span>

                        <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-secondary sm:text-5xl">
                            Skip the waiting room.
                            <br />
                            Not your turn.
                        </h1>

                        <p className="mx-auto mt-6 max-w-lg text-lg leading-8 text-gray-600 md:mx-0">
                            QueueFlow replaces the hospital waiting line with a live digital
                            token. Book online, track your position in real time, and
                            arrive exactly when it's your turn.
                        </p>

                        <div className="mt-8 flex justify-center md:justify-start">
                            <Button
                                onClick={handleRegister}
                                className="flex items-center gap-2 bg-primary px-8 py-3 font-semibold text-white hover:opacity-90"
                            >
                                Book your first token
                                <ArrowRight size={18} />
                            </Button>
                        </div>
                    </div>

                    {/* Live token display board — signature element */}
                    <div
                        className="mx-auto w-full max-w-sm rounded-3xl bg-secondary p-6 shadow-2xl sm:p-8"
                        role="img"
                        aria-label={`Live display showing ${current?.department || "No Department"
                            }, now serving token ${current?.servingToken || "No Token"
                            }`}
                    >
                        <div className="flex items-center justify-between text-white/60">
                            <span className="text-xs font-semibold uppercase tracking-widest">
                                Now Serving
                            </span>
                            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                        </div>

                        <div key={currentIndex} className="mt-4">
                            <p className="text-sm font-medium text-white/70">
                                {current?.department}
                            </p>

                            <h2 className="mt-2 font-display text-6xl font-bold tabular-nums text-white">
                                {current?.servingToken || "--"}
                            </h2>

                            <p className="mt-3 text-sm text-white/60">
                                Waiting: {current?.waitingCount ?? 0} patients
                            </p>

                        </div>

                        <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-white/50">
                            <span className="text-xs">Updates live via QueueFlow</span>
                            <div className="flex gap-1">
                                {liveQueues.map((_, i) => (
                                    <span
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full transition ${i === currentIndex ? "bg-primary" : "bg-white/20"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                </section>

                {/* How it works */}
                <section
                    id="how-it-works"
                    className="mx-auto max-w-6xl px-6 pb-20"
                >
                    <div className="mx-auto max-w-xl text-center">
                        <h2 className="font-display text-3xl font-bold text-secondary">
                            How QueueFlow works
                        </h2>
                        <p className="mt-3 text-gray-500">
                            Four steps between you and a waiting-room-free visit.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div
                                    key={step.number}
                                    className="rounded-2xl bg-white p-8 shadow transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <span className="text-sm font-bold text-primary/40">
                                        {step.number}
                                    </span>
                                    <Icon className="mb-4 mt-2 h-10 w-10 text-primary" />
                                    <h3 className="text-lg font-semibold text-secondary">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        {step.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </section>

                {/* Why QueueFlow */}
                <section
                    id="features"
                    className="mx-auto max-w-6xl px-6 pb-20"
                >
                    <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-12">

                        <h2 className="text-center font-display text-3xl font-bold text-secondary">
                            Why patients choose QueueFlow
                        </h2>

                        <div className="mt-10 grid gap-6 md:grid-cols-2">
                            {benefits.map((benefit) => (
                                <div
                                    key={benefit.title}
                                    className="flex gap-4 rounded-xl bg-slate-50 p-5"
                                >
                                    <CheckCircle2 className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                                    <div>
                                        <p className="font-semibold text-secondary">
                                            {benefit.title}
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {benefit.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </section>

                {/* Who can use it */}
                <section className="mx-auto max-w-6xl px-6 pb-20">

                    <h2 className="mb-10 text-center font-display text-3xl font-bold text-secondary">
                        Built for any queue-based practice
                    </h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {audiences.map((audience) => {
                            const Icon = audience.icon;
                            return (
                                <div
                                    key={audience.title}
                                    className="rounded-2xl bg-white p-8 text-center shadow transition hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <Icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                                    <h3 className="text-lg font-semibold text-secondary">
                                        {audience.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        {audience.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                </section>

                {/* CTA */}
                <section className="mx-auto max-w-5xl px-6 pb-20">
                    <div className="rounded-3xl bg-primary p-10 text-center text-white shadow-xl sm:p-14">

                        <h2 className="font-display text-3xl font-bold sm:text-4xl">
                            Ready to skip the waiting line?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
                            Create a free account, book your first token, and see your
                            queue position update live.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Button
                                onClick={handleRegister}
                                className="flex items-center gap-2 rounded-lg bg-white px-8 py-3 font-bold !text-[#0F766E] shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
                            >
                                Get started free
                                <ArrowRight size={18} />
                            </Button>

                            <Button
                                onClick={handleLogin}
                                className="rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition hover:bg-white hover:text-[#0F766E]"
                            >
                                Log in
                            </Button>
                        </div>

                        <p className="mt-6 text-sm text-white/80">
                            New here? Choose <strong>Get started free</strong> to create your
                            account in under a minute.
                        </p>

                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-secondary text-white">
                    <div className="mx-auto max-w-6xl px-6 py-12 text-center">

                        <div className="flex items-center justify-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
                                Q
                            </div>
                            <h2 className="font-display text-xl font-bold text-white">
                                QueueFlow
                            </h2>
                        </div>

                        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/60">
                            Smart Hospital Queue Management System — replacing crowded
                            waiting rooms with live digital tokens.
                        </p>

                        <div className="mx-auto mt-8 h-px w-24 bg-white/10" />

                        <p className="mt-6 text-sm text-white/40">
                            © 2026 QueueFlow. All rights reserved.
                        </p>

                    </div>
                </footer>
                {/* Auth Modal */}
                {showAuthModal && (
                    <AuthModal
                        isOpen={showAuthModal}
                        mode={authMode}
                        setMode={setAuthMode}
                        onClose={closeAuthModal}
                    />
                )}

            </div>
        </>
    );

};

export default LandingPage;