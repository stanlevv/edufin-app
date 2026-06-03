import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Heart, Share2, CheckCircle, Users, Sparkles, Lightbulb, School, MapPin, Clock, Smartphone, Building2, CreditCard, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Database } from "../../data/database";
import { FeedUpdateForm } from "../shared/FeedUpdateForm";

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const DONATION_PRESETS = [10000, 25000, 50000, 100000, 250000, 500000];

export function CampaignDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  // Ambil kampanye dari Database bukan dari hardcoded Record
  const campaign = Database.getCampaignById(id ?? "");

  const [donationAmount, setDonationAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [step, setStep] = useState<"detail" | "donate" | "success">("detail");
  const [liked, setLiked] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  // Cek apakah user adalah pembuat kampanye ini
  const studentData = user?.role === "student" ? Database.getStudentByUserId(user.id) : null;
  const isOwner = (user?.role === "school") || (user?.role === "student" && studentData?.id === campaign?.studentId);

  if (!campaign) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <p>Kampanye tidak ditemukan</p>
        <button onClick={() => navigate(-1)} style={{ color: "#1677FF", marginTop: "12px" }}>
          Kembali
        </button>
      </div>
    );
  }

  const pct = Math.round((campaign.collected / campaign.target) * 100);

  if (step === "success") {
    return (
      <div className="flex flex-col min-h-screen bg-white items-center justify-center px-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "#F6FFED" }}>
          <CheckCircle size={52} color="#52C41A" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#242424", textAlign: "center" }}>
            Donasi Berhasil!
          </h2>
          <Sparkles size={24} color="#1677FF" />
        </div>
        <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "8px" }}>
          Kamu telah berdonasi sebesar
        </p>
        <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1677FF", marginBottom: "8px" }}>
          {formatRupiah(parseInt(donationAmount))}
        </p>
        <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "4px", fontSize: "0.9rem" }}>
          untuk kampanye "{campaign.title}"
        </p>
        <p style={{ color: "#8C8C8C", textAlign: "center", marginBottom: "24px", fontSize: "0.85rem" }}>
          via {paymentMethod === "qris" ? "QRIS" : paymentMethod === "va" ? "Virtual Account" : "Bank Transfer"}
        </p>
        <div className="w-full rounded-2xl p-4 mb-6 text-center" style={{ background: "#EEF4FF" }}>
          <div className="flex items-center justify-center gap-2">
            <Heart size={16} color="#1677FF" fill="#1677FF" />
            <p style={{ color: "#1677FF", fontSize: "0.9rem" }}>
              Terima kasih! Donasi kamu sangat berarti bagi pendidikan Indonesia.
            </p>
          </div>
        </div>
        <button onClick={() => navigate("/donor")} className="w-full py-4 rounded-2xl text-white"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700 }}>
          Kembali ke Beranda
        </button>
        <button onClick={() => { setStep("detail"); setDonationAmount(""); setPaymentMethod(""); }} className="w-full py-3 mt-2 rounded-2xl"
          style={{ background: "#F5F7FA", color: "#595959", fontWeight: 600 }}>
          Donasi Lagi
        </button>
      </div>
    );
  }

  if (step === "donate") {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <div className="px-6 pt-12 pb-4">
          <button onClick={() => { setStep("detail"); setPaymentMethod(""); }} className="w-10 h-10 rounded-full flex items-center justify-center mb-4"
            style={{ background: "#F5F7FA" }}>
            <ArrowLeft size={20} color="#242424" />
          </button>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#242424" }}>Masukkan Nominal</h1>
          <p style={{ color: "#8C8C8C", fontSize: "0.85rem" }}>{campaign.title}</p>
        </div>
        <div className="flex-1 px-6 space-y-5">
          <div>
            <div className="bg-white rounded-2xl px-4 py-4 shadow-sm" style={{ border: "2px solid #1677FF" }}>
              <div className="flex items-center gap-2">
                <span style={{ color: "#8C8C8C", fontWeight: 600, fontSize: "1.1rem" }}>Rp</span>
                <input
                  type="number"
                  placeholder="0"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="flex-1 bg-transparent outline-none"
                  style={{ fontSize: "1.5rem", color: "#242424", fontWeight: 800 }}
                  autoFocus
                />
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#595959", marginBottom: "10px" }}>
              Pilih nominal cepat:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {DONATION_PRESETS.map((v) => (
                <button
                  key={v}
                  onClick={() => setDonationAmount(String(v))}
                  className="py-2.5 rounded-xl font-semibold transition-all"
                  style={{
                    background: donationAmount === String(v) ? "#1677FF" : "#F5F7FA",
                    color: donationAmount === String(v) ? "white" : "#595959",
                    fontSize: "0.82rem",
                  }}
                >
                  {formatRupiah(v)}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "#595959", marginBottom: "10px" }}>
              Pilih metode pembayaran:
            </p>
            <div className="space-y-2">
              {[
                { id: "qris", label: "QRIS", Icon: Smartphone, desc: "Scan & bayar pakai e-wallet" },
                { id: "va", label: "Virtual Account", Icon: Building2, desc: "Transfer via bank" },
                { id: "bank", label: "Bank Transfer", Icon: CreditCard, desc: "Transfer manual ke rekening" },
              ].map((method) => {
                const MethodIcon = method.Icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl transition-all"
                    style={{
                      background: paymentMethod === method.id ? "#EEF4FF" : "#F5F7FA",
                      border: paymentMethod === method.id ? "2px solid #1677FF" : "2px solid transparent",
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: paymentMethod === method.id ? "#1677FF" : "white",
                      }}>
                      {paymentMethod === method.id ? (
                        <Check size={20} color="white" />
                      ) : (
                        <MethodIcon size={20} color="#595959" />
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p style={{
                        fontWeight: 600,
                        fontSize: "0.88rem",
                        color: paymentMethod === method.id ? "#1677FF" : "#242424"
                      }}>
                        {method.label}
                      </p>
                      <p style={{ color: "#8C8C8C", fontSize: "0.72rem" }}>{method.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl p-4 flex items-start gap-2" style={{ background: "#EEF4FF" }}>
            <Lightbulb size={16} color="#1677FF" className="flex-shrink-0 mt-0.5" />
            <p style={{ color: "#1677FF", fontSize: "0.82rem", lineHeight: "1.5" }}>
              Donasi kamu akan langsung disalurkan ke rekening sekolah yang sudah terverifikasi.
            </p>
          </div>
        </div>

        <div className="px-6 pt-4 pb-20" style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => {
              if (!donationAmount || parseInt(donationAmount) < 10000 || !paymentMethod) return;
              // Simpan donasi ke database
              const amount = parseInt(donationAmount);
              Database.saveDonation({
                id: `donation-${Date.now()}`,
                campaignId: campaign.id,
                donorId: user?.id ?? "guest",
                donorName: user?.name ?? "Donatur",
                amount,
                isAnonymous: false,
                method: paymentMethod,
                donatedAt: new Date().toISOString(),
                status: "success",
              });
              // Update jumlah collected & donors di kampanye
              const updated = { ...campaign, collected: campaign.collected + amount, donors: campaign.donors + 1 };
              Database.saveCampaign(updated);
              setStep("success");
            }}
            disabled={!donationAmount || parseInt(donationAmount) < 10000 || !paymentMethod}
            className="w-full py-4 rounded-2xl text-white disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
          >
            {donationAmount && parseInt(donationAmount) >= 10000 && paymentMethod
              ? `Donasi ${formatRupiah(parseInt(donationAmount))}`
              : "Pilih Nominal & Metode Pembayaran"}
          </button>
          <p style={{ textAlign: "center", color: "#8C8C8C", fontSize: "0.72rem", marginTop: "8px" }}>
            Minimal donasi Rp10.000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-64">
        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))" }} />

        {/* Back & Actions */}
        <div className="absolute top-12 left-6 right-6 flex justify-between">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.9)" }}>
            <ArrowLeft size={20} color="#242424" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setLiked(!liked)} className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)" }}>
              <Heart size={18} color={liked ? "#F95654" : "#595959"} fill={liked ? "#F95654" : "none"} />
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link kampanye berhasil disalin!");
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.9)" }}>
              <Share2 size={18} color="#595959" />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute bottom-4 left-4 flex gap-2">
          <div className="px-2.5 py-1 rounded-full" style={{ background: "rgba(22,119,255,0.9)" }}>
            <span style={{ fontSize: "0.72rem", color: "white", fontWeight: 600 }}>{campaign.category}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-44">
        <div className="px-6 py-5">
          <h1 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#242424", lineHeight: "1.4", marginBottom: "4px" }}>
            {campaign.title}
          </h1>
          <div className="flex items-center gap-2 mb-4" style={{ color: "#8C8C8C", fontSize: "0.82rem" }}>
            <div className="flex items-center gap-1">
              <School size={14} />
              <span>{campaign.school}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{campaign.location}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-2xl p-4 mb-5" style={{ background: "#F5F7FA" }}>
            <div className="flex justify-between mb-2">
              <div>
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1677FF" }}>{formatRupiah(campaign.collected)}</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>terkumpul dari {formatRupiah(campaign.target)}</p>
              </div>
              <div className="text-right">
                <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#242424" }}>{pct}%</p>
                <p style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>tercapai</p>
              </div>
            </div>
            <div className="w-full h-3 rounded-full mb-3" style={{ background: "#E8E8E8" }}>
              <div className="h-full rounded-full"
                style={{ width: `${Math.min(pct, 100)}%`, background: "linear-gradient(90deg, #1677FF, #108EE9)" }} />
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-1.5">
                <Users size={14} color="#8C8C8C" />
                <span style={{ color: "#8C8C8C", fontSize: "0.78rem" }}>{campaign.donors} donatur</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: campaign.daysLeft <= 10 ? "#F95654" : "#8C8C8C", fontSize: "0.78rem", fontWeight: campaign.daysLeft <= 10 ? 600 : 400 }}>
                <Clock size={14} />
                <span>{campaign.daysLeft} hari lagi</span>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="mb-5">
            <p style={{ fontWeight: 700, color: "#242424", marginBottom: "10px" }}>Cerita Kampanye</p>
            {campaign.story.split("\n\n").map((para: string, i: number) => (
              <p key={i} style={{ color: "#595959", fontSize: "0.88rem", lineHeight: "1.7", marginBottom: "12px" }}>
                {para}
              </p>
            ))}
          </div>

          {/* Updates */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-4">
              <p style={{ fontWeight: 700, color: "#242424" }}>Update Transparansi</p>
              {isOwner && (
                <button
                  onClick={() => setShowUpdateForm(true)}
                  className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-xs font-bold transition-colors"
                >
                  + Tambah Update
                </button>
              )}
            </div>

            {campaign.updates.length > 0 ? (
              <div className="space-y-4">
                {campaign.updates.map((u: any, i: number) => (
                  <div key={i} className="flex gap-3 p-4 rounded-2xl border border-slate-100 shadow-sm bg-white">
                    <div className="w-1.5 flex-shrink-0 rounded-full" style={{ background: "#1677FF" }} />
                    <div className="flex-1">
                      <p style={{ color: "#8C8C8C", fontSize: "0.75rem", marginBottom: "4px" }}>{u.date}</p>
                      <p style={{ color: "#242424", fontSize: "0.85rem", lineHeight: "1.5" }}>{u.text}</p>
                      {u.image && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-slate-100">
                          <img src={u.image} alt="Bukti Transparansi" className="w-full h-auto max-h-48 object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-50 text-center text-slate-500 text-sm">
                Belum ada update transparansi
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpdateForm && (
        <FeedUpdateForm
          campaignId={campaign.id}
          onClose={() => setShowUpdateForm(false)}
          onSuccess={(newUpdate) => {
            const updated = { ...campaign, updates: [newUpdate, ...campaign.updates] };
            Database.saveCampaign(updated);

            // Task V2-09: Notify all donors
            const donors = Database.getDonationsByCampaignId(campaign.id);
            const uniqueDonorIds = Array.from(new Set(donors.map(d => d.donorId)));
            uniqueDonorIds.forEach(donorId => {
              // Jika user bukan guest
              if (donorId !== "guest") {
                Database.saveNotification({
                  id: `notif-${Date.now()}-${donorId}`,
                  userId: donorId,
                  title: `Update Kampanye: ${campaign.title}`,
                  message: newUpdate.text.substring(0, 50) + "...",
                  type: "campaign",
                  read: false,
                  createdAt: new Date().toISOString(),
                });
              }
            });

            // Trigger re-render
            window.location.reload(); 
          }}
        />
      )}

      {/* Sticky Bottom — sits above BottomNav (bottom-16 ≈ 64px) */}
      <div
        className="fixed bottom-16 left-1/2 w-full max-w-[430px] px-6 py-3 z-[51]"
        style={{ transform: "translateX(-50%)", background: "white", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)" }}
      >
        <button
          onClick={() => setStep("donate")}
          className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2"
          style={{ background: "linear-gradient(135deg, #1677FF, #108EE9)", fontWeight: 700, fontSize: "1rem" }}
        >
          <Heart size={20} fill="white" />
          Donasi Sekarang
        </button>
      </div>
    </div>
  );
}