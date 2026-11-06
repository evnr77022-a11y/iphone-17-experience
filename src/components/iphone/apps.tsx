import { useEffect, useState, type ReactNode } from "react";

/* ================= Calculator (iOS 18 style) ================= */
const OPS = ["÷", "×", "−", "+"];
const calc = (a: number, b: number, o: string) => (o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : b === 0 ? NaN : a / b);
const fmt = (n: number) => (isNaN(n) || !isFinite(n) ? "Error" : String(+n.toPrecision(10)));
const glyph: Record<string, ReactNode> = {
  "÷": <svg viewBox="0 0 30 30" width="30"><circle cx="15" cy="7.5" r="2.4" fill="currentColor"/><circle cx="15" cy="22.5" r="2.4" fill="currentColor"/><rect x="4" y="13.6" width="22" height="2.8" rx="1.4" fill="currentColor"/></svg>,
  "×": <svg viewBox="0 0 30 30" width="26"><path d="M7 7l16 16M23 7L7 23" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/></svg>,
  "−": <svg viewBox="0 0 30 30" width="28"><rect x="4" y="13.6" width="22" height="2.8" rx="1.4" fill="currentColor"/></svg>,
  "+": <svg viewBox="0 0 30 30" width="28"><path d="M15 4v22M4 15h22" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/></svg>,
  "=": <svg viewBox="0 0 30 30" width="28"><path d="M5 10.5h20M5 19.5h20" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"/></svg>,
  "±": <svg viewBox="0 0 30 30" width="28"><path d="M9 5v10M4 10h10M7 24L23 6M17 21h9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>,
  "%": <svg viewBox="0 0 30 30" width="26"><circle cx="8.5" cy="8.5" r="3.6" stroke="currentColor" strokeWidth="2.4" fill="none"/><circle cx="21.5" cy="21.5" r="3.6" stroke="currentColor" strokeWidth="2.4" fill="none"/><path d="M23 5L7 25" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>,
};
export function Calculator() {
  const [a, setA] = useState("0");
  const [op, setOp] = useState<string | null>(null);
  const [b, setB] = useState<string | null>(null);
  const [hist, setHist] = useState("");
  const [done, setDone] = useState(false);
  const cur = op ? b : a;
  const setCur = (v: string) => (op ? setB(v) : setA(v));
  const press = (k: string) => {
    if (/[0-9]/.test(k)) {
      if (done) { setA(k); setHist(""); setDone(false); return; }
      const c = cur ?? "0";
      if (c.replace(/[-.]/g, "").length >= 9) return;
      setCur(c === "0" ? k : c === "-0" ? "-" + k : c + k);
    } else if (k === ",") {
      if (done) { setA("0."); setHist(""); setDone(false); return; }
      const c = cur ?? "0";
      if (!c.includes(".")) setCur(c + ".");
    } else if (k === "AC") {
      if (op && b !== null) setB(null);
      else { setA("0"); setOp(null); setB(null); setHist(""); setDone(false); }
    } else if (k === "±") {
      const c = cur ?? "0"; setCur(c.startsWith("-") ? c.slice(1) : "-" + c); setDone(false);
    } else if (k === "%") {
      setCur(fmt(parseFloat(cur ?? "0") / 100)); setDone(false);
    } else if (k === "=") {
      if (!op) return;
      const bb = b ?? a;
      setHist(`${show(a)}${op}${show(bb)}`);
      setA(fmt(calc(parseFloat(a), parseFloat(bb), op))); setOp(null); setB(null); setDone(true);
    } else {
      // operator
      if (op && b !== null) { const r = fmt(calc(parseFloat(a), parseFloat(b), op)); setA(r); setB(null); }
      setOp(k); setDone(false); setHist("");
    }
  };
  const show = (s: string) => {
    if (s === "Error") return s;
    const [i, d] = s.split(".");
    const neg = i!.startsWith("-");
    const int = (neg ? i!.slice(1) : i!).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return (neg ? "-" : "") + int + (d !== undefined ? "," + d : "");
  };
  const line = op ? `${show(a)}${op}${b !== null ? show(b) : ""}` : show(a);
  const fs = line.length <= 6 ? 92 : Math.max(38, 92 - (line.length - 6) * 8);
  const keys = [["AC", "±", "%", "÷"], ["7", "8", "9", "×"], ["4", "5", "6", "−"], ["1", "2", "3", "+"], ["0", ",", "="]];
  return (
    <div className="app calc">
      <div className="calc-h">{hist}</div>
      <div className="calc-d" style={{ fontSize: fs }}>{line}</div>
      {keys.map((r, i) => (
        <div className="calc-r" key={i}>
          {r.map((k) => {
            const cls = OPS.includes(k) || k === "=" ? "op" : ["AC", "±", "%"].includes(k) ? "fn" : "";
            const sel = op === k && b === null;
            return (
              <button key={k} onClick={() => press(k)} className={`ck ${k === "0" ? "zero" : ""} ${cls} ${sel ? "sel" : ""}`}>
                {glyph[k] ?? (k === "AC" ? (cur && cur !== "0" && !done ? "C" : "AC") : k)}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ================= Safari ================= */
const FAVS = [
  { n: "Wikipedia", u: "https://en.m.wikipedia.org/wiki/IPhone", c: "#000", l: "W" },
  { n: "Apple", u: "https://en.m.wikipedia.org/wiki/Apple_Inc.", c: "#1d1d1f", l: "" },
  { n: "Maps", u: "https://www.openstreetmap.org/export/embed.html?bbox=46.6,24.6,46.8,24.8", c: "#34c759", l: "M" },
  { n: "Example", u: "https://example.com", c: "#0a84ff", l: "E" },
  { n: "Riyadh", u: "https://en.m.wikipedia.org/wiki/Riyadh", c: "#ff9500", l: "R" },
  { n: "Saudi", u: "https://ar.m.wikipedia.org/wiki/السعودية", c: "#006c35", l: "S" },
  { n: "Time", u: "https://time.is/", c: "#5856d6", l: "T" },
  { n: "Roblox", u: "https://en.m.wikipedia.org/wiki/Roblox", c: "#e2231a", l: "R" },
];

/* ================= Wallet ================= */
const CARDS = [
  { n: "Apple Card", s: "Titanium", bg: "linear-gradient(135deg,#ffffff,#e6e6ea)", fg: "#1d1d1f", num: "•••• 4021", bal: "SAR 1,240.50" },
  { n: "Al Rajhi Bank", s: "Mada Debit", bg: "linear-gradient(135deg,#0c3a8a,#2563c9)", fg: "#fff", num: "•••• 7788", bal: "SAR 8,930.00" },
  { n: "Saudia", s: "RUH → JED  ·  SV1023", bg: "linear-gradient(135deg,#0b5e3a,#1aa36a)", fg: "#fff", num: "Gate B12 · Seat 14A", bal: "Boarding 18:40" },
  { n: "Apple Cash", s: "Balance", bg: "linear-gradient(135deg,#111,#3a3a3c)", fg: "#fff", num: "Apple Cash", bal: "SAR 215.00" },
];
export function Wallet() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <div className="app wallet">
      <div className="wl-head"><h1>Wallet</h1><span className="wl-plus">+</span></div>
      <div className={`wl-stack ${sel !== null ? "open" : ""}`}>
        {CARDS.map((c, i) => {
          const y = sel === null ? i * 64 : sel === i ? 0 : 470 + i * 12;
          return (
            <button key={c.n} className="wl-card" onClick={() => setSel(sel === i ? null : i)} style={{ background: c.bg, color: c.fg, transform: `translateY(${y}px)`, zIndex: sel === i ? 20 : i }}>
              <div className="wl-top"><b>{c.n}</b><small>{c.s}</small></div>
              <div className="wl-bot"><span>{c.num}</span><b>{c.bal}</b></div>
              {i === 0 && <svg className="wl-logo" viewBox="0 0 20 24" width="24"><path d="M16.4 12.7c0-2.7 2.2-4 2.3-4-1.3-1.9-3.3-2.1-4-2.2-1.7-.2-3.3 1-4.2 1-.9 0-2.2-1-3.6-.9-1.9 0-3.6 1.1-4.5 2.7-1.9 3.4-.5 8.4 1.4 11.1.9 1.3 2 2.8 3.4 2.8 1.4-.1 1.9-.9 3.5-.9s2.1.9 3.6.9c1.5 0 2.4-1.4 3.3-2.7 1-1.5 1.5-3 1.5-3-.1 0-2.9-1.1-2.9-4.4zM13.7 4.6c.7-.9 1.3-2.2 1.1-3.4-1.1 0-2.4.7-3.2 1.7-.7.8-1.3 2.1-1.1 3.3 1.2.1 2.4-.6 3.2-1.6z" fill="currentColor"/></svg>}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div className="wl-detail">
          <div className="wl-pay"><svg viewBox="0 0 40 40" width="46"><rect x="3" y="3" width="34" height="34" rx="9" stroke="#0a84ff" strokeWidth="2.5" fill="none"/><circle cx="14" cy="16" r="1.8" fill="#0a84ff"/><circle cx="26" cy="16" r="1.8" fill="#0a84ff"/><path d="M20 15v8h-2M14 27c3.5 3 8.5 3 12 0" stroke="#0a84ff" strokeWidth="2.2" fill="none" strokeLinecap="round"/></svg><span>Hold Near Reader</span></div>
          <div className="wl-tx"><small>LATEST TRANSACTIONS</small>
            {[["Starbucks", "Today", "SAR 24.00"], ["Jarir Bookstore", "Yesterday", "SAR 189.00"], ["Careem", "Monday", "SAR 32.50"]].map(([a, b, c]) => <div key={a}><span><b>{a}</b><small>{b}</small></span><b>{c}</b></div>)}
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= YouTube ================= */
const VIDS = [
  { id: "aqz-KE-bpKQ", t: "Big Buck Bunny 60fps 4K", c: "Blender", v: "18M views" },
  { id: "jNQXAC9IVRw", t: "Me at the zoo", c: "jawed", v: "340M views" },
  { id: "9bZkp7q19f0", t: "PSY - GANGNAM STYLE", c: "officialpsy", v: "5.3B views" },
  { id: "kJQP7kiw5Fk", t: "Luis Fonsi - Despacito ft. Daddy Yankee", c: "Luis Fonsi", v: "8.7B views" },
  { id: "eRsGyueVLvQ", t: "Sintel - Open Movie", c: "Blender", v: "9M views" },
  { id: "dQw4w9WgXcQ", t: "Rick Astley - Never Gonna Give You Up", c: "Rick Astley", v: "1.6B views" },
];

/* ================= Passwords ================= */
const PW = [
  { s: "apple.com", u: "abdullah@icloud.com", p: "Sun-Dune-2026!", c: "#000" },
  { s: "google.com", u: "abdullah@gmail.com", p: "kT9#qLm2vX", c: "#4285f4" },
  { s: "instagram.com", u: "@abdullah", p: "Riyadh*Night88", c: "#e1306c" },
  { s: "roblox.com", u: "abdullah_rbx", p: "Bl0x-Master!7", c: "#e2231a" },
  { s: "snapchat.com", u: "abdullah.snap", p: "Ghost$Yellow3", c: "#fffc00" },
  { s: "x.com", u: "@abdullah_k", p: "Bird_Gone_2023", c: "#111" },
];
export function Passwords() {
  const [auth, setAuth] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAuth(true), 1300); return () => clearTimeout(t); }, []);
  if (!auth) return (
    <div className="app light pw-lock">
      <div className="faceid"><svg viewBox="0 0 60 60" width="70"><path d="M4 18V10a6 6 0 0 1 6-6h8M42 4h8a6 6 0 0 1 6 6v8M56 42v8a6 6 0 0 1-6 6h-8M18 56h-8a6 6 0 0 1-6-6v-8" stroke="#0a84ff" strokeWidth="3.5" fill="none" strokeLinecap="round"/><path d="M20 22v5M40 22v5M30 22v12h-3M22 41c5 4 11 4 16 0" stroke="#0a84ff" strokeWidth="3.5" fill="none" strokeLinecap="round"/></svg></div>
      <b>Face ID</b>
    </div>
  );
  const it = sel !== null ? PW[sel] : null;
  return (
    <div className="app light set">
      {it ? (
        <>
          <div className="nav"><button onClick={() => { setSel(null); setShow(false); }}>‹ All</button></div>
          <div className="pw-hero"><span style={{ background: it.c }}>{it.s[0]!.toUpperCase()}</span><h2>{it.s}</h2></div>
          <div className="sgrp">
            <div className="srow"><span className="st">User Name</span><span className="sv">{it.u}</span></div>
            <div className="srow" onClick={() => setShow(!show)}><span className="st">Password</span><span className="sv mono">{show ? it.p : "••••••••••"}</span></div>
          </div>
          <div className="sgrp">
            <button className="srow lnk" onClick={() => { navigator.clipboard?.writeText(it.p); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied ✓" : "Copy Password"}</button>
            <button className="srow lnk" onClick={() => setShow(!show)}>{show ? "Hide Password" : "Show Password"}</button>
          </div>
        </>
      ) : (
        <>
          <h1>Passwords</h1>
          <div className="srch">Search</div>
          <div className="pw-cats">
            {[["All", PW.length, "#0a84ff"], ["Passkeys", 2, "#34c759"], ["Codes", 3, "#8e8e93"], ["Wi-Fi", 4, "#30b0c7"], ["Security", 0, "#ff3b30"], ["Deleted", 1, "#ff9500"]].map(([n, c, col]) => (
              <div key={n as string} className="pw-cat"><span style={{ background: col as string }} /><b>{c}</b><small>{n}</small></div>
            ))}
          </div>
          <div className="slabel">ALL</div>
          <div className="sgrp">
            {PW.map((p, i) => (
              <button key={p.s} className="srow" onClick={() => setSel(i)}>
                <span className="sic" style={{ background: p.c, color: p.c === "#fffc00" ? "#000" : "#fff", fontWeight: 700 }}>{p.s[0]!.toUpperCase()}</span>
                <span className="st"><b>{p.s}</b><small className="sub">{p.u}</small></span><span className="sv"><b>›</b></span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ================= Phone ================= */

/* ================= Messages ================= */
export function Messages() {
  const [msgs, setMsgs] = useState<{ me: boolean; t: string }[]>([{ me: false, t: "Welcome to your new iPhone 17 Pro 🎉" }, { me: false, t: "Try sending me a message!" }]);
  const [t, setT] = useState("");
  const replies = ["Nice! 😄", "That's cool", "Haha 😂", "Ok 👍", "iPhone 17 Pro is amazing", "Tell me more"];
  const send = () => {
    if (!t.trim()) return;
    setMsgs((m) => [...m, { me: true, t }]); setT("");
    setTimeout(() => setMsgs((m) => [...m, { me: false, t: replies[Math.floor(Math.random() * replies.length)]! }]), 1100);
  };
  return (
    <div className="app light msg">
      <div className="msg-head"><span className="av sm">A</span><small>Apple ›</small></div>
      <div className="msg-list">{msgs.map((m, i) => <div key={i} className={`bub ${m.me ? "me" : ""}`}>{m.t}</div>)}</div>
      <form className="msg-in" onSubmit={(e) => { e.preventDefault(); send(); }}>
        <span className="msg-plus">+</span>
        <input value={t} onChange={(e) => setT(e.target.value)} placeholder="iMessage" />
        {t && <button className="msg-send">↑</button>}
      </form>
    </div>
  );
}

/* ================= Calendar ================= */
export function CalendarApp({ now }: { now: Date }) {
  const [m, setM] = useState(now.getMonth());
  const [y, setY] = useState(now.getFullYear());
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const name = new Date(y, m, 1).toLocaleString("en", { month: "long" });
  const mv = (d: number) => { const nd = new Date(y, m + d, 1); setM(nd.getMonth()); setY(nd.getFullYear()); };
  return (
    <div className="app light cal">
      <div className="cal-nav"><button onClick={() => mv(-1)}>‹ {y}</button><button onClick={() => mv(1)}>›</button></div>
      <h1>{name}</h1>
      <div className="cal-g">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <small key={i}>{d}</small>)}
        {Array.from({ length: first }).map((_, i) => <span key={"e" + i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const today = i + 1 === now.getDate() && m === now.getMonth() && y === now.getFullYear();
          return <span key={i} className={today ? "today" : ""}>{i + 1}</span>;
        })}
      </div>
    </div>
  );
}

/* ================= Reminders ================= */
export function Reminders() {
  const [items, setItems] = useState([{ t: "Buy groceries", d: false }, { t: "Call mom", d: false }, { t: "Finish Roblox game", d: true }]);
  const [n, setN] = useState("");
  return (
    <div className="app light set">
      <h1 style={{ color: "#0a84ff" }}>Reminders</h1>
      <div className="sgrp">
        {items.map((it, i) => (
          <div key={i} className="srow" onClick={() => setItems(items.map((x, j) => (j === i ? { ...x, d: !x.d } : x)))}>
            <span className={`chk ${it.d ? "on" : ""}`} /><span className="st" style={{ color: it.d ? "#8e8e93" : undefined }}>{it.t}</span>
          </div>
        ))}
        <form className="srow" onSubmit={(e) => { e.preventDefault(); if (n.trim()) { setItems([...items, { t: n, d: false }]); setN(""); } }}>
          <span className="chk add">+</span><input className="rm-in" value={n} onChange={(e) => setN(e.target.value)} placeholder="New Reminder" />
        </form>
      </div>
    </div>
  );
}

