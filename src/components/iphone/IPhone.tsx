import { useEffect, useRef, useState, type ReactNode } from "react";
import { icons, CalendarIcon } from "./icons";
import wOrange from "@/assets/wall-orange.jpg";
import wBlue from "@/assets/wall-blue.jpg";
import wDark from "@/assets/wall-dark.jpg";
import photo1 from "@/assets/photo-1.jpg";

const WALLS = [wOrange, wBlue, wDark];
const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DOWL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MON = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type AppId = keyof typeof icons;
const NAMES: Record<string, string> = {
  phone: "Phone", messages: "Messages", safari: "Safari", music: "Music", mail: "Mail", calendar: "Calendar",
  photos: "Photos", camera: "Camera", clock: "Clock", weather: "Weather", notes: "Notes", calculator: "Calculator",
  settings: "Settings", appstore: "App Store", maps: "Maps", facetime: "FaceTime", wallet: "Wallet", health: "Health",
  files: "Files", tv: "TV", podcasts: "Podcasts", reminders: "Reminders",
};
const GRID: AppId[] = ["facetime", "calendar", "photos", "camera", "mail", "clock", "maps", "weather", "reminders", "notes", "calculator", "podcasts", "appstore", "health", "wallet", "settings"];
const DOCK: AppId[] = ["phone", "safari", "messages", "music"];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now ?? new Date(2026, 10, 5, 9, 41);
}
const hm = (d: Date) => `${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`;

function Icon({ id, now }: { id: AppId; now: Date }) {
  return id === "calendar" ? <CalendarIcon day={now.getDate()} dow={DOW[now.getDay()]} /> : icons[id];
}

/* ---------- status bar ---------- */
function StatusBar({ now, dark }: { now: Date; dark?: boolean }) {
  return (
    <div className={`sb ${dark ? "sb-dark" : ""}`}>
      <span className="sb-time">{hm(now)}</span>
      <span className="sb-r">
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5L5.6 9a3.4 3.4 0 0 1 4.8 0zM3.5 7a6.3 6.3 0 0 1 9 0l1.5-1.5a8.5 8.5 0 0 0-12 0zM.6 4.1a10.6 10.6 0 0 1 14.8 0L16 3.4A11.6 11.6 0 0 0 0 3.4z" fill="currentColor"/></svg>
        <span className="batt"><span className="batt-in" /></span>
      </span>
    </div>
  );
}

