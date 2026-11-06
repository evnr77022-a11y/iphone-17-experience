import { useEffect, useState } from "react";

const SEARCH = (q: string) => `https://www.google.com/search?igu=1&q=${encodeURIComponent(q)}`;
const FAVS = [
  { n: "Google", u: "https://www.google.com/webhp?igu=1", c: "#fff", l: "G", f: "#4285f4" },
  { n: "Wikipedia", u: "https://en.m.wikipedia.org/wiki/IPhone", c: "#000", l: "W" },
  { n: "Maps", u: "https://www.openstreetmap.org/export/embed.html?bbox=46.6,24.6,46.8,24.8", c: "#34c759", l: "M" },
  { n: "Bing", u: "https://www.bing.com/", c: "#0078d4", l: "b" },
  { n: "Riyadh", u: "https://en.m.wikipedia.org/wiki/Riyadh", c: "#ff9500", l: "R" },
  { n: "Example", u: "https://example.com", c: "#0a84ff", l: "E" },
  { n: "Archive", u: "https://archive.org", c: "#333", l: "A" },
  { n: "Roblox", u: "https://en.m.wikipedia.org/wiki/Roblox", c: "#e2231a", l: "R" },
];
const svgS = (d: string, c = "#0a84ff") => <svg viewBox="0 0 24 24" width="24"><path d={d} stroke={c} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export function Safari() {
  const [hist, setHist] = useState<string[]>([]);
  const [pos, setPos] = useState(-1);
  const [input, setInput] = useState("");
  const [focus, setFocus] = useState(false);
  const [key, setKey] = useState(0);
  const url = pos >= 0 ? hist[pos] : null;
  const nav = (u: string) => { const h = [...hist.slice(0, pos + 1), u]; setHist(h); setPos(h.length - 1); setInput(""); setFocus(false); };
  const go = (q: string) => {
    q = q.trim(); if (!q) return;
    let u = /^https?:\/\//.test(q) ? q : /^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(q) ? "https://" + q : SEARCH(q);
    if (/^https?:\/\/(www\.)?google\.[a-z.]+\/?$/.test(u)) u = "https://www.google.com/webhp?igu=1";
    nav(u);
  };
  const host = url ? new URL(url).hostname.replace(/^www\.|^en\.m\.|^ar\.m\./, "") : "";
  return (
    <div className="app light saf">
      <div className="saf-page">
        {url ? <>
          <iframe key={key + url} src={url} title="page" className="saf-frame" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" />
          <a className="saf-ext" href={url} target="_blank" rel="noreferrer">Page not loading? Open in new tab ↗</a>
        </> : (
          <div className="saf-start">
            <h3>Favorites</h3>
            <div className="saf-favs">
              {FAVS.map((f) => (
                <button key={f.n} onClick={() => nav(f.u)}>
                  <span style={{ background: f.c, color: f.f ?? "#fff" }}>{f.l}</span>
                  <small>{f.n}</small>
                </button>
              ))}
            </div>
            <h3>Privacy Report</h3>
            <div className="saf-card">In the last seven days, Safari has prevented 27 trackers from profiling you.</div>
          </div>
        )}
      </div>
      <div className="saf-bar">
        <form className={`saf-url ${focus ? "f" : ""}`} onSubmit={(e) => { e.preventDefault(); go(input); }}>
          <svg viewBox="0 0 20 20" width="15"><circle cx="8.5" cy="8.5" r="5.5" stroke="#8e8e93" strokeWidth="2" fill="none" /><path d="M13 13l4 4" stroke="#8e8e93" strokeWidth="2" strokeLinecap="round" /></svg>
          <input value={input} onFocus={() => setFocus(true)} onBlur={() => setTimeout(() => setFocus(false), 150)} onChange={(e) => setInput(e.target.value)} placeholder={host || "Search or enter website"} enterKeyHint="go" />
          {url && !focus && <button type="button" onClick={() => setKey(key + 1)} className="saf-rl">↻</button>}
        </form>
        <div className="saf-tools">
          <button onClick={() => setPos(Math.max(-1, pos - 1))} disabled={pos < 0} aria-label="Back">{svgS("M15 4l-8 8 8 8", pos < 0 ? "#c7c7cc" : "#0a84ff")}</button>
          <button onClick={() => setPos(Math.min(hist.length - 1, pos + 1))} disabled={pos >= hist.length - 1} aria-label="Forward">{svgS("M9 4l8 8-8 8", pos >= hist.length - 1 ? "#c7c7cc" : "#0a84ff")}</button>
          <button aria-label="Share" onClick={() => url && navigator.clipboard?.writeText(url)}>{svgS("M12 3v12M8 7l4-4 4 4M6 11H5v10h14V11h-1")}</button>
          <button aria-label="Bookmarks" onClick={() => setPos(-1)}>{svgS("M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1zM12 6v14")}</button>
          <button aria-label="Tabs" onClick={() => { setHist([]); setPos(-1); }}>{svgS("M7 3h11a3 3 0 0 1 3 3v11M4 8v10a3 3 0 0 0 3 3h10")}</button>
        </div>
      </div>
    </div>
  );
}

