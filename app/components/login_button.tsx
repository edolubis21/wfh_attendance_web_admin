"use client";

export default function LogoutButton() {
  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition"
    >
      Logout
    </button>
  );
}
