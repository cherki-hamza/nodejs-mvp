"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  Check,
  X,
  Menu
} from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { clsx } from "clsx";

type User = {
  _id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  lastLoginAt: string | null;
};

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const changeStatus = async (id: string, status: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/status`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }
    );
    loadUsers();
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this user?")) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`,
      { method: "DELETE" }
    );
    loadUsers();
  };

  const updateUser = async () => {
    if (!editUser) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${editUser._id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editUser.fullName,
          username: editUser.username,
          email: editUser.email,
          phone: editUser.phone,
        }),
      }
    );

    if (!res.ok) {
      alert("Email or username already exists");
      return;
    }

    setEditUser(null);
    loadUsers();
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-64 border-r bg-card/50 backdrop-blur-xl p-6 flex flex-col hidden md:flex"
          >
            <div className="flex items-center gap-2 mb-8 px-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                N
              </div>
              <span className="font-bold text-lg">NodeAuth</span>
            </div>

            <nav className="space-y-2 flex-1">
              <SidebarItem icon={<Users size={20} />} label="Users" active />
              <SidebarItem icon={<LayoutDashboard size={20} />} label="Analytics" />
              <SidebarItem icon={<Settings size={20} />} label="Settings" />
            </nav>

            <div className="pt-4 border-t">
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card/50 backdrop-blur-xl flex items-center justify-between px-6 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-accent rounded-md md:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="relative w-64 hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-accent/50 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              A
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground mt-1">Manage your application users and their permissions.</p>
              </div>
              <Button onClick={loadUsers} variant="outline" size="sm">
                Refresh Data
              </Button>
            </div>

            <Card className="overflow-hidden border-0 shadow-xl bg-card/40">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-semibold">User</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Contact</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUsers.map((user) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{user.fullName}</div>
                              <div className="text-xs text-muted-foreground">@{user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={clsx(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                            user.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : "bg-red-500/10 text-red-600 border-red-500/20"
                          )}>
                            <span className={clsx("h-1.5 w-1.5 rounded-full", user.status === "active" ? "bg-emerald-500" : "bg-red-500")} />
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span>{user.email}</span>
                            <span className="text-xs text-muted-foreground">{user.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setEditUser(user)}
                              className="p-2 hover:bg-primary/10 text-primary rounded-md transition-colors"
                              title="Edit User"
                            >
                              <Edit2 size={16} />
                            </button>

                            {user.status === "active" ? (
                              <button
                                onClick={() => changeStatus(user._id, "blocked")}
                                className="p-2 hover:bg-amber-500/10 text-amber-600 rounded-md transition-colors"
                                title="Block User"
                              >
                                <ShieldAlert size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => changeStatus(user._id, "active")}
                                className="p-2 hover:bg-emerald-500/10 text-emerald-600 rounded-md transition-colors"
                                title="Unblock User"
                              >
                                <ShieldCheck size={16} />
                              </button>
                            )}

                            <button
                              onClick={() => deleteUser(user._id)}
                              className="p-2 hover:bg-red-500/10 text-red-600 rounded-md transition-colors"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}

                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-muted-foreground">
                          No users found matching your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {editUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card w-full max-w-md rounded-xl border shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold text-lg">Edit User Details</h3>
                <button
                  onClick={() => setEditUser(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {["fullName", "username", "email", "phone"].map((field) => (
                  <div key={field} className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <Input
                      value={(editUser as any)[field]}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="px-6 py-4 bg-muted/30 flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setEditUser(null)}>
                  Cancel
                </Button>
                <Button onClick={updateUser}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <div className={clsx(
      "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors text-sm font-medium",
      active
        ? "bg-primary/10 text-primary hover:bg-primary/15"
        : "text-muted-foreground hover:bg-accent hover:text-foreground"
    )}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
