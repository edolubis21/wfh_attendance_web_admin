"use client";

import { useEffect, useState } from "react";

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const base = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    fetchRecords();
  }, []);

  async function fetchRecords() {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(`${base}/api/attendance/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecords(data.records || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function downloadCSV() {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${base}/api/attendance/admin/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance_report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Gagal mengunduh CSV");
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Laporan Absensi</h1>
        <button
          onClick={downloadCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition shadow-sm"
        >
          ⬇️ Download CSV
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-5">Nama</th>
                <th className="py-3 px-5">Tanggal</th>
                <th className="py-3 px-5">Tipe</th>
                <th className="py-3 px-5">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr
                  key={r.id}
                  className={`${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="py-3 px-5 text-gray-800 font-medium">
                    {r.user_name}
                  </td>
                  <td className="py-3 px-5 text-gray-700">{r.date}</td>
                  <td
                    className={`py-3 px-5 font-semibold capitalize ${
                      r.type === "checkin"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {r.type}
                  </td>
                  <td className="py-3 px-5 text-gray-600">
                    {new Date(r.time).toLocaleTimeString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {records.length === 0 && (
            <div className="text-center text-gray-500 py-6">
              Belum ada data absensi.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
