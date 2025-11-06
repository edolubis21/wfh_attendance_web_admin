"use client";

import { useEffect, useState } from "react";

type Employee = { id?: number; name: string; email: string; role: string; password?: string };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [showForm, setShowForm] = useState(false);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    fetchEmployees();
  }, []);

  async function fetchEmployees() {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${apiBase}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEmployees(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // 🕶️ Fungsi sensor email
  function maskEmail(email: string): string {
    const [name, domain] = email.split("@");
    if (name.length <= 2) return name[0] + "*@" + domain;
    const visibleStart = name.slice(0, 2);
    const visibleEnd = name.slice(-2);
    return `${visibleStart}${"*".repeat(Math.max(1, name.length - 4))}${visibleEnd}@${domain}`;
  }

  function openCreate() {
    setEditing({ name: "", email: "", role: "employee" });
    setShowForm(true);
  }

  function openEdit(emp: Employee) {
    setEditing(emp);
    setShowForm(true);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const token = localStorage.getItem("token");
    try {
      if (!editing.id) {
        const res = await fetch(`${apiBase}/api/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editing),
        });
        if (!res.ok) throw new Error("Gagal menambahkan karyawan");
      } else {
        const res = await fetch(`${apiBase}/api/users/${editing.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editing),
        });
        if (!res.ok) throw new Error("Gagal memperbarui karyawan");
      }
      setShowForm(false);
      await fetchEmployees();
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan");
    }
  }

  async function del(id?: number) {
    if (!id) return;
    if (!confirm("Yakin ingin menghapus karyawan ini?")) return;
    const token = localStorage.getItem("token");
    await fetch(`${apiBase}/api/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchEmployees();
  }

  return (
    <div className="p-6 text-zinc-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">👥 Kelola Karyawan</h1>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition-all duration-200"
        >
          + Tambah Karyawan
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-zinc-500">Memuat data...</p>
      ) : employees.length === 0 ? (
        <div className="bg-white shadow rounded-xl p-8 text-center text-zinc-500">
          Belum ada data karyawan.
        </div>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden border border-zinc-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-100 text-zinc-700">
              <tr>
                <th className="p-4 font-semibold">Nama</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t hover:bg-zinc-50 transition-colors duration-150"
                >
                  <td className="p-4">{emp.name}</td>
                  <td className="p-4">{maskEmail(emp.email)}</td>
                  <td className="p-4 capitalize">
                    {emp.role === "admin" ? "🛡️ Admin" : "👤 Employee"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      onClick={() => openEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 font-medium"
                      onClick={() => del(emp.id)}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && editing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <form
            onSubmit={submitForm}
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md animate-fade-in"
          >
            <h2 className="text-xl font-semibold mb-4 text-zinc-800">
              {editing.id ? "✏️ Edit Karyawan" : "➕ Tambah Karyawan"}
            </h2>

            <input
              className="w-full p-3 border border-zinc-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nama"
              value={editing.name}
              onChange={(e) =>
                setEditing({ ...editing, name: e.target.value })
              }
              required
            />
            <input
              className="w-full p-3 border border-zinc-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              type="email"
              value={editing.email}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
              required
            />
            <select
              className="w-full p-3 border border-zinc-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editing.role}
              onChange={(e) =>
                setEditing({ ...editing, role: e.target.value })
              }
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>

            {!editing.id && (
              <input
                className="w-full p-3 border border-zinc-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                type="password"
                value={editing.password || ""}
                onChange={(e) =>
                  setEditing({ ...editing, password: e.target.value })
                }
                required
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium shadow"
              >
                {editing.id ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
