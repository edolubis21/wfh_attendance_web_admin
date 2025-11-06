import LogoutButton from "./components/login_button";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Admin Panel - WFH Attendance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 p-6 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-blue-700">WFH Admin</h2>
              <p className="text-sm text-gray-600 mt-1">Attendance Management</p>
            </div>

            <nav className="space-y-2 font-medium">
              <Link className="block text-gray-700 hover:text-blue-600 transition" href="/dashboard">
                📊 Dashboard
              </Link>
              <Link className="block text-gray-700 hover:text-blue-600 transition" href="/employees">
                👥 Kelola Karyawan
              </Link>
              <Link className="block text-gray-700 hover:text-blue-600 transition" href="/leaves">
                🗓 Kelola Izin
              </Link>
              <Link className="block text-gray-700 hover:text-blue-600 transition" href="/attendance">
                🕒 Laporan Absensi
              </Link>
            </nav>

            <div className="mt-10">
              <LogoutButton />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-10 overflow-auto bg-gray-100">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
