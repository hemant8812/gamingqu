"use client";

import { useState } from "react";
import { ArrowDownRight, Clock, ArrowUpCircle, Wallet } from "lucide-react";
import { WithdrawalCard } from "./WithdrawalCard";
import { formatDateTimeEnglish } from "@/lib/datetime";

type PayoutAccountType = "BANK" | "EWALLET" | "CRYPTO";

type WithdrawalRow = {
  id: number;
  amount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "REJECTED" | "PAID";
  createdAt: string | Date;
  account?: { providerName: string; type: PayoutAccountType };
};

type CreditRow = {
  id: number;
  amount: number;
  createdAt: string | Date;
  description?: string | null;
  orderCode?: string | null;
};

type Props = {
  availableBalance: string;
  withdrawals: WithdrawalRow[];
  credits: CreditRow[];
  walletCurrency: string;
};

export function EarningsTabs({ availableBalance, withdrawals, credits, walletCurrency }: Props) {
  const [tab, setTab] = useState<"withdraw" | "withdrawals" | "incoming">("withdraw");
  const isWithdraw = tab === "withdraw";
  const isWithdrawals = tab === "withdrawals";
  const isIncoming = tab === "incoming";
  return (
    <div className="bg-[#0F172A] border border-white/10 rounded-2xl overflow-hidden ring-1 ring-white/5 w-full">
      <div className="px-4 md:px-6">
        <div className="flex items-center justify-center gap-6 py-4 border-b border-white/10">
          <button
            type="button"
            onClick={() => setTab("withdraw")}
            className={["px-4 py-2 text-sm font-semibold cursor-pointer border-b-2", isWithdraw ? "text-white border-blue-500" : "text-gray-400 border-transparent hover:text-white"].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowDownRight className="h-4 w-4" />
              <span>Withdraw</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("withdrawals")}
            className={["px-4 py-2 text-sm font-semibold cursor-pointer border-b-2", isWithdrawals ? "text-white border-blue-500" : "text-gray-400 border-transparent hover:text-white"].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Withdrawal History</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setTab("incoming")}
            className={["px-4 py-2 text-sm font-semibold cursor-pointer border-b-2", isIncoming ? "text-white border-blue-500" : "text-gray-400 border-transparent hover:text-white"].join(" ")}
          >
            <span className="inline-flex items-center gap-2">
              <ArrowUpCircle className="h-4 w-4" />
              <span>Incoming Funds</span>
            </span>
          </button>
        </div>
      </div>
      <div className="p-4 md:p-6">
        {isWithdraw ? (
          <WithdrawalCard availableBalance={availableBalance} />
        ) : isWithdrawals ? (
          withdrawals.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center">
                <div className="mb-3 text-gray-400 flex items-center justify-center">
                  <Wallet className="h-7 w-7" />
                </div>
                <div className="text-base font-semibold text-gray-300">No withdrawals yet</div>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 px-2 pb-2 text-xs text-gray-400">
                  <div>Date</div>
                  <div>Account</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                <div className="divide-y divide-white/10">
                  {withdrawals.map((w) => {
                    const statusClass =
                      w.status === "PAID"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : w.status === "REJECTED"
                        ? "bg-red-500/20 text-red-300"
                        : w.status === "PROCESSING"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-purple-500/20 text-purple-300";
                    return (
                      <div key={w.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr] gap-3 px-2 py-3 items-center">
                        <div className="text-sm text-white">{formatDateTimeEnglish(new Date(w.createdAt))}</div>
                        <div className="text-sm text-white">{`${w.account?.providerName ?? ""} • ${w.account?.type ?? ""}`}</div>
                        <div className="text-sm font-semibold text-emerald-400">
                          {new Intl.NumberFormat("en-US", { style: "currency", currency: w.currency, maximumFractionDigits: 2 }).format(Number.parseFloat(w.amount.toString()))}
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-xl ring-1 ring-white/10 ${statusClass}`}>
                            {w.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )
        ) : credits.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <div className="mb-3 text-gray-400 flex items-center justify-center">
                <Wallet className="h-7 w-7" />
              </div>
              <div className="text-base font-semibold text-gray-300">No incoming funds yet</div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-[1.5fr_1fr_1fr] gap-3 px-2 pb-2 text-xs text-gray-400">
                <div>Date</div>
                <div>Amount</div>
                <div>Details</div>
              </div>
              <div className="divide-y divide-white/10">
                {credits.map((t) => {
                  return (
                    <div key={t.id} className="grid grid-cols-[1.5fr_1fr_1fr] gap-3 px-2 py-3 items-center">
                      <div className="text-sm text-white">{formatDateTimeEnglish(new Date(t.createdAt))}</div>
                      <div className="text-sm font-semibold text-emerald-400">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: walletCurrency, maximumFractionDigits: 2 }).format(Number.parseFloat(t.amount.toString()))}
                      </div>
                      <div className="text-sm text-white">{t.orderCode ? `Order ${t.orderCode}` : t.description ?? "Credit"}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
