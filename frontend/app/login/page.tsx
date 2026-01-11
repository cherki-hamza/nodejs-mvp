"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, LogIn, Lock, User } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import Link from "next/link";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ login, password }),
        }
      );

      let data: any = {};
      try {
        data = await res.json();
      } catch { }

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    } catch (e) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <Card className="w-full max-w-md p-8 backdrop-blur-3xl bg-card/80 border-white/20 shadow-2xl">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Enter your credentials to access your account
            </p>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center border border-destructive/20"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9 bg-background/50 border-input/50 focus:border-primary"
                placeholder="Email or Username"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                className="pl-9 bg-background/50 border-input/50 focus:border-primary"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full shadow-lg shadow-primary/25"
            size="lg"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a href="/register" className="font-semibold text-primary hover:underline underline-offset-4">
            Create an account
          </a>
        </div>
      </Card>
    </div>
  );
}
