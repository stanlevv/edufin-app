import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle, Eye, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

type Loan = {
  id: string;
  student_id: string;
  requested_amount: number;
  purpose: string;
  tenor_months: number;
  status: string;
  rejection_reason?: string;
  created_at: string;
  student?: {
    nisn: string;
    user_id: string;
    users?: {
      name: string;
      email: string;
    };
  };
};

import { SchoolDesktopLayout } from "./SchoolDesktopLayout";

export function SchoolLoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("semua");
  const [search, setSearch] = useState("");

  const fetchLoans = async () => {
    setLoading(true);
    // Fetch micro_loans, join with students and users
    const { data, error } = await supabase
      .from("micro_loans")
      .select(`
        *,
        student:students(
          nisn,
          user_id,
          users:user_id(name, email)
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching loans:", error);
    } else {
      setLoans(data as any || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleApprove = async (id: string) => {
    if (!window.confirm("Setujui pinjaman ini?")) return;
    const { error } = await supabase
      .from("micro_loans")
      .update({ status: "approved", approved_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      alert("Gagal menyetujui pinjaman: " + error.message);
    } else {
      alert("Pinjaman disetujui!");
      fetchLoans();
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Alasan penolakan:");
    if (reason === null) return;
    const { error } = await supabase
      .from("micro_loans")
      .update({ status: "rejected", rejection_reason: reason })
      .eq("id", id);
      
    if (error) {
      alert("Gagal menolak pinjaman: " + error.message);
    } else {
      alert("Pinjaman ditolak!");
      fetchLoans();
    }
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Disetujui</span>;
      case "pending":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Menunggu</span>;
      case "rejected":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Ditolak</span>;
      case "completed":
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Lunas</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  const filteredLoans = loans.filter((loan) => {
    const matchStatus = filter === "semua" || loan.status === filter;
    
    // Supabase join type hacks
    const sName = Array.isArray(loan.student?.users) 
      ? loan.student?.users[0]?.name 
      : (loan.student?.users as any)?.name;
      
    const matchSearch = sName?.toLowerCase().includes(search.toLowerCase()) 
      || loan.student?.nisn?.includes(search)
      || loan.purpose.toLowerCase().includes(search.toLowerCase());
      
    return matchStatus && matchSearch;
  });

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Pinjaman Mikro</h1>
          <p className="text-gray-500">Kelola persetujuan pinjaman dari siswa.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4 bg-gray-50/50">
          <div className="flex gap-2">
            {[
              { id: "semua", label: "Semua" },
              { id: "pending", label: "Menunggu" },
              { id: "approved", label: "Disetujui" },
              { id: "rejected", label: "Ditolak" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari siswa atau tujuan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-semibold w-64">Nama Siswa / NISN</th>
                <th className="px-6 py-4 font-semibold w-48">Tujuan</th>
                <th className="px-6 py-4 font-semibold w-32">Nominal</th>
                <th className="px-6 py-4 font-semibold w-24">Tenor</th>
                <th className="px-6 py-4 font-semibold w-32">Status</th>
                <th className="px-6 py-4 font-semibold text-right w-40">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredLoans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <AlertCircle size={24} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">Belum ada data pinjaman</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLoans.map((loan) => {
                  const uName = Array.isArray(loan.student?.users) 
                    ? loan.student?.users[0]?.name 
                    : (loan.student?.users as any)?.name;
                    
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{uName || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{loan.student?.nisn || "-"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-700">{loan.purpose}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(loan.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-600 text-sm">
                        {formatRupiah(loan.requested_amount)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-600">
                        {loan.tenor_months} bln
                      </td>
                      <td className="px-6 py-4">{statusBadge(loan.status)}</td>
                      <td className="px-6 py-4">
                        {loan.status === "pending" ? (
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleApprove(loan.id)}
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                              title="Setujui"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button
                              onClick={() => handleReject(loan.id)}
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                              title="Tolak"
                            >
                              <XCircle size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end">
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                              Detail
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </SchoolDesktopLayout>
  );
}