/* ================= YouTube ================= */
type V = { id: string; t: string; c: string; v: string };
const VIDS: V[] = [
  { id: "aqz-KE-bpKQ", t: "Big Buck Bunny 60fps 4K", c: "Blender", v: "18M views" },
  { id: "jNQXAC9IVRw", t: "Me at the zoo", c: "jawed", v: "340M views" },
  { id: "9bZkp7q19f0", t: "PSY - GANGNAM STYLE", c: "officialpsy", v: "5.3B views" },
  { id: "kJQP7kiw5Fk", t: "Luis Fonsi - Despacito ft. Daddy Yankee", c: "Luis Fonsi", v: "8.7B views" },
  { id: "eRsGyueVLvQ", t: "Sintel - Open Movie", c: "Blender", v: "9M views" },
  { id: "dQw4w9WgXcQ", t: "Rick Astley - Never Gonna Give You Up", c: "Rick Astley", v: "1.6B views" },
];
const ytId = (s: string) => s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? (/^[\w-]{11}$/.test(s) ? s : null);
const PIPED = ["https://pipedapi.kavin.rocks", "https://pipedapi.adminforge.de", "https://api.piped.private.coffee"];
async function ytSearch(q: string): Promise<V[]> {
  for (const b of PIPED) {
    try {
      const r = await fetch(`${b}/search?q=${encodeURIComponent(q)}&filter=videos`);
      if (!r.ok) continue;
      const j = await r.json();
      const out = (j.items ?? []).filter((x: { url?: string }) => x.url?.includes("watch")).map((x: { url: string; title: string; uploaderName: string; views: number }) => ({ id: x.url.split("v=")[1]!.slice(0, 11), t: x.title, c: x.uploaderName, v: x.views > 0 ? Intl.NumberFormat("en", { notation: "compact" }).format(x.views) + " views" : "" }));
      if (out.length) return out;
    } catch { /* try next */ }
  }
  return [];
}
export function YouTube() {
  const [play, setPlay] = useState<V | null>(null);
  const [q, setQ] = useState("");
  const [list, setList] = useState<V[]>(VIDS);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("Home");
  const [subs, setSubs] = useState<string[]>(["Blender"]);
  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    const s = q.trim(); if (!s) { setList(VIDS); return; }
    const id = ytId(s);
    if (id) { setPlay({ id, t: "YouTube video", c: "", v: "" }); return; }
    setBusy(true);
    const r = await ytSearch(s);
    setBusy(false);
    setList(r.length ? r : VIDS.filter((v) => v.t.toLowerCase().includes(s.toLowerCase())));
    setTab("Home");
  };
  const shown = tab === "Subscriptions" ? list.filter((v) => subs.includes(v.c)) : tab === "You" ? [] : list;
  return (
    <div className="app yt">
      <form className="yt-head" onSubmit={search}>
        <span className="yt-logo"><svg viewBox="0 0 28 20" width="30"><rect width="28" height="20" rx="5" fill="#ff0033" /><path d="M11 6l7 4-7 4z" fill="#fff" /></svg><b>YouTube</b></span>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search or paste link" enterKeyHint="search" />
      </form>
      {play && (
        <div className="yt-player">
          <iframe src={`https://www.youtube-nocookie.com/embed/${play.id}?autoplay=1&playsinline=1`} title={play.t} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          <div className="yt-info"><b>{play.t}</b><small>{play.c}{play.v && ` · ${play.v}`}</small>
            {play.c && <button className={`yt-sub ${subs.includes(play.c) ? "on" : ""}`} onClick={() => setSubs(subs.includes(play.c) ? subs.filter((x) => x !== play.c) : [...subs, play.c])}>{subs.includes(play.c) ? "Subscribed" : "Subscribe"}</button>}
          </div>
        </div>
      )}
      <div className={`yt-list ${tab === "Shorts" ? "shorts" : ""}`}>
        {busy && <p className="yt-empty">Searching…</p>}
        {tab === "You" && <p className="yt-empty">Your history and playlists appear here.</p>}
        {!busy && shown.filter((v) => v.id !== play?.id).map((v) => (
          <button key={v.id} className="yt-item" onClick={() => setPlay(v)}>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" />
            <div><b>{v.t}</b><small>{v.c}{v.v && ` · ${v.v}`}</small></div>
          </button>
        ))}
      </div>
      <div className="yt-tabs">{["Home", "Shorts", "Subscriptions", "You"].map((t) => <button key={t} onClick={() => setTab(t)} className={t === tab ? "on" : ""}>{t}</button>)}</div>
    </div>
  );
}

