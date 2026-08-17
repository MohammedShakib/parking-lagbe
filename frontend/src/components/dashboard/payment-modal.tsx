"use client";

import { useState } from "react";

interface PaymentModalProps {
  bookingId: number;
  garageName: string;
  amount: number;
  pointsUsed?: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModal({
  bookingId,
  garageName,
  amount,
  pointsUsed = 0,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [method, setMethod] = useState<"bkash" | "nagad" | "card" | "points">("bkash");
  const [accountNumber, setAccountNumber] = useState("01700000000");
  const [pin, setPin] = useState("12345");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    transactionId: string;
    pointsEarned: number;
    amount: number;
    date: string;
  } | null>(null);

  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const txnId = `${method.toUpperCase()}_TXN_${Date.now().toString(36).toUpperCase()}`;

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          paymentMethod: method,
          transactionId: txnId,
          amount,
          pointsUsed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment failed. Please try again.");
      }

      setReceipt({
        transactionId: txnId,
        pointsEarned: data.points_earned || Math.floor(amount / 10),
        amount,
        date: new Date().toLocaleString(),
      });
      onPaymentSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
        {!receipt ? (
          <>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white"
            >
              ✕
            </button>

            <div className="mb-4">
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                Secure Checkout Gateway
              </span>
              <h2 className="mt-2 text-xl font-bold text-white">Payment for Booking #{bookingId}</h2>
              <p className="text-xs text-neutral-400">{garageName}</p>
            </div>

            {/* Amount Summary */}
            <div className="mb-5 rounded-xl border border-neutral-800 bg-neutral-950 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-neutral-400">Total Payable Amount</div>
                <div className="text-2xl font-black text-emerald-400">৳{amount}</div>
              </div>
              <div className="text-right text-[11px] text-neutral-400">
                <div>Points Discount: ৳{pointsUsed}</div>
                <div className="text-amber-400">Reward: +{Math.floor(amount / 10)} pts</div>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Method Tabs */}
            <div className="mb-4 grid grid-cols-4 gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 p-1">
              <button
                type="button"
                onClick={() => setMethod("bkash")}
                className={`rounded-lg py-2 text-xs font-semibold transition ${
                  method === "bkash"
                    ? "bg-[#D12053] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                bKash
              </button>
              <button
                type="button"
                onClick={() => setMethod("nagad")}
                className={`rounded-lg py-2 text-xs font-semibold transition ${
                  method === "nagad"
                    ? "bg-[#F7931E] text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Nagad
              </button>
              <button
                type="button"
                onClick={() => setMethod("card")}
                className={`rounded-lg py-2 text-xs font-semibold transition ${
                  method === "card"
                    ? "bg-neutral-700 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Card
              </button>
              <button
                type="button"
                onClick={() => setMethod("points")}
                className={`rounded-lg py-2 text-xs font-semibold transition ${
                  method === "points"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Points
              </button>
            </div>

            <form onSubmit={handleProcessPayment} className="space-y-3">
              {(method === "bkash" || method === "nagad") && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">
                      {method === "bkash" ? "bKash" : "Nagad"} Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Account PIN</label>
                    <input
                      type="password"
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="•••••"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {method === "card" && (
                <>
                  <div>
                    <label className="block text-xs font-medium text-neutral-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4111 2222 3333 4444"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-neutral-400 mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {method === "points" && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-neutral-300">
                  <p className="leading-relaxed">
                    Full payment using accumulated loyalty points. 1 Point = 1 BDT.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:opacity-95 disabled:opacity-50 mt-3"
              >
                {loading ? "Confirming Transaction..." : `Pay ৳${amount} via ${method.toUpperCase()}`}
              </button>
            </form>
          </>
        ) : (
          /* Receipt State */
          <div className="text-center py-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-2xl text-emerald-400 border border-emerald-500/30">
              ✓
            </div>
            <h3 className="mt-4 text-lg font-bold text-white">Payment Successful!</h3>
            <p className="text-xs text-neutral-400">Transaction verified & reservation confirmed.</p>

            <div className="mt-5 rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-left text-xs space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>Booking ID:</span>
                <span className="font-semibold text-white">#{bookingId}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Transaction ID:</span>
                <span className="font-mono text-emerald-400">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Amount Paid:</span>
                <span className="font-bold text-white">৳{receipt.amount}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Points Earned:</span>
                <span className="font-semibold text-amber-400">+{receipt.pointsEarned} pts</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Date:</span>
                <span>{receipt.date}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-emerald-400"
            >
              Done & View Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
