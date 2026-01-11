"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap, Server } from "lucide-react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";

type User = {
  fullName: string;
  email: string;
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center bg-background text-primary">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  // ✅ LOGGED IN VIEW
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-100 via-background to-background dark:from-violet-900/20">
        <Card className="max-w-md w-full text-center space-y-6 py-12 px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="h-20 w-20 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">👋</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">
              Welcome back, <br />
              <span className="text-primary">{user.fullName}</span>
            </h2>
            <p className="text-muted-foreground mt-2">
              You are securely logged in to the platform.
            </p>
          </motion.div>

          <div className="flex flex-col gap-3 pt-4">
            <a href="/dashboard" className="w-full">
              <Button size="lg" className="w-full gap-2">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Button variant="outline" size="lg" onClick={logout} className="w-full">
              Sign Out
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ❌ NOT LOGGED IN VIEW
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Decorative Background Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-blob animation-delay-4000" />
      </div>

      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          NodeAuth
        </div>
        <div className="flex gap-4">
          <a href="/login">
            <Button variant="ghost">Sign In</Button>
          </a>
          <a href="/register">
            <Button>Get Started</Button>
          </a>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-8 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 ring-1 ring-inset ring-primary/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v2.0 Now Available
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]">
              Production Ready <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-600">
                Auth Infrastructure
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A robust, Docker-first authentication MVP built with Next.js 16, Express, and MongoDB. Secure, scalable, and ready to deploy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 shadow-xl shadow-primary/20">
                Start Building <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full gap-2">
                View Source
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<ShieldCheck className="h-6 w-6 text-emerald-500" />}
            title="Secure by Default"
            description="Enterprise-grade security with JWT authentication, password hashing, and protected API routes."
            delay={0.3}
          />
          <FeatureCard
            icon={<Server className="h-6 w-6 text-blue-500" />}
            title="Docker First"
            description="Fully containerized architecture. Spin up the entire stack with a single docker-compose command."
            delay={0.4}
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6 text-amber-500" />}
            title="Blazing Fast"
            description="Built on Next.js 16 App Router and Express for optimal performance and developer experience."
            delay={0.5}
          />
        </div>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} NodeAuth MVP. Built with ❤️ for developers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <Card className="p-8 hover:border-primary/50 transition-colors group">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
      >
        <div className="h-12 w-12 bg-background rounded-xl border flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </motion.div>
    </Card>
  );
}