/* ---------- apps ---------- */
function Calculator() {
  const [d, setD] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const calc = (a: number, b: number, o: string) => (o === "+" ? a + b : o === "−" ? a - b : o === "×" ? a * b : b === 0 ? NaN : a / b);
  const fmt = (n: number) => (isNaN(n) || !isFinite(n) ? "Error" : String(+n.toPrecision(9)));
  const press = (k: string) => {
    if (/[0-9]/.test(k)) { setD(fresh || d === "0" ? k : d.length < 9 ? d + k : d); setFresh(false); }
    else if (k === ",") { if (fresh) { setD("0."); setFresh(false); } else if (!d.includes(".")) setD(d + "."); }
    else if (k === "AC") { setD("0"); setAcc(null); setOp(null); setFresh(true); }
    else if (k === "±") setD(fmt(-parseFloat(d)));
    else if (k === "%") setD(fmt(parseFloat(d) / 100));
    else if (k === "=") { if (op && acc !== null) { setD(fmt(calc(acc, parseFloat(d), op))); setAcc(null); setOp(null); setFresh(true); } }
    else { const v = parseFloat(d); const r = op && acc !== null && !fresh ? calc(acc, v, op) : v; setAcc(r); setD(fmt(r)); setOp(k); setFresh(true); }
  };
  const keys = [["AC", "±", "%", "÷"], ["7", "8", "9", "×"], ["4", "5", "6", "−"], ["1", "2", "3", "+"], ["0", ",", "="]];
  const shown = d.replace(".", ",");
  return (
    <div className="app calc">
      <div className="calc-d" style={{ fontSize: shown.length > 6 ? 88 - (shown.length - 6) * 9 : 88 }}>{shown}</div>
      {keys.map((r, i) => (
        <div className="calc-r" key={i}>
          {r.map((k) => (
            <button key={k} onClick={() => press(k)}
              className={`ck ${k === "0" ? "zero" : ""} ${["÷", "×", "−", "+", "="].includes(k) ? "op" : ["AC", "±", "%"].includes(k) ? "fn" : ""} ${op === k && fresh ? "sel" : ""}`}>
              {k === "AC" && d !== "0" ? "C" : k}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

function Settings({ wall, setWall }: { wall: number; setWall: (n: number) => void }) {
  const [air, setAir] = useState(false);
  const Row = ({ c, ic, t, v, tog }: { c: string; ic: ReactNode; t: string; v?: string; tog?: [boolean, (b: boolean) => void] }) => (
    <div className="srow">
      <span className="sic" style={{ background: c }}>{ic}</span>
      <span className="st">{t}</span>
      {tog ? <button className={`tog ${tog[0] ? "on" : ""}`} onClick={() => tog[1](!tog[0])}><i /></button> : <span className="sv">{v} <b>›</b></span>}
    </div>
  );
  const g = (p: string) => <svg viewBox="0 0 20 20" width="17" height="17"><path d={p} fill="#fff" /></svg>;
  return (
    <div className="app light set">
      <h1>Settings</h1>
      <div className="srch">Search</div>
      <div className="sgrp prof">
        <span className="av">AK</span>
        <div><b>Abdullah</b><small>Apple Account, iCloud+, and more</small></div><b className="chev">›</b>
      </div>
      <div className="sgrp">
        <Row c="#ff9500" ic={g("M2 11l16-7-6 14-2-6z")} t="Airplane Mode" tog={[air, setAir]} />
        <Row c="#0a84ff" ic={g("M10 15l-2-2a3 3 0 0 1 4 0zM5 10a7 7 0 0 1 10 0l-1.5 1.5a5 5 0 0 0-7 0zM2 7a11 11 0 0 1 16 0l-1.5 1.5a9 9 0 0 0-13 0z")} t="Wi-Fi" v={air ? "Off" : "Home_5G"} />
        <Row c="#0a84ff" ic={g("M9 2l6 5-4 3 4 3-6 5V11L5 14l-1-1 4-3-4-3 1-1 4 3z")} t="Bluetooth" v={air ? "Off" : "On"} />
        <Row c="#34c759" ic={g("M4 13h3v4H4zM9 9h3v8H9zM14 4h3v13h-3z")} t="Cellular" v="" />
      </div>
      <div className="slabel">WALLPAPER</div>
      <div className="sgrp walls">
        {WALLS.map((w, i) => (
          <button key={i} className={`wp ${wall === i ? "on" : ""}`} onClick={() => setWall(i)} style={{ backgroundImage: `url(${w})` }}>
            <span>{hm(new Date())}</span>
          </button>
        ))}
      </div>
      <div className="sgrp">
        <Row c="#8e8e93" ic={g("M10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM9 1h2v3H9zM9 16h2v3H9zM1 9h3v2H1zM16 9h3v2h-3z")} t="General" v="" />
        <Row c="#0a84ff" ic={g("M10 3a7 7 0 1 0 7 7h-7z")} t="Display & Brightness" v="" />
        <Row c="#ff3b30" ic={g("M10 2a5 5 0 0 0-5 5v4l-2 3h14l-2-3V7a5 5 0 0 0-5-5zM8 16a2 2 0 0 0 4 0z")} t="Notifications" v="" />
        <Row c="#34c759" ic={g("M3 6h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM18 9h1v2h-1z")} t="Battery" v="87%" />
      </div>
      <div className="slabel">ABOUT</div>
      <div className="sgrp">
        <div className="srow"><span className="st">Model Name</span><span className="sv">iPhone 17 Pro</span></div>
        <div className="srow"><span className="st">iOS Version</span><span className="sv">26.1</span></div>
        <div className="srow"><span className="st">Capacity</span><span className="sv">256 GB</span></div>
      </div>
    </div>
  );
}

function Photos() {
  const all = [photo1, ...WALLS, photo1, ...WALLS, photo1, ...WALLS, photo1, ...WALLS];
  const [big, setBig] = useState<string | null>(null);
  return (
    <div className="app photos">
      <div className="ph-head"><h1>Library</h1><small>{all.length} Items</small></div>
      <div className="ph-grid">
        {all.map((p, i) => <button key={i} onClick={() => setBig(p)} style={{ backgroundImage: `url(${p})` }} />)}
      </div>
      {big && <div className="ph-big" onClick={() => setBig(null)}><img src={big} alt="" /></div>}
    </div>
  );
}

function Weather() {
  const hrs = ["Now", "1AM", "2AM", "3AM", "4AM", "5AM"];
  const days = [["Today", 18, 29], ["Fri", 19, 31], ["Sat", 20, 32], ["Sun", 17, 28], ["Mon", 16, 27]];
  return (
    <div className="app weather">
      <div className="w-top"><small>MY LOCATION</small><h2>Riyadh</h2><div className="w-t">24°</div><div>Clear</div><div>H:29°  L:18°</div></div>
      <div className="w-card"><small>Clear conditions will continue for the rest of the night.</small>
        <div className="w-hrs">{hrs.map((h, i) => <div key={h}><span>{h}</span><i className="moon" /><b>{24 - i}°</b></div>)}</div>
      </div>
      <div className="w-card"><small>5-DAY FORECAST</small>
        {days.map(([d, l, h]) => (
          <div className="w-day" key={d as string}><span>{d}</span><i className="sun" /><span className="lo">{l}°</span><span className="bar"><i style={{ left: `${((l as number) - 14) * 5}%`, right: `${(34 - (h as number)) * 5}%` }} /></span><span>{h}°</span></div>
        ))}
      </div>
    </div>
  );
}

function ClockApp() {
  const [ms, setMs] = useState(0);
  const [run, setRun] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const ref = useRef(0);
  useEffect(() => {
    if (!run) return;
    const start = performance.now() - ms;
    const loop = () => { setMs(performance.now() - start); ref.current = requestAnimationFrame(loop); };
    ref.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run]);
  const f = (t: number) => `${String(Math.floor(t / 60000)).padStart(2, "0")}:${String(Math.floor(t / 1000) % 60).padStart(2, "0")},${String(Math.floor(t / 10) % 100).padStart(2, "0")}`;
  return (
    <div className="app clock">
      <div className="sw">{f(ms)}</div>
      <div className="sw-b">
        <button className="cb gray" onClick={() => (run ? setLaps([ms, ...laps]) : (setMs(0), setLaps([])))}>{run ? "Lap" : "Reset"}</button>
        <button className={`cb ${run ? "red" : "green"}`} onClick={() => setRun(!run)}>{run ? "Stop" : "Start"}</button>
      </div>
      <div className="laps">{laps.map((l, i) => <div key={i}><span>Lap {laps.length - i}</span><span>{f(l)}</span></div>)}</div>
      <div className="tabbar">{["World Clock", "Alarms", "Stopwatch", "Timers"].map((t) => <span key={t} className={t === "Stopwatch" ? "on" : ""}>{t}</span>)}</div>
    </div>
  );
}

function Notes() {
  const [txt, setTxt] = useState("Ideas\n\n• Try the new iPhone 17 Pro\n• Swipe down from the top right for Control Center\n• Press the side button to lock");
  return (
    <div className="app notes light">
      <div className="nt-bar"><span>‹ Notes</span><span>Done</span></div>
      <textarea value={txt} onChange={(e) => setTxt(e.target.value)} />
    </div>
  );
}

function Music() {
  const [play, setPlay] = useState(false);
  return (
    <div className="app music">
      <div className="mu-art" style={{ backgroundImage: `url(${wOrange})` }} />
      <div className="mu-t"><b>Cosmic Orange</b><span>Liquid Glass</span></div>
      <div className="mu-prog"><i style={{ width: play ? "60%" : "35%" }} /></div>
      <div className="mu-c">
        <svg viewBox="0 0 40 24" width="44"><path d="M20 2v20L6 12zM36 2v20L22 12z" fill="#fff" /></svg>
        <button onClick={() => setPlay(!play)}>
          {play ? <svg viewBox="0 0 24 24" width="46"><rect x="5" y="3" width="5" height="18" rx="1" fill="#fff"/><rect x="14" y="3" width="5" height="18" rx="1" fill="#fff"/></svg>
            : <svg viewBox="0 0 24 24" width="46"><path d="M6 3l15 9-15 9z" fill="#fff" /></svg>}
        </button>
        <svg viewBox="0 0 40 24" width="44"><path d="M20 2v20l14-10zM4 2v20l14-10z" fill="#fff" /></svg>
      </div>
    </div>
  );
}

function CameraApp() {
  const [flash, setFlash] = useState(false);
  const [mode, setMode] = useState("PHOTO");
  return (
    <div className="app cam">
      <div className="cam-view" style={{ backgroundImage: `url(${photo1})` }}>{flash && <div className="cam-flash" />}</div>
      <div className="cam-zoom"><span>.5</span><span className="on">1×</span><span>2</span><span>8</span></div>
      <div className="cam-modes">{["CINEMATIC", "VIDEO", "PHOTO", "PORTRAIT", "PANO"].map((m) => <span key={m} onClick={() => setMode(m)} className={m === mode ? "on" : ""}>{m}</span>)}</div>
      <div className="cam-b">
        <span className="cam-th" style={{ backgroundImage: `url(${photo1})` }} />
        <button className={`shutter ${mode === "VIDEO" ? "vid" : ""}`} onClick={() => { setFlash(true); setTimeout(() => setFlash(false), 180); }}><i /></button>
        <span className="cam-flip" />
      </div>
    </div>
  );
}

function Generic({ id, now }: { id: AppId; now: Date }) {
  return (
    <div className="app light generic">
      <div className="gen-ic"><Icon id={id} now={now} /></div>
      <h2>{NAMES[id]}</h2>
      <p>Welcome to {NAMES[id]}</p>
    </div>
  );
}

/* ---------- main phone ---------- */
export default function IPhone() {
  const now = useNow();
  const [on, setOn] = useState(true);
  const [locked, setLocked] = useState(true);
  const [app, setApp] = useState<AppId | null>(null);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [cc, setCc] = useState(false);
  const [wall, setWall] = useState(0);
  const [vol, setVol] = useState(60);
  const [volShow, setVolShow] = useState(false);
  const [silent, setSilent] = useState(false);
  const [island, setIsland] = useState<"" | "silent" | "unlock">("");
  const [drag, setDrag] = useState(0);
  const [scale, setScale] = useState(1);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [toggles, setToggles] = useState({ wifi: true, bt: true, air: false, cell: true, flash: false, focus: false });
  const [bright, setBright] = useState(80);
  const start = useRef<{ y: number; x: number } | null>(null);
  const volT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 40) / 900, (window.innerWidth - 20) / 440));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  const flashIsland = (k: "silent" | "unlock") => { setIsland(k); setTimeout(() => setIsland(""), 1600); };
  const openApp = (id: AppId, e: React.MouseEvent) => {
    const r = screenRef.current!.getBoundingClientRect();
    const t = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setOrigin(`${((t.left + t.width / 2 - r.left) / r.width) * 100}% ${((t.top + t.height / 2 - r.top) / r.height) * 100}%`);
    setApp(id);
  };
  const goHome = () => {
    if (cc) return setCc(false);
    if (!app) return;
    setClosing(true);
    setTimeout(() => { setApp(null); setClosing(false); }, 380);
  };
  const power = () => {
    if (on) { setOn(false); setLocked(true); setApp(null); setCc(false); }
    else setOn(true);
  };
  const volume = (d: number) => {
    setVol((v) => Math.max(0, Math.min(100, v + d)));
    setVolShow(true);
    clearTimeout(volT.current);
    volT.current = setTimeout(() => setVolShow(false), 1400);
  };

  // gestures
  const down = (e: React.PointerEvent) => {
    const r = screenRef.current!.getBoundingClientRect();
    start.current = { y: (e.clientY - r.top) / scale, x: (e.clientX - r.left) / scale };
  };
  const move = (e: React.PointerEvent) => {
    if (!start.current) return;
    const r = screenRef.current!.getBoundingClientRect();
    const dy = (e.clientY - r.top) / scale - start.current.y;
    if (locked && start.current.y > 700) setDrag(Math.min(0, dy));
  };
  const up = (e: React.PointerEvent) => {
    if (!start.current || !on) { start.current = null; return; }
    const r = screenRef.current!.getBoundingClientRect();
    const y = (e.clientY - r.top) / scale, dy = y - start.current.y, sx = start.current.x, sy = start.current.y;
    if (locked && sy > 700 && dy < -120) { setLocked(false); flashIsland("unlock"); }
    else if (!locked && sy > 800 && dy < -50) goHome();
    else if (!locked && sy < 60 && sx > 250 && dy > 50) setCc(true);
    else if (cc && dy < -60) setCc(false);
    setDrag(0);
    start.current = null;
  };

  const onTilt = (e: React.MouseEvent) => {
    const x = e.clientX / window.innerWidth - 0.5, y = e.clientY / window.innerHeight - 0.5;
    setTilt({ x: -y * 6, y: x * 8 });
  };

  const renderApp = (id: AppId) => {
    switch (id) {
      case "calculator": return <Calculator />;
      case "settings": return <Settings wall={wall} setWall={setWall} />;
      case "photos": return <Photos />;
      case "weather": return <Weather />;
      case "clock": return <ClockApp />;
      case "notes": return <Notes />;
      case "music": return <Music />;
      case "camera": return <CameraApp />;
      default: return <Generic id={id} now={now} />;
    }
  };
  const lightApp = app && !["calculator", "photos", "weather", "clock", "music", "camera"].includes(app);

  return (
    <div className="stage" onMouseMove={onTilt} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
      <div className="stage-glow" />
      <div className="scene" style={{ transform: `scale(${scale}) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}>
        <div className="frame">
          {/* left: action button, volume */}
          <button className="hb l action" aria-label="Action button" onClick={() => { setSilent(!silent); flashIsland("silent"); }} />
          <button className="hb l vup" aria-label="Volume up" onClick={() => volume(10)} />
          <button className="hb l vdn" aria-label="Volume down" onClick={() => volume(-10)} />
          <button className="hb r side" aria-label="Side button" onClick={power} />
          <span className="hb r camctl" aria-hidden />
          <div className="bezel">
            <div ref={screenRef} className={`screen ${on ? "" : "off"}`} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={() => { start.current = null; setDrag(0); }}>
              <div className="wall" style={{ backgroundImage: `url(${WALLS[wall]})`, transform: locked ? "scale(1.12)" : app ? "scale(1.25)" : "scale(1.03)", filter: locked ? "none" : app ? "blur(10px)" : "none" }} />

              {/* home */}
              <div className={`home ${locked ? "hidden" : ""} ${app && !closing ? "behind" : ""}`}>
                <div className="widgets">
                  <div className="wid wid-w" onClick={(e) => openApp("weather", e)}>
                    <b>Riyadh</b><div className="wt">24°</div><i className="moon" /><small>Clear<br />H:29° L:18°</small>
                  </div>
                  <div className="wid wid-c" onClick={(e) => openApp("calendar", e)}>
                    <small>{DOWL[now.getDay()].toUpperCase()}</small><div className="cd">{now.getDate()}</div><span className="ev">No events today</span>
                  </div>
                  <div className="wl"><span>Weather</span><span>Calendar</span></div>
                </div>
                <div className="grid">
                  {GRID.map((id) => (
                    <button key={id} className="appb" onClick={(e) => openApp(id, e)}>
                      <span className="ic"><Icon id={id} now={now} /></span><span className="lb">{NAMES[id]}</span>
                    </button>
                  ))}
                </div>
                <div className="dots"><i className="on" /><i /></div>
                <div className="dock">
                  {DOCK.map((id) => (
                    <button key={id} className="appb" onClick={(e) => openApp(id, e)}>
                      <span className="ic"><Icon id={id} now={now} /></span>
                    </button>
                  ))}
                </div>
              </div>

              {/* lock */}
              <div className={`lock ${locked ? "" : "gone"}`} style={drag ? { transform: `translateY(${drag}px)`, transition: "none", opacity: 1 + drag / 500 } : undefined}>
                <div className="lk-ic"><svg width="14" height="18" viewBox="0 0 14 18"><path d="M3 8V5a4 4 0 0 1 8 0v3" stroke="#fff" strokeWidth="2" fill="none"/><rect x="0" y="8" width="14" height="10" rx="2.5" fill="#fff"/></svg></div>
                <div className="lk-date">{DOWL[now.getDay()]}, {MON[now.getMonth()]} {now.getDate()}</div>
                <div className="lk-time">{hm(now)}</div>
                <div className="lk-wid">
                  <div className="ring"><svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,.3)" strokeWidth="4" fill="none"/><circle cx="18" cy="18" r="15" stroke="#fff" strokeWidth="4" fill="none" strokeDasharray="82 100" strokeLinecap="round" transform="rotate(-90 18 18)"/></svg><b>87</b></div>
                  <div className="ring"><b className="big">24°</b><small>18 29</small></div>
                  <div className="ring wide"><small>Riyadh</small><b>Clear</b></div>
                </div>
                <div className="lk-notif">
                  <span className="ic sm">{icons["messages"]}</span>
                  <div><b>Messages</b><span>Welcome to your new iPhone 17 Pro</span></div><small>now</small>
                </div>
                <div className="lk-bot">
                  <button className="qb" onClick={(e) => { e.stopPropagation(); setToggles((t) => ({ ...t, flash: !t.flash })); }} data-on={toggles.flash}>
                    <svg width="16" height="22" viewBox="0 0 16 22"><path d="M2 1h12v4l-3 4v12H5V9L2 5z" fill="currentColor"/></svg>
                  </button>
                  <button className="qb"><svg width="22" height="18" viewBox="0 0 22 18"><path d="M2 4h4l2-3h6l2 3h4v13H2z" fill="currentColor"/><circle cx="11" cy="10" r="4" fill="#333"/></svg></button>
                </div>
                <div className="lk-hint">Swipe up to open</div>
              </div>

              {/* app */}
              {app && (
                <div className={`appwin ${closing ? "closing" : ""}`} style={{ transformOrigin: origin }}>
                  <StatusBar now={now} dark={!!lightApp} />
                  {renderApp(app)}
                </div>
              )}

              {/* control center */}
              <div className={`cc ${cc ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && setCc(false)}>
                <div className="cc-grid">
                  <div className="cc-box conn">
                    {([["air", "M2 11l16-7-6 14-2-6z", "#ff9f0a"], ["cell", "M4 13h3v4H4zM9 9h3v8H9zM14 4h3v13h-3z", "#34c759"], ["wifi", "M10 15l-2-2a3 3 0 0 1 4 0zM5 10a7 7 0 0 1 10 0l-1.5 1.5a5 5 0 0 0-7 0zM2 7a11 11 0 0 1 16 0l-1.5 1.5a9 9 0 0 0-13 0z", "#0a84ff"], ["bt", "M9 2l6 5-4 3 4 3-6 5V11L5 14l-1-1 4-3-4-3 1-1 4 3z", "#0a84ff"]] as const).map(([k, p, c]) => (
                      <button key={k} className="cc-t" style={{ background: toggles[k] ? c : undefined }} onClick={() => setToggles((t) => ({ ...t, [k]: !t[k] }))}>
                        <svg viewBox="0 0 20 20" width="22"><path d={p} fill="#fff" /></svg>
                      </button>
                    ))}
                  </div>
                  <div className="cc-box media"><div className="mart" style={{ backgroundImage: `url(${wOrange})` }} /><b>Cosmic Orange</b><small>Not Playing</small></div>
                  <button className={`cc-box sq ${toggles.focus ? "on" : ""}`} onClick={() => setToggles((t) => ({ ...t, focus: !t.focus }))}>
                    <svg viewBox="0 0 20 20" width="22"><path d="M14 2a8 8 0 1 0 4 12A7 7 0 0 1 14 2z" fill={toggles.focus ? "#5e5ce6" : "#fff"} /></svg><span>Focus</span>
                  </button>
                  <div className="cc-box slider"><input type="range" min={10} max={100} value={bright} onChange={(e) => setBright(+e.target.value)} /></div>
                  <div className="cc-box slider"><input type="range" min={0} max={100} value={vol} onChange={(e) => setVol(+e.target.value)} /></div>
                  <button className={`cc-box circ ${toggles.flash ? "on" : ""}`} onClick={() => setToggles((t) => ({ ...t, flash: !t.flash }))}>
                    <svg viewBox="0 0 16 22" width="14"><path d="M2 1h12v4l-3 4v12H5V9L2 5z" fill="currentColor" /></svg>
                  </button>
                  <button className="cc-box circ" onClick={(e) => { setCc(false); openApp("clock", e); }}>{icons["clock"]}</button>
                  <button className="cc-box circ" onClick={(e) => { setCc(false); openApp("calculator", e); }}>{icons["calculator"]}</button>
                  <button className="cc-box circ" onClick={(e) => { setCc(false); openApp("camera", e); }}>{icons["camera"]}</button>
                </div>
              </div>

              {/* dynamic island */}
              <div className={`island ${island} ${volShow ? "vol" : ""}`}>
                {island === "silent" && <span className="isl-c"><span className={`bell ${silent ? "muted" : ""}`} />{silent ? "Silent Mode" : "Ring"}</span>}
                {island === "unlock" && <span className="isl-c"><svg width="12" height="16" viewBox="0 0 14 18"><path d="M3 8V5a4 4 0 0 1 8 0" stroke="#fff" strokeWidth="2" fill="none"/><rect x="0" y="8" width="14" height="10" rx="2.5" fill="#fff"/></svg></span>}
                {volShow && !island && <span className="isl-v"><svg width="16" height="14" viewBox="0 0 16 14"><path d="M1 4h3l4-3v12L4 10H1z" fill="#fff"/></svg><span className="vbar"><i style={{ width: `${vol}%` }} /></span></span>}
              </div>

              {!locked && <div className={`homebar ${lightApp ? "dark" : ""}`} onClick={goHome} />}
              {locked && <div className="homebar" />}
              {!on && <div className="blackout" onClick={() => setOn(true)} />}
              <div className="dim" style={{ opacity: (100 - bright) / 140 }} />
            </div>
          </div>
        </div>
        <div className="floor-shadow" />
      </div>
      <p className="hint">Side button: lock · Swipe up: unlock / home · Swipe down top-right: Control Center</p>
    </div>
  );
}
