import { useState, type ReactNode } from "react";

export type Toggles = { wifi: boolean; bt: boolean; air: boolean; cell: boolean; flash: boolean; focus: boolean };
type P = {
  wall: number; setWall: (n: number) => void; walls: string[];
  toggles: Toggles; setToggles: (f: (t: Toggles) => Toggles) => void;
  bright: number; setBright: (n: number) => void;
  vol: number; setVol: (n: number) => void;
  silent: boolean; setSilent: (b: boolean) => void;
  time: string;
};
const g = (p: string) => <svg viewBox="0 0 20 20" width="17" height="17"><path d={p} fill="#fff" /></svg>;
const IC = {
  air: g("M2 11l16-7-6 14-2-6z"),
  wifi: g("M10 15l-2-2a3 3 0 0 1 4 0zM5 10a7 7 0 0 1 10 0l-1.5 1.5a5 5 0 0 0-7 0zM2 7a11 11 0 0 1 16 0l-1.5 1.5a9 9 0 0 0-13 0z"),
  bt: g("M9 2l6 5-4 3 4 3-6 5V11L5 14l-1-1 4-3-4-3 1-1 4 3z"),
  cell: g("M4 13h3v4H4zM9 9h3v8H9zM14 4h3v13h-3z"),
  gen: g("M10 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM9 1h2v3H9zM9 16h2v3H9zM1 9h3v2H1zM16 9h3v2h-3z"),
  disp: g("M10 3a7 7 0 1 0 7 7h-7z"),
  notif: g("M10 2a5 5 0 0 0-5 5v4l-2 3h14l-2-3V7a5 5 0 0 0-5-5zM8 16a2 2 0 0 0 4 0z"),
  snd: g("M3 7h3l5-4v14l-5-4H3zM14 6a5 5 0 0 1 0 8"),
  focus: g("M14 2a8 8 0 1 0 4 12A7 7 0 0 1 14 2z"),
  batt: g("M3 6h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM18 9h1v2h-1z"),
  wall: g("M3 4h14v12H3zM5 14l4-5 3 3 2-2 3 4z"),
  priv: g("M10 2l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V5z"),
  face: g("M3 7V4h3M14 4h3v3M17 13v3h-3M6 16H3v-3M7 8v2M13 8v2M10 8v4H9M7 13c2 1.5 4 1.5 6 0"),
};

