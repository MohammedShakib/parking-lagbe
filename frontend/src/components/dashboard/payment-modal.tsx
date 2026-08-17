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

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          paymentMethod: method,
          accountNumber: method === "card" ? cardNumber : accountNumber,
          pointsUsed,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Payment failed");
      }

      setReceipt({
        transactionId: data.transactionId || `TXN-${Date.now()}`,
        pointsEarned: data.pointsEarned || Math.floor(amount / 10),
        amount,
        date: new Date().toLocaleDateString(),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error processing payment";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6">
        {receipt ? (
          // Success State in White Theme
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center mx-auto text-3xl font-black shadow-sm">
              ✓
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your parking booking #BK-{bookingId} has been confirmed & settled.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction Ref:</span>
                <span className="font-mono font-bold text-slate-900">{receipt.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Garage:</span>
                <span className="font-bold text-slate-900">{garageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-[#d97706]">৳{receipt.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Loyalty Points Earned:</span>
                <span className="font-bold text-emerald-600">+{receipt.pointsEarned} PTS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="text-slate-800">{receipt.date}</span>
              </div>
            </div>

            <button
              onClick={onPaymentSuccess}
              className="w-full rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 text-xs font-bold text-white shadow-md shadow-[#f39c12]/20 transition"
            >
              Done & Return to Bookings
            </button>
          </div>
        ) : (
          // Payment Gateway Form in White Theme
          <>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Complete Parking Payment</h3>
                <p className="text-xs text-slate-500">Booking #BK-{bookingId} • {garageName}</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-semibold">
                ⚠️ {error}
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-700 font-bold mb-2 text-xs">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setMethod("bkash")}
                  className={`p-3 rounded-2xl border text-center transition ${
                    method === "bkash"
                      ? "border-[#f39c12] bg-amber-50 text-[#d97706] font-bold shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <div className="text-sm font-bold">bKash</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">MFS Payment</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("nagad")}
                  className={`p-3 rounded-2xl border text-center transition ${
                    method === "nagad"
                      ? "border-[#f39c12] bg-amber-50 text-[#d97706] font-bold shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <div className="text-sm font-bold">Nagad</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">MFS Payment</div>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("card")}
                  className={`p-3 rounded-2xl border text-center transition ${
                    method === "card"
                      ? "border-[#f39c12] bg-amber-50 text-[#d97706] font-bold shadow-sm"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                  }`}
                >
                  <div className="text-sm font-bold">Card</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Visa / Master</div>
                </button>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4 text-xs">
              {method === "card" ? (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-[#f39c12]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-[#f39c12]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-bold mb-1">CVV</label>
                      <input
                        type="password"
                        required
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-[#f39c12]"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">
                      {method.toUpperCase()} Mobile Account Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-[#f39c12]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Account PIN</label>
                    <input
                      type="password"
                      required
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 font-mono outline-none focus:border-[#f39c12]"
                    />
                  </div>
                </>
              )}

              {/* Total Summary Banner */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex justify-between items-baseline">
                <span className="font-bold text-slate-900">Total Amount:</span>
                <span className="text-xl font-black text-[#d97706]">৳{amount.toFixed(2)}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-slate-300 bg-white py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 font-bold text-white shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : `Pay ৳${amount.toFixed(2)}`}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
