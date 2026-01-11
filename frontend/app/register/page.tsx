"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, FileText, Mail, Phone, Lock, User } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import Link from "next/link";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      window.location.href = "/login";
    } catch (e) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10" />

      <Card className="w-full max-w-lg p-8 backdrop-blur-3xl bg-card/80 border-white/20 shadow-2xl">
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
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Join thousands of users on our platform
            </p>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center border border-destructive/20"
          >
            {error}
          </motion.div>
        )}

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Full Name</label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                className="pl-9"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="tel"
                className="pl-9"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                className="pl-9"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </div>
          </div>

          <Button
            className="w-full mt-2 shadow-lg shadow-primary/25"
            size="lg"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Register"}
          </Button>
        </div>

        <div className="mt-8 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <a href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
            Sign In
          </a>
        </div>
      </Card>
    </div>
  );
}