/* ================= Phone ================= */
const CONTACTS = ["Mom", "Dad", "Ahmed", "Sara", "Khalid", "Noura"];
const CallIc = ({ s = 34 }: { s?: number }) => <svg viewBox="0 0 30 30" width={s}><path d="M9 4c.8-.2 1.6.2 2 .9l2 4.2c.3.7.2 1.5-.4 2l-1.9 1.6c1.3 2.9 3.4 5.1 6.3 6.4l1.6-1.9c.5-.6 1.3-.7 2-.4l4.2 2c.7.4 1.1 1.2.9 2l-.8 3c-.2.8-1 1.4-1.8 1.4C13.1 25.2 5.8 17.9 5.8 8.3c0-.9.6-1.6 1.4-1.8z" fill="currentColor" /></svg>;
export function Phone() {
  const [n, setN] = useState("");
  const [call, setCall] = useState<string | null>(null);
  const [sec, setSec] = useState(0);
  const [tab, setTab] = useState("Keypad");
  const [recents, setRecents] = useState<string[]>(["Mom", "Ahmed", "+966 55 123 4567"]);
  const [opts, setOpts] = useState<Record<string, boolean>>({});
  useEffect(() => { if (!call) return; const t = setInterval(() => setSec((s) => s + 1), 1000); return () => clearInterval(t); }, [call]);
  const dial = (who: string) => { if (!who) return; setCall(who); setRecents((r) => [who, ...r.filter((x) => x !== who)].slice(0, 12)); };
  const keys = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"], ["*", ""], ["0", "+"], ["#", ""]];
  if (call) return (
    <div className="app ph-call">
      <div className="ph-who"><h2>{call}</h2><span>{sec < 2 ? "calling…" : `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`}</span></div>
      <div className="ph-opts">
        {["speaker", "FaceTime", "mute", "add", "end", "keypad"].map((o) => o === "end" ? <span key={o} /> : (
          <button key={o} className={opts[o] ? "on" : ""} onClick={() => setOpts({ ...opts, [o]: !opts[o] })}><i>{o === "mute" ? "🎙︎" : ""}</i><small>{o}</small></button>
        ))}
      </div>
      <button className="ph-btn red" onClick={() => { setCall(null); setSec(0); setOpts({}); }}><span style={{ transform: "rotate(135deg)", display: "flex", color: "#fff" }}><CallIc /></span></button>
    </div>
  );
  return (
    <div className={`app ph-pad ${tab !== "Keypad" ? "light" : ""}`}>
      {tab === "Keypad" ? <>
        <div className="ph-num">{n}</div>
        <div className="ph-keys">
          {keys.map(([k, s]) => <button key={k} onClick={() => n.length < 15 && setN(n + k)}><b>{k}</b><small>{s}</small></button>)}
        </div>
        <div className="ph-row">
          <span />
          <button className="ph-btn" style={{ color: "#fff" }} onClick={() => dial(n)}><CallIc /></button>
          {n ? <button className="ph-del" onClick={() => setN(n.slice(0, -1))}>⌫</button> : <span />}
        </div>
      </> : (
        <div className="ph-listv">
          <h1>{tab}</h1>
          {tab === "Voicemail" ? <p className="yt-empty" style={{ color: "#8e8e93" }}>No Voicemail</p> : (
            <div className="sgrp">
              {(tab === "Recents" ? recents : tab === "Favorites" ? CONTACTS.slice(0, 3) : CONTACTS).map((c, i) => (
                <button key={c + i} className="srow" onClick={() => dial(c)}>
                  <span className="sic" style={{ background: "#a2a2a7", borderRadius: "50%" }}>{c[0]}</span>
                  <span className="st"><b>{c}</b>{tab === "Recents" && <small className="sub">mobile</small>}</span>
                  <span className="sv" style={{ color: "#0a84ff" }}><CallIc s={20} /></span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="tabbar">{["Favorites", "Recents", "Contacts", "Keypad", "Voicemail"].map((t) => <button key={t} onClick={() => setTab(t)} className={t === tab ? "on blue" : ""}>{t}</button>)}</div>
    </div>
  );
}

/* ================= Maps ================= */
const PLACES: [string, string][] = [["Riyadh", "46.6,24.6,46.8,24.8"], ["Jeddah", "39.1,21.4,39.3,21.6"], ["Makkah", "39.78,21.38,39.88,21.46"], ["Dubai", "55.2,25.15,55.35,25.28"]];
export function MapsApp() {
  const [p, setP] = useState(0);
  return (
    <div className="app light maps">
      <iframe title="map" src={`https://www.openstreetmap.org/export/embed.html?bbox=${PLACES[p]![1]}&layer=mapnik`} />
      <div className="maps-sheet">
        <div className="srch">Search Maps</div>
        <div className="maps-chips">{PLACES.map(([n], i) => <button key={n} className={i === p ? "on" : ""} onClick={() => setP(i)}>{n}</button>)}</div>
      </div>
    </div>
  );
}

/* ================= Passcode pad ================= */
export function PinPad({ title, onDone, onCancel, error }: { title: string; onDone: (c: string) => void; onCancel?: () => void; error?: boolean }) {
  const [c, setC] = useState("");
  useEffect(() => { if (c.length === 6) { const t = setTimeout(() => { onDone(c); setC(""); }, 120); return () => clearTimeout(t); } }, [c, onDone]);
  const k = [["1", ""], ["2", "ABC"], ["3", "DEF"], ["4", "GHI"], ["5", "JKL"], ["6", "MNO"], ["7", "PQRS"], ["8", "TUV"], ["9", "WXYZ"]];
  return (
    <div className="pin" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()}>
      <b>{title}</b>
      <div className={`pin-dots ${error ? "shake" : ""}`}>{Array.from({ length: 6 }).map((_, i) => <span key={i} className={i < c.length ? "f" : ""} />)}</div>
      <div className="pin-keys">
        {k.map(([d, s]) => <button key={d} onClick={() => setC((x) => (x + d).slice(0, 6))}><b>{d}</b><small>{s}</small></button>)}
        <span /><button onClick={() => setC((x) => (x + "0").slice(0, 6))}><b>0</b></button><span />
      </div>
      <div className="pin-foot"><span>Emergency</span><button onClick={() => (c ? setC(c.slice(0, -1)) : onCancel?.())}>{c ? "Delete" : "Cancel"}</button></div>
    </div>
  );
}