export function Settings(p: P & { hasCode?: boolean; openPasscode?: () => void }) {
  const [stack, setStack] = useState<string[]>(["root"]);
  const page = stack[stack.length - 1]!;
  const push = (s: string) => setStack([...stack, s]);
  const back = () => setStack(stack.slice(0, -1));
  const T = p.toggles;
  const tg = (k: keyof Toggles) => [T[k], (b: boolean) => p.setToggles((t) => ({ ...t, [k]: b }))] as [boolean, (b: boolean) => void];

  const Row = ({ c, ic, t, v, tog, to }: { c?: string; ic?: ReactNode; t: string; v?: string | undefined; tog?: [boolean, (b: boolean) => void]; to?: string }) => (
    <div className={`srow ${to ? "tap" : ""}`} onClick={to ? () => push(to) : undefined}>
      {c && <span className="sic" style={{ background: c }}>{ic}</span>}
      <span className="st">{t}</span>
      {tog ? <button className={`tog ${tog[0] ? "on" : ""}`} onClick={(e) => { e.stopPropagation(); tog[1](!tog[0]); }}><i /></button>
        : <span className="sv">{v}{to && <b>›</b>}</span>}
    </div>
  );
  const Title = ({ t }: { t: string }) => (
    <>
      <div className="nav"><button onClick={back}>‹ {stack.length > 2 ? "Back" : "Settings"}</button><b>{t}</b><span /></div>
    </>
  );
  const Slider = ({ v, set, min = 0 }: { v: number; set: (n: number) => void; min?: number }) => (
    <div className="srow"><span className="sv">☀︎</span><input className="ios-range" type="range" min={min} max={100} value={v} onChange={(e) => set(+e.target.value)} style={{ ["--v" as string]: `${((v - min) / (100 - min)) * 100}%` }} /><span className="sv">☀</span></div>
  );

  let body: ReactNode;
  switch (page) {
    case "wifi": body = (<>
      <Title t="Wi-Fi" />
      <div className="sgrp"><Row t="Wi-Fi" tog={tg("wifi")} />{T.wifi && <div className="srow"><span className="st chk-blue">✓ Home_5G</span><span className="sv">🔒 ⓘ</span></div>}</div>
      {T.wifi && <><div className="slabel">OTHER NETWORKS</div><div className="sgrp">{["STC_Fiber", "Mobily-4G", "Zain_Home", "Starbucks WiFi"].map((n) => <Row key={n} t={n} v="🔒" />)}</div></>}
    </>); break;
    case "bt": body = (<>
      <Title t="Bluetooth" />
      <div className="sgrp"><Row t="Bluetooth" tog={tg("bt")} /></div>
      {T.bt && <><div className="slabel">MY DEVICES</div><div className="sgrp">{[["AirPods Pro", "Connected"], ["Apple Watch", "Connected"], ["MacBook Pro", "Not Connected"]].map(([a, b]) => <Row key={a} t={a!} v={b} />)}</div></>}
    </>); break;
    case "cell": body = (<>
      <Title t="Cellular" />
      <div className="sgrp"><Row t="Cellular Data" tog={tg("cell")} /><Row t="Carrier" v="STC" /><Row t="Voice & Data" v="5G Auto" /></div>
      <div className="slabel">CELLULAR DATA</div><div className="sgrp"><Row t="Current Period" v="24.6 GB" /><Row t="YouTube" v="8.1 GB" /><Row t="Safari" v="3.2 GB" /></div>
    </>); break;
    case "sounds": body = (<>
      <Title t="Sounds & Haptics" />
      <div className="sgrp"><Row t="Silent Mode" tog={[p.silent, p.setSilent]} /></div>
      <div className="slabel">RINGTONE AND ALERT VOLUME</div>
      <div className="sgrp"><Slider v={p.vol} set={p.setVol} /></div>
      <div className="sgrp"><Row t="Ringtone" v="Reflection" /><Row t="Text Tone" v="Note" /><Row t="Keyboard Feedback" v="Sound" /></div>
    </>); break;
    case "display": body = (<>
      <Title t="Display & Brightness" />
      <div className="slabel">BRIGHTNESS</div>
      <div className="sgrp"><Slider v={p.bright} set={p.setBright} min={10} /><Row t="True Tone" tog={[true, () => {}]} /></div>
      <div className="sgrp"><Row t="Always On Display" v="On" /><Row t="Auto-Lock" v="30 seconds" /><Row t="Text Size" v="" /></div>
    </>); break;
    case "wallpaper": body = (<>
      <Title t="Wallpaper" />
      <div className="sgrp walls">
        {p.walls.map((w, i) => (
          <button key={i} className={`wp ${p.wall === i ? "on" : ""}`} onClick={() => p.setWall(i)} style={{ backgroundImage: `url(${w})` }}><span>{p.time}</span></button>
        ))}
      </div>
      <div className="slabel" style={{ textAlign: "center" }}>Tap a wallpaper to set it</div>
    </>); break;
    case "general": body = (<>
      <Title t="General" />
      <div className="sgrp"><Row t="About" to="about" /><Row t="Software Update" to="update" /></div>
      <div className="sgrp"><Row t="iPhone Storage" to="storage" /><Row t="Background App Refresh" v="" /></div>
      <div className="sgrp"><Row t="Date & Time" v="" /><Row t="Keyboard" v="" /><Row t="Language & Region" v="" /></div>
    </>); break;
    case "about": body = (<>
      <Title t="About" />
      <div className="sgrp">{[["Name", "Abdullah's iPhone"], ["iOS Version", "26.1"], ["Model Name", "iPhone 17 Pro"], ["Model Number", "MG8H4"], ["Serial Number", "F2LZK9QJ7X"]].map(([a, b]) => <Row key={a} t={a!} v={b} />)}</div>
      <div className="sgrp">{[["Songs", "128"], ["Videos", "42"], ["Photos", "3,281"], ["Capacity", "256 GB"], ["Available", "171.4 GB"]].map(([a, b]) => <Row key={a} t={a!} v={b} />)}</div>
    </>); break;
    case "update": body = (<>
      <Title t="Software Update" />
      <div className="upd"><div className="upd-ic">26</div><b>iOS 26.1</b><span>iOS is up to date</span></div>
    </>); break;
    case "storage": body = (<>
      <Title t="iPhone Storage" />
      <div className="sgrp stor"><div><b>iPhone</b><span>84.6 GB of 256 GB Used</span></div>
        <div className="stbar"><i style={{ width: "14%", background: "#ff3b30" }} /><i style={{ width: "10%", background: "#ff9500" }} /><i style={{ width: "8%", background: "#ffcc00" }} /><i style={{ width: "4%", background: "#8e8e93" }} /></div>
        <small>■ Apps  ■ Photos  ■ Media  ■ iOS</small></div>
    </>); break;
    case "battery": body = (<>
      <Title t="Battery" />
      <div className="sgrp"><Row t="Battery Percentage" tog={[true, () => {}]} /><Row t="Low Power Mode" tog={[false, () => {}]} /></div>
      <div className="sgrp"><Row t="Battery Health" v="100%" /><Row t="Last Charged" v="87%" /></div>
    </>); break;
    case "notif": body = (<>
      <Title t="Notifications" />
      <div className="sgrp"><Row t="Show Previews" v="Always" /><Row t="Screen Sharing" v="Off" /></div>
      <div className="slabel">NOTIFICATION STYLE</div>
      <div className="sgrp">{["Messages", "Safari", "YouTube", "Wallet", "Calendar"].map((a) => <Row key={a} t={a} v="Banners" />)}</div>
    </>); break;
    default: body = (<>
      <h1>Settings</h1>
      <div className="srch">Search</div>
      <div className="sgrp prof tap" onClick={() => push("about")}>
        <span className="av">AK</span>
        <div><b>Abdullah</b><small>Apple Account, iCloud+, and more</small></div><b className="chev">›</b>
      </div>
      <div className="sgrp">
        <Row c="#ff9500" ic={IC.air} t="Airplane Mode" tog={tg("air")} />
        <Row c="#0a84ff" ic={IC.wifi} t="Wi-Fi" v={T.air || !T.wifi ? "Off" : "Home_5G"} to="wifi" />
        <Row c="#0a84ff" ic={IC.bt} t="Bluetooth" v={T.bt ? "On" : "Off"} to="bt" />
        <Row c="#34c759" ic={IC.cell} t="Cellular" v="" to="cell" />
      </div>
      <div className="sgrp">
        <Row c="#ff3b30" ic={IC.notif} t="Notifications" to="notif" />
        <Row c="#ff2d55" ic={IC.snd} t="Sounds & Haptics" to="sounds" />
        <Row c="#5e5ce6" ic={IC.focus} t="Focus" tog={tg("focus")} />
      </div>
      <div className="sgrp">
        <button className="srow" onClick={p.openPasscode}><span className="sic" style={{ background: "#34c759" }}><svg viewBox="0 0 20 20" width="16"><rect x="3" y="8" width="14" height="10" rx="2.5" fill="#fff"/><path d="M6 8V6a4 4 0 0 1 8 0v2" stroke="#fff" strokeWidth="2" fill="none"/></svg></span><span className="st">{p.hasCode ? "Turn Passcode Off" : "Turn Passcode On"}</span><span className="sv">{p.hasCode ? "On" : "Off"} ›</span></button>
        <Row c="#8e8e93" ic={IC.gen} t="General" to="general" />
        <Row c="#0a84ff" ic={IC.disp} t="Display & Brightness" to="display" />
        <Row c="#30b0c7" ic={IC.wall} t="Wallpaper" to="wallpaper" />
        <Row c="#34c759" ic={IC.face} t="Face ID & Passcode" v="" />
        <Row c="#34c759" ic={IC.batt} t="Battery" to="battery" />
        <Row c="#0a84ff" ic={IC.priv} t="Privacy & Security" v="" />
      </div>
    </>);
  }
  return <div className="app light set" key={page}><div className="pg">{body}</div></div>;
}
