"use client";

import { useEffect, useState } from "react";

type Leave = {
  id: number;
  user_name: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
};

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const base = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    fetchLeaves();
  }, []);

  async function fetchLeaves() {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${base}/api/leave/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLeaves(data.requests || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${base}/api/leave/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      await fetchLeaves();
    } catch (e: any) {
      alert(e.message || "Error");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">
        Kelola Izin / Cuti
      </h1>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-5">Nama</th>
                <th className="py-3 px-5">Periode</th>
                <th className="py-3 px-5">Alasan</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l, i) => (
                <tr
                  key={l.id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="py-3 px-5 font-medium text-gray-800">
                    {l.user_name}
                  </td>
                  <td className="py-3 px-5 text-gray-700">
                    {l.start_date} → {l.end_date}
                  </td>
                  <td className="py-3 px-5 text-gray-700">{l.reason}</td>
                  <td
                    className={`py-3 px-5 font-medium capitalize ${
                      l.status === "approved"
                        ? "text-green-600"
                        : l.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {l.status}
                  </td>
                  <td className="py-3 px-5 text-center">
                    {l.status === "pending" ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => updateStatus(l.id, "approved")}
                          className="px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(l.id, "rejected")}
                          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">
                        No action
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {leaves.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              Belum ada pengajuan cuti.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
