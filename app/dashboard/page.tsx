"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    // fetch summary counts (optional)
    async function fetchSummary() {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const totalEmployees = Array.isArray(data.users) ? data.users.length : 0;

        const leavesRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/leave/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const leavesData = await leavesRes.json();
        const totalLeaves = (leavesData.requests || []).length;
        const totalApproved = (leavesData.requests || []).filter((l:any)=>l.status==='approved').length;
        const totalPending = (leavesData.requests || []).filter((l:any)=>l.status==='pending').length;

        setSummary({ totalEmployees, totalLeaves, totalApproved, totalPending });
      } catch (e) {
                console.log("errroror", e)
        setSummary({ totalEmployees: 0, totalLeaves: 0, totalApproved: 0, totalPending: 0 });
      }
    }
    fetchSummary();
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-zinc-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card title="Karyawan" value={summary.totalEmployees} />
        <Card title="Total Izin" value={summary.totalLeaves} />
        <Card title="Disetujui" value={summary.totalApproved} color="green" />
        <Card title="Pending" value={summary.totalPending} color="orange" />
      </div>
    </div>
  );
}

function Card({ title, value, color }: { title: string; value: number; color?: string }) {
  const colorClass = color === "green" ? "text-green-600" : color === "orange" ? "text-orange-500" : "text-blue-600";
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <p className="text-sm text-gray-600">{title}</p>
      <h2 className={`text-3xl font-bold ${colorClass}`}>{value}</h2>
    </div>
  );
}
