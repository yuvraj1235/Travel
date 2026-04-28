"use client";
import { useState } from "react";
import { emailTripAction } from "@/app/actions/mail";
import { Button } from "@/components/ui/button";

export function MailButtonClient({ tripId }: { tripId: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleMail() {
    setStatus("loading");
    try {
      const res = await emailTripAction(tripId);
      if (res.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(res.message);
      }
    } catch (e) {
      setStatus("error");
      setMessage("Failed to send email");
    }
  }

  if (status === "success") {
    return <span className="text-emerald-700 dark:text-emerald-200 font-semibold px-4 py-2 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 rounded-xl">Email Sent! 📬</span>;
  }

  return (
    <div className="flex items-center gap-2">
      {status === "error" && <span className="text-red-500 dark:text-red-300 text-sm">{message}</span>}
      <Button 
        onClick={handleMail} 
        disabled={status === "loading"}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200/70 dark:shadow-indigo-900/40 transition-all hover:scale-[1.02]"
      >
        {status === "loading" ? "Sending..." : "Email Me This Trip 📧"}
      </Button>
    </div>
  );
}
