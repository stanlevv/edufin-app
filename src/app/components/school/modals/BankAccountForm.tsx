import React, { useState } from "react";
import { X, Plus, Trash2, CheckCircle } from "lucide-react";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  isPrimary: boolean;
}

interface BankAccountFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_ACCOUNTS: BankAccount[] = [
  { id: "1", bankName: "Bank BCA", accountNumber: "1234567890", accountHolder: "SDN 3 Malang", isPrimary: true },
  { id: "2", bankName: "Bank Mandiri", accountNumber: "9876543210", accountHolder: "SDN 3 Malang", isPrimary: false },
];

export function BankAccountForm({ isOpen, onClose }: BankAccountFormProps) {
  const [accounts, setAccounts] = useState<BankAccount[]>(INITIAL_ACCOUNTS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAccount, setNewAccount] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "SDN 3 Malang",
  });

  const handleAdd = () => {
    if (!newAccount.bankName || !newAccount.accountNumber || !newAccount.accountHolder) {
      alert("Mohon lengkapi semua data");
      return;
    }
    const added: BankAccount = {
      id: Date.now().toString(),
      ...newAccount,
      isPrimary: accounts.length === 0,
    };
    setAccounts([...accounts, added]);
    setNewAccount({ bankName: "", accountNumber: "", accountHolder: "SDN 3 Malang" });
    setShowAddForm(false);
  };

  const handleSetPrimary = (id: string) => {
    setAccounts(accounts.map((acc) => ({ ...acc, isPrimary: acc.id === id })));
  };

  const handleDelete = (id: string) => {
    const account = accounts.find((a) => a.id === id);
    if (account?.isPrimary) {
      alert("Tidak bisa menghapus rekening utama. Jadikan rekening lain sebagai utama terlebih dahulu.");
      return;
    }
    if (confirm("Hapus rekening ini?")) {
      setAccounts(accounts.filter((a) => a.id !== id));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="w-full max-w-[430px] bg-white rounded-t-3xl p-6 pb-8 animate-slide-up max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#242424" }}>Rekening Sekolah</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "#F5F7FA" }}>
            <X size={18} color="#8C8C8C" />
          </button>
        </div>

        <p style={{ color: "#8C8C8C", fontSize: "0.8rem", marginBottom: "16px" }}>
          Rekening untuk menerima pembayaran SPP dan dana donasi kampanye.
        </p>

        {/* Add Button */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-4 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{ background: "#EEF4FF", color: "#1677FF", fontWeight: 700 }}
          >
            <Plus size={18} /> Tambah Rekening
          </button>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mb-4 p-4 rounded-xl" style={{ background: "#F5F7FA" }}>
            <div className="space-y-3">
              <div>
                <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Nama Bank
                </label>
                <select
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                >
                  <option value="">Pilih Bank</option>
                  <option value="Bank BCA">Bank BCA</option>
                  <option value="Bank Mandiri">Bank Mandiri</option>
                  <option value="Bank BRI">Bank BRI</option>
                  <option value="Bank BNI">Bank BNI</option>
                  <option value="Bank BSI">Bank BSI</option>
                  <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>
                </select>
              </div>
              <div>
                <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Nomor Rekening
                </label>
                <input
                  type="text"
                  placeholder="1234567890"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value.replace(/\D/g, "") })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                />
              </div>
              <div>
                <label style={{ color: "#595959", fontSize: "0.75rem", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                  Atas Nama
                </label>
                <input
                  type="text"
                  value={newAccount.accountHolder}
                  onChange={(e) => setNewAccount({ ...newAccount, accountHolder: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: "#E8E8E8", fontSize: "0.85rem" }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-2 rounded-lg"
                  style={{ background: "white", color: "#8C8C8C", fontWeight: 600 }}
                >
                  Batal
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2 rounded-lg text-white"
                  style={{ background: "#1677FF", fontWeight: 600 }}
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {accounts.map((acc) => (
            <div key={acc.id} className="p-4 rounded-xl border" style={{ borderColor: acc.isPrimary ? "#52C41A" : "#E8E8E8", background: acc.isPrimary ? "#F6FFED" : "white" }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#242424" }}>{acc.bankName}</p>
                    {acc.isPrimary && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "#52C41A", color: "white" }}>
                        <CheckCircle size={11} /> Utama
                      </span>
                    )}
                  </div>
                  <p style={{ color: "#242424", fontSize: "0.82rem", fontWeight: 600 }}>{acc.accountNumber}</p>
                  <p style={{ color: "#8C8C8C", fontSize: "0.75rem" }}>a.n. {acc.accountHolder}</p>
                </div>
                {!acc.isPrimary && (
                  <button onClick={() => handleDelete(acc.id)} className="ml-2 p-2 rounded-lg" style={{ background: "#FFF2F0" }}>
                    <Trash2 size={14} color="#F95654" />
                  </button>
                )}
              </div>
              {!acc.isPrimary && (
                <button
                  onClick={() => handleSetPrimary(acc.id)}
                  className="w-full py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#F5F7FA", color: "#52C41A" }}
                >
                  Jadikan Rekening Utama
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
