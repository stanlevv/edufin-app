import React, { useState } from "react";
import { useNavigate } from "react-router";
import { School, MapPin, Phone, Mail, Shield, Edit, Save, X, User, Bell, Users, BarChart3 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { SchoolDesktopLayout } from "./SchoolDesktopLayout";

export function SchoolProfilePage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "SDN 3 Malang",
    npsn: "20533415",
    address: "Jl. Veteran No. 12, Malang, Jawa Timur 65112",
    phone: "(0341) 551234",
    email: "admin@sdn3malang.sch.id",
    principal: "Dra. Siti Rahmawati, M.Pd",
    principalPhone: "081234567890",
    bankName: "Bank Mandiri",
    bankAccount: "1234567890",
    bankAccountName: "SDN 3 Malang",
  });

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  return (
    <SchoolDesktopLayout>
      <div className="p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pengaturan Sekolah</h2>
            <p className="text-sm text-gray-500">Kelola informasi dan profil sekolah</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
            >
              <Edit size={18} />
              <span className="text-sm">Edit Profil</span>
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                <X size={18} />
                <span className="text-sm">Batal</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
              >
                <Save size={18} />
                <span className="text-sm">Simpan</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - School Info */}
          <div className="col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <School size={20} color="#1677FF" />
                Informasi Sekolah
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Sekolah</label>
                    {isEditing ? (
                      <input
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 py-2.5">{formData.schoolName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">NPSN</label>
                    {isEditing ? (
                      <input
                        value={formData.npsn}
                        onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 py-2.5">{formData.npsn}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                    <MapPin size={14} />
                    Alamat Sekolah
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-gray-800 py-2.5">{formData.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Phone size={14} />
                      Telepon
                    </label>
                    {isEditing ? (
                      <input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 py-2.5">{formData.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                      <Mail size={14} />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 py-2.5">{formData.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Principal Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} color="#52C41A" />
                Kepala Sekolah
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Kepala Sekolah</label>
                  {isEditing ? (
                    <input
                      value={formData.principal}
                      onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-800 py-2.5">{formData.principal}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">No. Telepon</label>
                  {isEditing ? (
                    <input
                      value={formData.principalPhone}
                      onChange={(e) => setFormData({ ...formData, principalPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-800 py-2.5">{formData.principalPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Account */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Rekening Bank</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Bank</label>
                    {isEditing ? (
                      <input
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 py-2.5">{formData.bankName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Rekening</label>
                    {isEditing ? (
                      <input
                        value={formData.bankAccount}
                        onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                      />
                    ) : (
                      <p className="text-sm text-gray-800 py-2.5">{formData.bankAccount}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Pemilik Rekening</label>
                  {isEditing ? (
                    <input
                      value={formData.bankAccountName}
                      onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm"
                    />
                  ) : (
                    <p className="text-sm text-gray-800 py-2.5">{formData.bankAccountName}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Admin Info */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                <User size={32} />
              </div>
              <h3 className="font-bold text-lg mb-1">Admin</h3>
              <p className="text-sm opacity-90 mb-1">{user?.name}</p>
              <p className="text-xs opacity-75">{user?.email}</p>
            </div>

            {/* Quick Settings */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Pengaturan Cepat</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/school/notifications")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Bell size={18} />
                  Kelola Notifikasi
                </button>
                <button
                  onClick={() => navigate("/school/students")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Users size={18} />
                  Data Siswa
                </button>
                <button
                  onClick={() => navigate("/school/report")}
                  className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-all text-sm font-semibold text-gray-700 flex items-center gap-2"
                >
                  <BarChart3 size={18} />
                  Laporan Keuangan
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                if (confirm("Yakin ingin keluar?")) {
                  logout();
                  navigate("/login");
                }
              }}
              className="w-full px-5 py-3 rounded-lg bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-all"
            >
              Keluar dari Akun
            </button>
          </div>
        </div>
      </div>
    </SchoolDesktopLayout>
  );
}
