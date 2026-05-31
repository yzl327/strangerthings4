import { useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import {
  Activity,
  Antenna,
  AudioLines,
  ChevronDown,
  Clock3,
  Eye,
  FileLock2,
  LockKeyhole,
  MapPin,
  Network,
  Power,
  Radio,
  Search,
  ShieldAlert,
  Siren,
  Sparkles,
  Terminal,
  UnlockKeyhole,
  X,
} from "lucide-react";
import { characters, locations, timeline, type Character, type WorldMode } from "./data";

const groupLabels: Record<Character["group"], string> = {
  party: "Hawkins Party",
  lab: "Laboratory",
  entity: "Entities",
};

export default function App() {
  const [mode, setMode] = useState<WorldMode>("normal");
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [caseOpen, setCaseOpen] = useState(false);
  const [group, setGroup] = useState<Character["group"] | "all">("all");
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [terminalValue, setTerminalValue] = useState("");
  const [terminalMessage, setTerminalMessage] = useState("Awaiting command: type HELP for active protocols.");
  const [terminalHistory, setTerminalHistory] = useState<string[]>(["BOOT: Hawkins archive handshake complete."]);
  const [unlockedFiles, setUnlockedFiles] = useState<string[]>([]);
  const [broadcast, setBroadcast] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    hum: OscillatorNode;
    tremolo: OscillatorNode;
    tremoloGain: GainNode;
    staticGain: GainNode;
    master: GainNode;
    noiseSource: AudioBufferSourceNode;
  } | null>(null);

  const visibleCharacters = useMemo(() => {
    if (group === "all") {
      return characters;
    }
    return characters.filter((character) => character.group === group);
  }, [group]);

  const isUpside = mode === "upside";
  const hasUnlocked = (file: string) => unlockedFiles.includes(file);
  const selectedCharacterRelations = selectedCharacter.relations;
  const selectedLocationImage = isUpside ? selectedLocation.image.upside : selectedLocation.image.normal;

  function createBroadcastAudio() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContextConstructor();
    const master = context.createGain();
    master.gain.value = 0.0001;
    master.connect(context.destination);

    const hum = context.createOscillator();
    hum.type = "sawtooth";
    hum.frequency.value = 62;

    const humFilter = context.createBiquadFilter();
    humFilter.type = "lowpass";
    humFilter.frequency.value = 240;

    const humGain = context.createGain();
    humGain.gain.value = 0.09;

    const tremolo = context.createOscillator();
    tremolo.type = "sine";
    tremolo.frequency.value = 6.5;

    const tremoloGain = context.createGain();
    tremoloGain.gain.value = 0.018;

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let index = 0; index < output.length; index += 1) {
      output[index] = (Math.random() * 2 - 1) * 0.55;
    }

    const noiseSource = context.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const staticFilter = context.createBiquadFilter();
    staticFilter.type = "bandpass";
    staticFilter.frequency.value = 1250;
    staticFilter.Q.value = 0.85;

    const staticGain = context.createGain();
    staticGain.gain.value = 0.026;

    hum.connect(humFilter);
    humFilter.connect(humGain);
    humGain.connect(master);
    tremolo.connect(tremoloGain);
    tremoloGain.connect(master.gain);
    noiseSource.connect(staticFilter);
    staticFilter.connect(staticGain);
    staticGain.connect(master);

    hum.start();
    tremolo.start();
    noiseSource.start();

    audioRef.current = { context, hum, tremolo, tremoloGain, staticGain, master, noiseSource };
    return audioRef.current;
  }

  async function toggleBroadcast() {
    const audio = audioRef.current ?? createBroadcastAudio();
    if (audio.context.state === "suspended") {
      await audio.context.resume();
    }

    const nextBroadcast = !broadcast;
    const now = audio.context.currentTime;
    audio.master.gain.cancelScheduledValues(now);
    audio.master.gain.setValueAtTime(audio.master.gain.value, now);
    audio.master.gain.exponentialRampToValueAtTime(nextBroadcast ? 0.72 : 0.0001, now + 0.45);
    audio.hum.frequency.setTargetAtTime(isUpside && nextBroadcast ? 49 : 62, now, 0.08);
    audio.staticGain.gain.setTargetAtTime(isUpside && nextBroadcast ? 0.042 : 0.026, now, 0.08);
    setBroadcast(nextBroadcast);
  }

  function unlock(file: string) {
    setUnlockedFiles((files) => (files.includes(file) ? files : [...files, file]));
  }

  function chooseLocation(locationId: string, openCase = true) {
    const location = locations.find((item) => item.id === locationId);
    if (!location) {
      return;
    }
    setSelectedLocation(location);
    setCaseOpen(openCase);
  }

  function chooseCharacter(characterId: string) {
    const character = characters.find((item) => item.id === characterId);
    if (!character) {
      return;
    }
    setSelectedCharacter(character);
    setGroup("all");
  }

  function chooseCharacterByName(name: string) {
    const character = characters.find((item) => item.name === name);
    if (character) {
      setSelectedCharacter(character);
      setGroup("all");
    }
  }

  function submitTerminal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const command = terminalValue.trim().toUpperCase();
    if (!command) {
      return;
    }
    let reply = "ACCESS DENIED: Unknown command. Type HELP for valid protocols.";

    if (command === "HELP") {
      reply = "COMMANDS: SCAN HAWKINS / OPEN 011 / TRACE VECNA / OPEN GATE / NORMALIZE / UPSIDE DOWN.";
    } else if (command === "SCAN HAWKINS" || command === "HAWKINS") {
      unlock("map");
      setBroadcast(true);
      reply = "SCAN COMPLETE: six hotspots active. Case popups upgraded with evidence trails.";
    } else if (command === "OPEN 011" || command === "011") {
      unlock("011");
      chooseCharacter("eleven");
      reply = "ACCESS GRANTED: Subject 011 expanded. Relationship board recalibrated.";
    } else if (command === "TRACE VECNA" || command === "VECNA") {
      unlock("vecna");
      chooseCharacter("vecna");
      chooseLocation("creel");
      setMode("upside");
      reply = "RED ALERT: Vecna trace resolves to Creel House. Clock signal detected.";
    } else if (command === "OPEN GATE" || command === "GATE") {
      unlock("gate");
      chooseLocation("gate");
      setMode("upside");
      reply = "RIFT STATUS: Open. Hidden gate telemetry is now visible.";
    } else if (command === "NORMALIZE") {
      setMode("normal");
      reply = "SIGNAL NORMALIZED: Upside Down overlay suppressed, but contamination remains.";
    } else if (command === "UPSIDE DOWN") {
      setMode("upside");
      reply = "DIMENSIONAL LAYER ENABLED: hidden records are bleeding through.";
    }

    setTerminalMessage(reply);
    setTerminalHistory((history) => [`> ${command}`, reply, ...history].slice(0, 8));
    setTerminalValue("");
  }

  return (
    <main className={`app ${isUpside ? "is-upside" : ""}`}>
      <div className="noise" />
      <div className="scanlines" />
      <div className="spores" aria-hidden="true">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>

      <header className="topbar">
        <a className="brand" href="#home" aria-label="Stranger Things archive home">
          <Siren size={18} />
          <span>HNL Archive</span>
        </a>
        <nav aria-label="主导航">
          <a href="#map">地图</a>
          <a href="#files">档案</a>
          <a href="#timeline">时间线</a>
          <a href="#terminal">终端</a>
        </nav>
        <button className="mode-switch" onClick={() => setMode(isUpside ? "normal" : "upside")}>
          <Power size={16} />
          <span>{isUpside ? "UPSIDE DOWN" : "NORMAL"}</span>
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">
            <Antenna size={16} />
            Hawkins National Laboratory / Restricted signal
          </p>
          <h1 className="series-logo" data-text="STRANGER THINGS">
            <span>STRANGER</span>
            <span>THINGS</span>
          </h1>
          <p className="hero-copy">
            The gate is open. Enter the archive, trace the signal, and watch the
            Upside Down bleed through the interface.
          </p>
          <div className="hero-actions">
            <a className="primary-action glitch-button" href="#map">
              <MapPin size={18} />
              进入霍金斯
            </a>
            <a className="secondary-action glitch-button" href="#files">
              <FileLock2 size={18} />
              查看绝密档案
            </a>
            <button className="secondary-action glitch-button" onClick={toggleBroadcast}>
              <Radio size={18} />
              {broadcast ? "关闭广播" : "开启广播"}
            </button>
          </div>
        </div>
        <aside className={`signal-panel ${broadcast ? "is-live" : ""}`} aria-label="广播状态">
          <div>
            <span>CHANNEL</span>
            <strong>WSQK 94.5</strong>
          </div>
          <AudioLines size={34} />
          <p>{broadcast ? "LIVE: low frequency hum + radio static" : "Muted until operator input"}</p>
        </aside>
      </section>

      <section className="section intro-grid" aria-label="系统状态">
        <div className="status-line">
          <Activity size={20} />
          <span>Power irregularities across Hawkins: {isUpside ? "escalating" : "contained"}</span>
        </div>
        <div className="status-line danger">
          <ShieldAlert size={20} />
          <span>Clearance level: Red / Do not trust stable footage</span>
        </div>
        <div className="status-line">
          <Eye size={20} />
          <span>Hidden records become visible in Upside Down mode</span>
        </div>
      </section>

      <section
        className="section map-section"
        id="map"
        style={{ "--location-bg": `url(${selectedLocationImage})` } as CSSProperties}
      >
        <div className="section-heading">
          <p>Interactive town grid</p>
          <h2>Hawkins Incident Map</h2>
        </div>
        <div className="map-layout">
          <div className="map-board" aria-label="霍金斯地图">
            <div className="map-roads" />
            {locations.map((location) => (
              <button
                key={location.id}
                className={`map-point ${selectedLocation.id === location.id ? "is-selected" : ""}`}
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
                onClick={() => {
                  setSelectedLocation(location);
                  setCaseOpen(true);
                }}
                aria-label={`查看 ${location.name}`}
              >
                <span />
              </button>
            ))}
            <button className="hidden-hotspot" onClick={() => chooseLocation("gate")} aria-label="打开隐藏裂缝案件">
              <LockKeyhole size={15} />
              {hasUnlocked("gate") || isUpside ? "Rift echo" : "Locked echo"}
            </button>
          </div>
          <article className="dossier location-dossier">
            <p className="file-label">LOCATION FILE</p>
            <img className="location-image" src={selectedLocationImage} alt={`${selectedLocation.name} ${isUpside ? "Upside Down" : "normal world"}`} />
            <h3>{selectedLocation.name}</h3>
            <dl>
              <div>
                <dt>Type</dt>
                <dd>{selectedLocation.type}</dd>
              </div>
              <div>
                <dt>Danger</dt>
                <dd>{selectedLocation.danger}</dd>
              </div>
            </dl>
            <p>{selectedLocation.summary}</p>
            <p className="hidden-record">{isUpside ? selectedLocation.hidden : "Hidden note redacted. Switch to UPSIDE DOWN."}</p>
            <button className="case-link glitch-button" onClick={() => setCaseOpen(true)}>
              <Search size={17} />
              打开案件弹层
            </button>
          </article>
        </div>
      </section>

      <section className="section files-section" id="files">
        <div className="section-heading">
          <p>Classified personnel database</p>
          <h2>Subject Files</h2>
        </div>
        <div className="filter-row" aria-label="角色分类">
          {(["all", "party", "lab", "entity"] as const).map((filter) => (
            <button
              key={filter}
              className={group === filter ? "is-active" : ""}
              onClick={() => setGroup(filter)}
            >
              {filter === "all" ? "All" : groupLabels[filter]}
            </button>
          ))}
        </div>
        <div className="files-layout">
          <div className="character-grid">
            {visibleCharacters.map((character) => (
              <button
                key={character.id}
                className={`character-card ${selectedCharacter.id === character.id ? "is-selected" : ""}`}
                onClick={() => setSelectedCharacter(character)}
              >
                <span className="avatar">{character.code.slice(0, 2)}</span>
                <span>
                  <strong>{character.name}</strong>
                  <small>{groupLabels[character.group]}</small>
                </span>
              </button>
            ))}
          </div>
          <article className="dossier character-dossier">
            <p className="file-label">SUBJECT / {selectedCharacter.code}</p>
            <h3>{selectedCharacter.name}</h3>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>{selectedCharacter.status}</dd>
              </div>
              <div>
                <dt>Ability</dt>
                <dd>{selectedCharacter.ability}</dd>
              </div>
            </dl>
            <p>{selectedCharacter.event}</p>
            <blockquote>{selectedCharacter.quote}</blockquote>
            <p className="hidden-record">
              {isUpside || hasUnlocked(selectedCharacter.code)
                ? selectedCharacter.hidden
                : "Supplementary file locked behind dimensional interference."}
            </p>
          </article>
        </div>
        <article className="relationship-board" aria-label="角色关系调查板">
          <div className="board-header">
            <p>
              <Network size={17} />
              Investigation Board
            </p>
            <strong>{selectedCharacter.name}</strong>
          </div>
          <div className="relation-web">
            <div className="center-node">{selectedCharacter.code}</div>
            {selectedCharacterRelations.map((relation, index) => (
              <button
                key={`${relation.target}-${relation.label}`}
                className={`relation-node intensity-${relation.intensity}`}
                style={{ "--node": index } as CSSProperties}
                onClick={() => {
                  const character = characters.find((item) => item.name === relation.target);
                  const location = locations.find((item) => item.name === relation.target);
                  if (character) {
                    setSelectedCharacter(character);
                  }
                  if (location) {
                    setSelectedLocation(location);
                    setCaseOpen(true);
                  }
                }}
              >
                <span>{relation.target}</span>
                <small>{relation.label}</small>
              </button>
            ))}
          </div>
        </article>
      </section>

      <section className="section timeline-section" id="timeline">
        <div className="section-heading">
          <p>Recovered VHS sequence</p>
          <h2>Timeline</h2>
        </div>
        <div className="timeline">
          {timeline.map((event) => (
            <article className="timeline-card" key={event.year}>
              <span className="year">
                <small>{event.season}</small>
                {event.year}
              </span>
              <div>
                <small>{event.tape}</small>
                <h3>{event.title}</h3>
                <p>{event.detail}</p>
                <ul className="timeline-beats">
                  {event.beats.map((beat) => (
                    <li key={beat}>{beat}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section terminal-section" id="terminal">
        <div className="section-heading">
          <p>Encrypted lab terminal</p>
          <h2>Operator Console</h2>
        </div>
        <form className="terminal-box" onSubmit={submitTerminal}>
          <div className="terminal-screen">
            <p>
              <Terminal size={18} />
              HNL_SECURE_OS / DIMENSIONAL MONITOR
            </p>
            <output>{terminalMessage}</output>
            <div className="terminal-history">
              {terminalHistory.map((entry, index) => (
                <span key={`${entry}-${index}`}>{entry}</span>
              ))}
            </div>
          </div>
          <label>
            <span>COMMAND</span>
            <input
              value={terminalValue}
              onChange={(event) => setTerminalValue(event.target.value)}
              placeholder="TYPE CLEARANCE CODE"
              autoComplete="off"
            />
          </label>
          <button className="primary-action glitch-button" type="submit">
            <ChevronDown size={18} />
            Execute
          </button>
        </form>
        <div className="unlock-strip" aria-label="已解锁档案">
          {[
            ["map", "Map Scan"],
            ["011", "Subject 011"],
            ["vecna", "Vecna Trace"],
            ["gate", "Gate Telemetry"],
          ].map(([key, label]) => (
            <span className={hasUnlocked(key) ? "is-unlocked" : ""} key={key}>
              {hasUnlocked(key) ? <UnlockKeyhole size={14} /> : <LockKeyhole size={14} />}
              {label}
            </span>
          ))}
        </div>
      </section>

      {caseOpen && (
        <div className="case-overlay" role="dialog" aria-modal="true" aria-label={`${selectedLocation.name} 案件档案`}>
          <article className="case-modal">
            <button className="close-case" onClick={() => setCaseOpen(false)} aria-label="关闭案件弹层">
              <X size={20} />
            </button>
            <p className="file-label">CASE / {selectedLocation.caseId}</p>
            <h2>{selectedLocation.name}</h2>
            <div className="case-meta">
              <span>
                <Clock3 size={15} />
                {selectedLocation.year}
              </span>
              <span>
                <ShieldAlert size={15} />
                Threat {selectedLocation.threatLevel}%
              </span>
              <span>
                <MapPin size={15} />
                {selectedLocation.type}
              </span>
            </div>
            <div className="threat-meter" aria-label={`危险等级 ${selectedLocation.threatLevel}%`}>
              <span style={{ width: `${selectedLocation.threatLevel}%` }} />
            </div>
            <p>{selectedLocation.summary}</p>
            <img className="case-image" src={selectedLocationImage} alt={`${selectedLocation.name} case visual`} />
            <div className="case-columns">
              <section>
                <h3>Evidence Trail</h3>
                <ul>
                  {selectedLocation.evidence.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
              <section>
                <h3>Linked Subjects</h3>
                <div className="subject-chips">
                  {selectedLocation.relatedCharacters.map((item) => (
                    <button key={item} onClick={() => chooseCharacterByName(item)}>
                      {item}
                    </button>
                  ))}
                </div>
              </section>
            </div>
            <p className="hidden-record">
              {isUpside || hasUnlocked("map") || hasUnlocked("gate")
                ? selectedLocation.hidden
                : "Evidence packet encrypted. Run SCAN HAWKINS or enter UPSIDE DOWN mode."}
            </p>
          </article>
        </div>
      )}

      <footer>
        <Sparkles size={16} />
        <span>Signal archive reconstructed from unstable footage. Stay in the light.</span>
      </footer>
    </main>
  );
}
