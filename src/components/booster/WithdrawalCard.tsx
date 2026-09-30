"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownRight, Circle, CircleCheck, Plus, Wallet } from "lucide-react";

type PayoutAccountType = "BANK" | "EWALLET" | "CRYPTO";

type PayoutAccount = {
  id: number;
  type: PayoutAccountType;
  providerName: string;
  accountName: string;
  accountRef: string;
  createdAt: string;
};

type AccountsResponse = {
  accounts: PayoutAccount[];
  max: number;
};

// 

export function WithdrawalCard({ availableBalance }: { availableBalance: string }) {
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const [accounts, setAccounts] = useState<PayoutAccount[]>([]);
  const [max, setMax] = useState(4);
  const canAddMore = accounts.length < max;

  const [mode, setMode] = useState<"list" | "add">("list");
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);
  const selectedAccount = useMemo(
    () => accounts.find((a) => a.id === selectedAccountId) ?? null,
    [accounts, selectedAccountId]
  );

  const [amount, setAmount] = useState("");

  const [newType, setNewType] = useState<PayoutAccountType>("BANK");
  const [newProviderName, setNewProviderName] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountRef, setNewAccountRef] = useState("");

  const money = useMemo(
    () => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }),
    []
  );
  const digits = useMemo(() => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }), []);
  const parseNumber = (s: string) => {
    const raw = (s ?? "").replaceAll(",", "").replaceAll("$", "").trim();
    const n = Number.parseFloat(raw);
    return Number.isFinite(n) ? n : 0;
  };
  const availableNumber = useMemo(() => parseNumber(availableBalance), [availableBalance]);
  const availableFormatted = useMemo(() => money.format(availableNumber), [availableNumber, money]);
  const amountNumber = useMemo(() => parseNumber(amount), [amount]);
  const amountDisplay = useMemo(
    () => (amountNumber > 0 ? digits.format(amountNumber) : amount.trim() ? "0" : ""),
    [amount, amountNumber, digits]
  );
  const minWithdrawal = 10;
  const serviceFee = 0;
  const bankFee = 0;
  const totalReceived = Math.max(0, amountNumber - serviceFee - bankFee);

  const load = async () => {
    const res = await fetch("/api/booster/payout-accounts", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load accounts.");
    const data = (await res.json()) as AccountsResponse;
    setAccounts(Array.isArray(data.accounts) ? data.accounts : []);
    setMax(typeof data.max === "number" ? data.max : 4);
  };
  // no-op

  useEffect(() => {
    setBusy(true);
    load()
      .then(() => setMessage(null))
      .catch(() => setMessage("Failed to load accounts."))
      .finally(() => {
        setBusy(false);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    if (accounts.length === 0) {
      setMode("add");
      setSelectedAccountId(null);
      return;
    }
    setMode("list");
    setSelectedAccountId((prev) => (prev != null ? prev : accounts[0]!.id));
  }, [accounts, loaded]);

  const addAccount = async () => {
    setMessage(null);
    const providerName = newProviderName.trim();
    const accountName = newAccountName.trim();
    const accountRef = newAccountRef.trim();
    if (!providerName || !accountName || !accountRef) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (!canAddMore) {
      setMessage("Maximum 4 accounts.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/booster/payout-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: newType, providerName, accountName, accountRef }),
      });
      const data = (await res.json().catch(() => ({}))) as { account?: { id?: number }; error?: string };
      if (!res.ok) {
        setMessage(String(data.error ?? "Failed to save account."));
        return;
      }
      const newId = typeof data.account?.id === "number" ? data.account.id : null;
      await load();
      setNewProviderName("");
      setNewAccountName("");
      setNewAccountRef("");
      if (newId != null) setSelectedAccountId(newId);
      setMode("list");
      setMessage("Account saved.");
    } finally {
      setBusy(false);
    }
  };

  const withdraw = async () => {
    setMessage(null);
    if (!selectedAccount) {
      setMessage("Please select an account.");
      return;
    }
    const amt = amount.trim();
    if (!amt) {
      setMessage("Please enter an amount.");
      return;
    }
    if (amountNumber < minWithdrawal) {
      setMessage(`Minimum withdrawal is ${money.format(minWithdrawal)}.`);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/booster/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId: selectedAccount.id, amount: amountNumber }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || data?.ok !== true) {
        setMessage(String(data?.error ?? "Failed to create withdrawal."));
        return;
      }
      setMessage(`Withdrawal request created for ${selectedAccount.providerName}.`);
      setAmount("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const withdrawAll = () => {
    if (!Number.isFinite(availableNumber) || availableNumber <= 0) return;
    setAmount(String(availableNumber));
  };

  return (
    <section className="withdraw-rounded bg-ink-800 border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5">
      <div className="p-6 border-b border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 ring-1 ring-emerald-500/20 flex items-center justify-center text-emerald-300">
            <ArrowDownRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-bold text-white">Withdraw</div>
            <div className="text-sm text-gray-400">Enter the amount you want to withdraw</div>
          </div>
        </div>
        {/* removed inline stats & withdrawals list to keep this card focused */}
        <div className="shrink-0 inline-flex items-center px-3 py-2 rounded-full bg-white/5 ring-1 ring-white/10 text-xs text-gray-300">
          Minimum {money.format(minWithdrawal)}
        </div>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-xs text-gray-500">Available balance</div>
              <div className="text-2xl font-extrabold text-white tabular-nums">{availableFormatted}</div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-brand-500/15 ring-1 ring-brand-500/20 flex items-center justify-center text-brand-300 shrink-0">
              <Wallet className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-gray-500 mb-2">Withdraw</div>
            <div className="flex items-center gap-3 h-12 rounded-2xl border-2 border-white/10 bg-ink-800 px-4 focus-within:border-brand-500">
              <div className="text-sm font-semibold text-gray-300 shrink-0">$</div>
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                className="w-full h-full bg-transparent outline-none text-white placeholder-gray-500 text-base"
                value={amountDisplay}
                onChange={(e) => setAmount(e.target.value)}
                disabled={busy}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-base font-bold text-white">Choose payout account</div>
              <div className="text-sm text-gray-400">Select bank/e-wallet/crypto to receive your funds</div>
            </div>
            <button
              type="button"
              className="btn btn-gaming btn-sm !rounded-md"
              disabled={!canAddMore || busy}
              onClick={() => setMode((m) => (m === "add" ? "list" : "add"))}
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200">
            {message}
          </div>
        )}

        {!loaded ? (
          <div className="rounded-2xl border border-white/10 bg-ink-900 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="h-[84px] rounded-2xl bg-white/5 animate-pulse" />
              <div className="h-[84px] rounded-2xl bg-white/5 animate-pulse" />
            </div>
          </div>
        ) : mode === "add" ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-semibold text-white">Add payout account</div>
              <div className="text-xs text-gray-500">
                {accounts.length}/{max}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2">Type</label>
                <select
                  className="booster-select select w-full h-11 bg-ink-800 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white rounded-xl"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as PayoutAccountType)}
                  disabled={busy}
                >
                  <option value="BANK">Bank</option>
                  <option value="EWALLET">E-Wallet</option>
                  <option value="CRYPTO">Crypto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Bank / wallet name</label>
                <input
                  type="text"
                  placeholder="e.g. BCA / DANA / USDT"
                  className="input w-full h-11 bg-ink-800 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl"
                  value={newProviderName}
                  onChange={(e) => setNewProviderName(e.target.value)}
                  disabled={busy}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Account name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  className="input w-full h-11 bg-ink-800 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl"
                  value={newAccountName}
                  onChange={(e) => setNewAccountName(e.target.value)}
                  disabled={busy}
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Account number / address</label>
                <input
                  type="text"
                  placeholder="Number or address"
                  className="input w-full h-11 bg-ink-800 border-2 border-white/10 focus:border-brand-500 focus:ring-0 text-white placeholder-gray-500 rounded-xl"
                  value={newAccountRef}
                  onChange={(e) => setNewAccountRef(e.target.value)}
                  disabled={busy}
                />
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              {accounts.length > 0 && (
                <button
                  type="button"
                  className="btn btn-ghost border border-white/10 text-gray-200 hover:bg-white/5 !rounded-md"
                  onClick={() => setMode("list")}
                  disabled={busy}
                >
                  Cancel
                </button>
              )}
              <button type="button" className="btn btn-gaming !rounded-md" onClick={addAccount} disabled={busy || !canAddMore}>
                {busy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accounts.map((a) => {
              const selected = a.id === selectedAccountId;
              const provider = a.providerName.trim();
              const title = provider.length <= 12 ? provider.toUpperCase() : provider;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setSelectedAccountId(a.id)}
                  className={[
                    "text-left rounded-2xl border p-4 w-full transition shadow-sm",
                    selected ? "border-brand-500 bg-brand-500/5 ring-2 ring-brand-500/20" : "border-white/10 bg-white/5 hover:border-white/20",
                  ].join(" ")}
                  aria-pressed={selected}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className={`text-base font-bold ${selected ? "text-brand-300" : "text-white"}`}>{title}</div>
                      <div className={`text-sm ${selected ? "text-brand-200/80" : "text-gray-400"}`}>
                        {a.accountName} • {a.accountRef}
                      </div>
                    </div>
                    <div className="shrink-0 self-center">
                      {selected ? (
                        <CircleCheck className="h-7 w-7 text-brand-400" />
                      ) : (
                        <Circle className="h-7 w-7 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        <div className="border-t border-white/10 pt-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between text-gray-300">
              <span className="text-gray-400">Service fee</span>
              <span>{money.format(serviceFee)}</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <span className="text-gray-400">Bank fee</span>
              <span>{money.format(bankFee)}</span>
            </div>
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-300">Total received</span>
              <span className="text-emerald-300">{money.format(totalReceived)}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              className="btn btn-ghost border border-white/10 text-gray-200 hover:bg-white/5 !rounded-md"
              onClick={withdrawAll}
              disabled={busy || availableNumber <= 0}
            >
              Withdraw all
            </button>
            <button type="button" className="btn btn-gaming !rounded-md" disabled={busy || !selectedAccountId} onClick={withdraw}>
              {busy ? "Processing..." : "Submit withdrawal"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
