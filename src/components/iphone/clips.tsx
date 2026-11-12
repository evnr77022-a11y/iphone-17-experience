import { useRef, useState } from "react";

const B = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const FEED = [
  { u: "ForBiggerBlazes.mp4", n: "fire.clips", c: "When the campfire hits different #outdoors", col: "#fe2c55", l: 12400 },
  { u: "ForBiggerEscapes.mp4", n: "travelmode", c: "Weekend escape plans #travel #fyp", col: "#25f4ee", l: 8900 },
  { u: "ForBiggerFun.mp4", n: "funzone", c: "This is pure fun #comedy", col: "#ff9500", l: 33100 },
  { u: "ForBiggerJoyrides.mp4", n: "joyride", c: "Joyride season is here #cars", col: "#34c759", l: 5400 },
  { u: "ForBiggerMeltdowns.mp4", n: "meltdown.tv", c: "Me on Monday mornings #relatable", col: "#af52de", l: 71200 },
];
const fmt = (n: number) => Intl.NumberFormat("en", { notation: "compact" }).format(n);
const Heart = ({ on }: { on: boolean }) => <svg viewBox="0 0 24 24" width="36"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill={on ? "#fe2c55" : "#fff"} /></svg>;

function Clip({ v, liked, toggle }: { v: (typeof FEED)[number]; liked: boolean; toggle: () => void }) {
  const r = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [follow, setFollow] = useState(false);
  return (
    <div className="tk-v">
      <video ref={r} src={B + v.u} loop playsInline muted autoPlay preload="metadata"
        onClick={() => { const e = r.current!; e.muted = false; if (e.paused) { e.play(); setPaused(false); } else { e.pause(); setPaused(true); } }}
        onDoubleClick={() => !liked && toggle()} />
      {paused && <div className="tk-pause"><svg viewBox="0 0 24 24" width="70"><path d="M8 5l12 7-12 7z" fill="#fff9" /></svg></div>}
      <div className="tk-side">
        <button onClick={() => setFollow(!follow)}><span className="tk-av" style={{ background: v.col }}>{v.n[0]!.toUpperCase()}</span>{follow ? "Following" : "+ Follow"}</button>
        <button onClick={toggle}><Heart on={liked} />{fmt(v.l + (liked ? 1 : 0))}</button>
        <button><svg viewBox="0 0 24 24" width="34"><path d="M12 3C6.5 3 2 6.8 2 11.5c0 2.5 1.3 4.8 3.4 6.3L4.5 21l4-1.8c1.1.3 2.3.5 3.5.5 5.5 0 10-3.8 10-8.5S17.5 3 12 3z" fill="#fff" /></svg>{fmt(v.l / 30)}</button>
        <button onClick={() => navigator.clipboard?.writeText(B + v.u)}><svg viewBox="0 0 24 24" width="32"><path d="M14 4l8 8-8 8v-5c-6 0-9 2-12 6 1-7 5-11 12-12z" fill="#fff" /></svg>Share</button>
      </div>
      <div className="tk-cap"><b>@{v.n}</b>{v.c}</div>
    </div>
  );
}

export function Clips() {
  const [likes, setLikes] = useState<Record<number, boolean>>({});
  const [top, setTop] = useState("For You");
  const [tab, setTab] = useState("Home");
  const list = top === "Following" ? FEED.slice(2) : FEED;
  return (
    <div className="app tk">
      <div className="tk-top">{["Following", "For You"].map((t) => <button key={t} className={t === top ? "on" : ""} onClick={() => setTop(t)}>{t}</button>)}</div>
      <div className="tk-feed" key={top}>
        {list.map((v) => { const i = FEED.indexOf(v); return <Clip key={v.u} v={v} liked={!!likes[i]} toggle={() => setLikes({ ...likes, [i]: !likes[i] })} />; })}
      </div>
      <div className="tk-bar">{["Home", "Friends", "+", "Inbox", "Profile"].map((t) => <button key={t} onClick={() => setTab(t)} className={`${t === tab ? "on" : ""} ${t === "+" ? "tk-plus" : ""}`}>{t}</button>)}</div>
    </div>
  );
}
