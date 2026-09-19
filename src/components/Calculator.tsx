"use client";

import { useEffect, useState } from "react";
import { Delete, History, Minus, Plus, X } from "lucide-react";

type Operator = "+" | "−" | "×" | "÷";

const keys: Array<{ label: string; action: string; kind?: "operator" | "accent" }> = [
  { label: "AC", action: "clear", kind: "accent" },
  { label: "+/−", action: "sign" },
  { label: "%", action: "percent" },
  { label: "÷", action: "÷", kind: "operator" },
  { label: "7", action: "7" }, { label: "8", action: "8" }, { label: "9", action: "9" }, { label: "×", action: "×", kind: "operator" },
  { label: "4", action: "4" }, { label: "5", action: "5" }, { label: "6", action: "6" }, { label: "−", action: "−", kind: "operator" },
  { label: "1", action: "1" }, { label: "2", action: "2" }, { label: "3", action: "3" }, { label: "+", action: "+", kind: "operator" },
  { label: "0", action: "0" }, { label: ".", action: "." }, { label: "=", action: "equals", kind: "operator" },
];

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "Error";
  return String(Number(value.toFixed(10)));
}

function operate(left: number, right: number, operator: Operator) {
  if (operator === "+") return left + right;
  if (operator === "−") return left - right;
  if (operator === "×") return left * right;
  return right === 0 ? Number.NaN : left / right;
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [expression, setExpression] = useState("Ready");
  const [fresh, setFresh] = useState(true);

  const press = (action: string) => {
    if (/^\d$/.test(action)) {
      setDisplay((current) => (fresh || current === "Error" ? action : current === "0" ? action : current + action));
      setFresh(false);
      return;
    }
    if (action === ".") {
      setDisplay((current) => fresh || current === "Error" ? "0." : current.includes(".") ? current : current + ".");
      setFresh(false);
      return;
    }
    if (action === "clear") {
      setDisplay("0"); setMemory(null); setOperator(null); setExpression("Ready"); setFresh(true);
      return;
    }
    if (action === "backspace") {
      if (fresh) return;
      setDisplay((current) => current.length <= 1 || (current.length === 2 && current.startsWith("-")) ? "0" : current.slice(0, -1));
      return;
    }
    if (action === "sign") {
      if (display !== "0" && display !== "Error") setDisplay((current) => current.startsWith("-") ? current.slice(1) : "-" + current);
      return;
    }
    if (action === "percent") {
      if (display !== "Error") { setDisplay(formatNumber(Number(display) / 100)); setFresh(true); }
      return;
    }

    if (action === "equals") {
      if (memory === null || !operator || display === "Error") return;
      const result = operate(memory, Number(display), operator);
      const formatted = formatNumber(result);
      setExpression(`${formatNumber(memory)} ${operator} ${display} =`);
      setDisplay(formatted); setMemory(null); setOperator(null); setFresh(true);
      return;
    }

    const nextOperator = action as Operator;
    if (display === "Error") return;
    if (memory !== null && operator && !fresh) {
      const result = operate(memory, Number(display), operator);
      const formatted = formatNumber(result);
      setDisplay(formatted); setMemory(result); setExpression(`${formatNumber(memory)} ${operator} ${display}`);
    } else {
      setMemory(Number(display));
      setExpression(`${display} ${nextOperator}`);
    }
    setOperator(nextOperator); setFresh(true);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const map: Record<string, string> = { Enter: "equals", "=": "equals", Escape: "clear", Backspace: "backspace", "+": "+", "-": "−", "*": "×", "/": "÷", "%": "percent", ".": "." };
      const action = /^\d$/.test(event.key) ? event.key : map[event.key];
      if (action) { event.preventDefault(); press(action); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <header className="mb-8 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200"><Calculator size={22} strokeWidth={2.4} /></div>
            <div><p className="text-lg font-bold tracking-tight">SimpleCalc</p><p className="text-xs font-medium text-slate-400">Everyday arithmetic</p></div>
          </div>
          <button aria-label="View calculation history" className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><History size={20} /></button>
        </header>

        <section aria-label="Calculator" className="rounded-[2rem] bg-white p-5 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.22)] ring-1 ring-slate-100 sm:p-6">
          <div className="mb-5 min-h-36 rounded-3xl bg-slate-950 px-6 py-5 text-right shadow-inner">
            <p className="h-6 overflow-hidden text-sm font-medium tracking-wide text-slate-400">{expression}</p>
            <output aria-live="polite" className="mt-3 block overflow-x-auto whitespace-nowrap text-5xl font-semibold tracking-tight text-white">{display}</output>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {keys.map((key) => (
              <button key={key.action} onClick={() => press(key.action)} className={`h-16 rounded-2xl text-xl font-semibold transition active:scale-95 ${key.kind === "operator" ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 hover:bg-indigo-700" : key.kind === "accent" ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100" : "bg-slate-100 text-slate-700 hover:bg-slate-200"} ${key.label === "0" ? "col-span-2" : ""}`}>
                {key.label === "−" ? <Minus className="mx-auto" size={21} /> : key.label === "+" ? <Plus className="mx-auto" size={21} /> : key.label === "×" ? <X className="mx-auto" size={21} /> : key.label}
              </button>
            ))}
          </div>
          <button onClick={() => press("backspace")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-50 hover:text-slate-700"><Delete size={17} /> Delete last digit</button>
        </section>
        <p className="mt-6 text-center text-xs font-medium text-slate-400">Use your keyboard or tap the keys to calculate.</p>
      </div>
    </main>
  );
}
