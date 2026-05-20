// daily-bible-verse.widget.jsx
// Premium Daily Bible Verse widget for Übersicht.
// Uses a Catholic-friendly Douay-Rheims verse source through bible-api.com.
// Includes a built-in reference rotation and a direct USCCB Daily Readings button.

export const refreshFrequency = 60 * 60 * 1000; // refresh hourly; verse changes by date

export const command = `/bin/bash -lc '
refs=(
"John 3:16"
"Psalm 23:1"
"Matthew 5:8"
"Luke 1:37"
"John 14:27"
"Romans 8:28"
"Psalm 46:10"
"Philippians 4:6"
"Philippians 4:13"
"Matthew 11:28"
"Isaiah 41:10"
"Jeremiah 29:11"
"Proverbs 3:5"
"1 Corinthians 13:4"
"1 Corinthians 13:13"
"John 15:5"
"John 15:13"
"Romans 12:12"
"Galatians 5:22"
"Ephesians 2:10"
"Colossians 3:15"
"Hebrews 11:1"
"James 1:5"
"James 1:17"
"1 Peter 5:7"
"1 John 4:8"
"1 John 4:18"
"Revelation 21:4"
"Psalm 27:1"
"Psalm 51:10"
"Psalm 91:2"
"Psalm 118:24"
"Matthew 6:33"
"Matthew 7:7"
"Mark 10:27"
"Luke 12:32"
"John 8:12"
"John 10:10"
"John 11:25"
"Acts 20:24"
"Romans 5:5"
"Romans 8:31"
"Romans 15:13"
"2 Corinthians 5:7"
"2 Corinthians 12:9"
"Ephesians 6:10"
"Philippians 1:6"
"Colossians 3:2"
"1 Thessalonians 5:16"
"2 Timothy 1:7"
"Hebrews 4:16"
"Hebrews 13:8"
"James 4:8"
"1 Peter 2:9"
"Jude 1:24"
"Psalm 34:8"
"Psalm 37:4"
"Psalm 55:22"
"Psalm 121:1"
"Isaiah 40:31"
"Micah 6:8"
"Matthew 22:37"
"Luke 6:36"
"John 6:35"
"John 16:33"
"Romans 10:9"
"1 Corinthians 10:13"
"Galatians 2:20"
"Ephesians 3:20"
"Philippians 2:3"
"Colossians 3:23"
"1 Timothy 4:12"
"Hebrews 12:1"
"1 Peter 1:15"
)
count=\${#refs[@]}
doy=$(date +%j)
idx=$(( (10#$doy - 1) % count ))
ref="\${refs[$idx]}"
url_ref=$(printf "%s" "$ref" | sed "s/ /+/g")
json=$(curl -fsSL --max-time 10 "https://bible-api.com/$url_ref?translation=dra" 2>/dev/null || true)
if [ -n "$json" ]; then
  printf "%s" "$json"
else
  safe_ref=$(printf "%s" "$ref" | sed "s/\\\\/\\\\\\\\/g; s/\"/\\\\\"/g")
  printf "{\"reference\":\"%s\",\"text\":\"\",\"translation_name\":\"Douay-Rheims 1899 American Edition\",\"offline\":true,\"date\":\"%s\"}" "$safe_ref" "$(date +%Y-%m-%d)"
fi
'`;

const STORAGE_KEY = "dailyBibleVerseWidget.v1";
const USCCB_URL = "https://bible.usccb.org/daily-bible-reading";
const BIBLE_API_ROOT = "https://bible-api.com/";

const DEFAULT_SETTINGS = {
  title: "Daily Verse",
  label: "Catholic Scripture",
  icon: "cross",
  theme: "cathedral",
  showPrayer: true,
  showSource: true,
  collapsed: false
};

const ICONS = {
  cross: "✝️",
  bible: "📖",
  dove: "🕊️",
  candle: "🕯️",
  beads: "📿",
  heart: "🤍",
  sunrise: "🌅",
  star: "✨"
};

const ICON_LABELS = {
  cross: "Cross",
  bible: "Bible",
  dove: "Dove",
  candle: "Candle",
  beads: "Prayer Beads",
  heart: "Heart",
  sunrise: "Morning",
  star: "Star"
};

const THEMES = {
  cathedral: { name: "Cathedral Glass", a: "#7c5cff", b: "#26b6ff", c: "#ffd166" },
  gold: { name: "Warm Gold", a: "#ffd166", b: "#ff9f1c", c: "#ffffff" },
  blue: { name: "Marian Blue", a: "#5bc0ff", b: "#0066ff", c: "#d9f3ff" },
  emerald: { name: "Emerald Peace", a: "#35e6a5", b: "#0ea5a3", c: "#f8e16c" },
  rose: { name: "Rose Window", a: "#ff5c8a", b: "#8b5cf6", c: "#ffd166" },
  midnight: { name: "Midnight Chapel", a: "#a3bffa", b: "#475569", c: "#f8fafc" }
};

const REFS = [
  "John 3:16", "Psalm 23:1", "Matthew 5:8", "Luke 1:37", "John 14:27", "Romans 8:28",
  "Psalm 46:10", "Philippians 4:6", "Philippians 4:13", "Matthew 11:28", "Isaiah 41:10",
  "Jeremiah 29:11", "Proverbs 3:5", "1 Corinthians 13:4", "1 Corinthians 13:13", "John 15:5",
  "John 15:13", "Romans 12:12", "Galatians 5:22", "Ephesians 2:10", "Colossians 3:15",
  "Hebrews 11:1", "James 1:5", "James 1:17", "1 Peter 5:7", "1 John 4:8", "1 John 4:18",
  "Revelation 21:4", "Psalm 27:1", "Psalm 51:10", "Psalm 91:2", "Psalm 118:24",
  "Matthew 6:33", "Matthew 7:7", "Mark 10:27", "Luke 12:32", "John 8:12", "John 10:10",
  "John 11:25", "Acts 20:24", "Romans 5:5", "Romans 8:31", "Romans 15:13", "2 Corinthians 5:7",
  "2 Corinthians 12:9", "Ephesians 6:10", "Philippians 1:6", "Colossians 3:2", "1 Thessalonians 5:16",
  "2 Timothy 1:7", "Hebrews 4:16", "Hebrews 13:8", "James 4:8", "1 Peter 2:9", "Jude 1:24",
  "Psalm 34:8", "Psalm 37:4", "Psalm 55:22", "Psalm 121:1", "Isaiah 40:31", "Micah 6:8",
  "Matthew 22:37", "Luke 6:36", "John 6:35", "John 16:33", "Romans 10:9", "1 Corinthians 10:13",
  "Galatians 2:20", "Ephesians 3:20", "Philippians 2:3", "Colossians 3:23", "1 Timothy 4:12",
  "Hebrews 12:1", "1 Peter 1:15"
];

const clean = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .trim();

const pad2 = (value) => String(value).padStart(2, "0");

const dayOfYear = (date) => {
  const d = new Date(date);
  const start = new Date(d.getFullYear(), 0, 0);
  const diff = d - start + (start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
  return Math.floor(diff / 86400000);
};

const refForToday = (now) => REFS[(dayOfYear(now || Date.now()) - 1) % REFS.length];

const verseUrl = (reference) => BIBLE_API_ROOT + encodeURIComponent(reference).replace(/%20/g, "+") + "?translation=dra";

const friendlyDate = (now) =>
  new Date(now || Date.now()).toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric"
  });

const withDefaults = (value) => {
  const source = value && typeof value === "object" ? value : {};
  return {
    ...DEFAULT_SETTINGS,
    ...source,
    title: source.title || DEFAULT_SETTINGS.title,
    label: source.label || DEFAULT_SETTINGS.label,
    icon: ICONS[source.icon] ? source.icon : DEFAULT_SETTINGS.icon,
    theme: THEMES[source.theme] ? source.theme : DEFAULT_SETTINGS.theme,
    showPrayer: source.showPrayer === false ? false : true,
    showSource: source.showSource === false ? false : true,
    collapsed: !!source.collapsed
  };
};

const loadSettings = () => {
  try {
    if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };
    const raw = localStorage.getItem(STORAGE_KEY);
    return withDefaults(raw ? JSON.parse(raw) : DEFAULT_SETTINGS);
  } catch (e) {
    return { ...DEFAULT_SETTINGS };
  }
};

const saveSettings = (settings) => {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  } catch (e) {}
};

const fallbackVerse = (now) => ({
  reference: refForToday(now),
  text: "Loading today’s verse…",
  translation: "Douay-Rheims",
  online: false,
  loading: true
});

const parseVerse = (output, now) => {
  const fallbackRef = refForToday(now);

  try {
    const data = JSON.parse(String(output || "").trim());
    const reference = data.reference || fallbackRef;
    const text = clean(
      data.text ||
        (Array.isArray(data.verses) ? data.verses.map((v) => v.text).join(" ") : "")
    );

    if (!text) {
      return {
        reference,
        text: "Couldn’t load the verse text right now. Use the USCCB button below for today’s official Catholic readings.",
        translation: data.translation_name || "Douay-Rheims",
        online: false,
        error: true
      };
    }

    return {
      reference,
      text,
      translation: data.translation_name || "Douay-Rheims",
      online: !data.offline,
      error: false
    };
  } catch (e) {
    return {
      reference: fallbackRef,
      text: "Couldn’t load the verse text right now. Use the USCCB button below for today’s official Catholic readings.",
      translation: "Douay-Rheims",
      online: false,
      error: true
    };
  }
};

const initialSettings = loadSettings();

export const initialState = {
  now: Date.now(),
  settings: initialSettings,
  draft: initialSettings,
  settingsOpen: false,
  verse: fallbackVerse(Date.now())
};

export const updateState = (event, previousState) => {
  const state = previousState || initialState;

  if (event && event.type === "OPEN_SETTINGS") {
    return { ...state, settingsOpen: true, draft: { ...state.settings } };
  }

  if (event && event.type === "CLOSE_SETTINGS") {
    return { ...state, settingsOpen: false };
  }

  if (event && event.type === "UPDATE_DRAFT") {
    return {
      ...state,
      draft: {
        ...state.draft,
        [event.field]: event.value
      }
    };
  }

  if (event && event.type === "UPDATE_DRAFT_CHECKBOX") {
    return {
      ...state,
      draft: {
        ...state.draft,
        [event.field]: !!event.value
      }
    };
  }

  if (event && event.type === "SAVE_SETTINGS") {
    const saved = withDefaults(state.draft);
    saveSettings(saved);
    return { ...state, settings: saved, draft: saved, settingsOpen: false };
  }

  if (event && event.type === "RESET_SETTINGS") {
    const reset = { ...DEFAULT_SETTINGS };
    saveSettings(reset);
    return { ...state, settings: reset, draft: reset, settingsOpen: true };
  }

  if (event && event.type === "TOGGLE_COLLAPSED") {
    const next = { ...state.settings, collapsed: !state.settings.collapsed };
    saveSettings(next);
    return { ...state, settings: next, draft: next };
  }

  if (event && event.output) {
    const now = Date.now();
    return {
      ...state,
      now,
      verse: parseVerse(event.output, now)
    };
  }

  return { ...state, now: Date.now() };
};

const Field = ({ label, children, full }) => (
  <label className={full ? "dbv-field full" : "dbv-field"}>
    <span className="dbv-label">{label}</span>
    {children}
  </label>
);

const Toggle = ({ label, checked, onChange }) => (
  <button className={checked ? "dbv-toggle is-on" : "dbv-toggle"} onClick={() => onChange(!checked)}>
    <span className="dbv-toggle-dot" />
    <span>{label}</span>
  </button>
);

export const render = (props, dispatch) => {
  const state = props || initialState;
  const settings = withDefaults(state.settings);
  const draft = withDefaults(state.draft || settings);
  const theme = THEMES[settings.theme] || THEMES.cathedral;
  const icon = ICONS[settings.icon] || ICONS.cross;
  const verse = state.verse || fallbackVerse(state.now || Date.now());

  const shellClass = [
    "dbv-shell",
    settings.collapsed ? "is-collapsed" : "",
    state.settingsOpen ? "settings-open" : ""
  ].join(" ");

  const dispatchDraft = (field) => (e) =>
    dispatch({ type: "UPDATE_DRAFT", field: field, value: e.target.value });

  const dispatchCheck = (field) => (value) =>
    dispatch({ type: "UPDATE_DRAFT_CHECKBOX", field: field, value: value });

  const openUrl = (url) => {
    try {
      if (typeof window !== "undefined") window.open(url);
    } catch (e) {}
  };

  return (
    <div
      className={shellClass}
      style={{
        "--accent": theme.a,
        "--accent2": theme.b,
        "--hot": theme.c
      }}
    >
      <div className="dbv-mini" onClick={() => dispatch({ type: "TOGGLE_COLLAPSED" })}>
        <div className="dbv-mini-icon">{icon}</div>
        <div>
          <div className="dbv-mini-title">{settings.title}</div>
          <div className="dbv-mini-sub">{verse.reference || refForToday(state.now)}</div>
        </div>
      </div>

      <div className="dbv-inner">
        <div className="dbv-topbar">
          <div className="dbv-kicker">
            <span className="dbv-live-dot" />
            <span>{settings.label}</span>
          </div>
          <div className="dbv-actions">
            <button className="dbv-icon-btn" title="Minimize" onClick={() => dispatch({ type: "TOGGLE_COLLAPSED" })}>
              −
            </button>
            <button className="dbv-icon-btn" title="Settings" onClick={() => dispatch({ type: "OPEN_SETTINGS" })}>
              ⚙
            </button>
          </div>
        </div>

        <div className="dbv-hero">
          <div className="dbv-orb-wrap">
            <div className="dbv-ring" />
            <div className="dbv-big-icon">{icon}</div>
          </div>

          <div>
            <h2 className="dbv-title">{settings.title}</h2>
            <div className="dbv-date-line">
              <span>{friendlyDate(state.now)}</span>
              <span className={verse.online ? "dbv-pill" : "dbv-pill muted"}>{verse.online ? "LIVE" : "LOCAL"}</span>
            </div>
          </div>
        </div>

        <div className="dbv-verse-card">
          <div className="dbv-quote-mark">“</div>
          <div className="dbv-verse-text">{verse.text}</div>
          <div className="dbv-ref-row">
            <span>{verse.reference}</span>
            <span>{verse.translation}</span>
          </div>
        </div>

        {settings.showPrayer ? (
          <div className="dbv-prayer">
            <span className="dbv-prayer-label">Prayer prompt</span>
            <span>Lord, help me carry this word into today.</span>
          </div>
        ) : null}

        {settings.showSource ? (
          <div className="dbv-source-row">
            <button className="dbv-link-btn" onClick={() => openUrl(USCCB_URL)}>USCCB readings</button>
            <button className="dbv-link-btn" onClick={() => openUrl(verseUrl(verse.reference || refForToday(state.now)))}>Open verse source</button>
          </div>
        ) : null}

        <div className="dbv-footer">
          <span>New verse each day</span>
          <span>{new Date(state.now || Date.now()).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</span>
        </div>
      </div>

      <div className="dbv-settings">
        <div className="dbv-settings-head">
          <div className="dbv-settings-title">Verse Settings</div>
          <button className="dbv-icon-btn" title="Close" onClick={() => dispatch({ type: "CLOSE_SETTINGS" })}>
            ×
          </button>
        </div>

        <div className="dbv-form-grid">
          <Field label="Widget title" full>
            <input className="dbv-input" value={draft.title} onChange={dispatchDraft("title")} placeholder="Daily Verse" />
          </Field>

          <Field label="Small label" full>
            <input className="dbv-input" value={draft.label} onChange={dispatchDraft("label")} placeholder="Catholic Scripture" />
          </Field>

          <Field label="Icon">
            <select className="dbv-select" value={draft.icon} onChange={dispatchDraft("icon")}>
              {Object.keys(ICONS).map((key) => (
                <option value={key} key={key}>{ICONS[key]} {ICON_LABELS[key]}</option>
              ))}
            </select>
          </Field>

          <Field label="Theme">
            <select className="dbv-select" value={draft.theme} onChange={dispatchDraft("theme")}>
              {Object.keys(THEMES).map((key) => (
                <option value={key} key={key}>{THEMES[key].name}</option>
              ))}
            </select>
          </Field>

          <div className="dbv-toggle-stack">
            <Toggle label="Show prayer prompt" checked={draft.showPrayer} onChange={dispatchCheck("showPrayer")} />
            <Toggle label="Show source buttons" checked={draft.showSource} onChange={dispatchCheck("showSource")} />
          </div>

          <div className="dbv-help full">
            This widget rotates through a built-in daily reference list and loads the verse text from bible-api.com using the Douay-Rheims translation. The USCCB button opens the official Catholic Daily Readings page.
          </div>
        </div>

        <div className="dbv-settings-actions">
          <button className="dbv-secondary" onClick={() => dispatch({ type: "RESET_SETTINGS" })}>Reset</button>
          <button className="dbv-save" onClick={() => dispatch({ type: "SAVE_SETTINGS" })}>Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export const className = `
  position: fixed !important;
  top: 24px !important;
  left: 50% !important;
  right: auto !important;
  bottom: auto !important;
  transform: translateX(-50%);
  width: 430px;
  z-index: 950;
  color: rgba(255,255,255,0.96);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, Arial, sans-serif;

  *, *::before, *::after {
    box-sizing: border-box;
  }

  .dbv-shell {
    --accent: #7c5cff;
    --accent2: #26b6ff;
    --hot: #ffd166;
    position: relative;
    overflow: hidden;
    border-radius: 24px;
    background:
      radial-gradient(circle at 16% 0%, rgba(124,92,255,0.24), transparent 38%),
      radial-gradient(circle at 92% 8%, rgba(38,182,255,0.20), transparent 34%),
      radial-gradient(circle at 50% 105%, rgba(255, 209, 102, 0.12), transparent 36%),
      linear-gradient(145deg, rgba(12,18,30,0.76), rgba(7,10,18,0.58));
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow:
      0 24px 70px rgba(0,0,0,0.38),
      inset 0 1px 0 rgba(255,255,255,0.11);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
  }

  .dbv-shell::before {
    content: "";
    position: absolute;
    inset: -1px;
    pointer-events: none;
    background:
      linear-gradient(110deg, rgba(255,255,255,0.14), transparent 34%, rgba(255,255,255,0.07) 66%, transparent),
      repeating-linear-gradient(90deg, transparent 0 32px, rgba(255,255,255,0.035) 33px 34px);
    opacity: 0.62;
  }

  .dbv-inner {
    position: relative;
    padding: 18px;
  }

  .dbv-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 14px;
  }

  .dbv-kicker {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.58);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-size: 10px;
    font-weight: 850;
  }

  .dbv-live-dot {
    width: 8px;
    height: 8px;
    border-radius: 99px;
    background: var(--hot);
    box-shadow: 0 0 16px var(--hot);
  }

  .dbv-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .dbv-icon-btn {
    width: 30px;
    height: 30px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.88);
    display: grid;
    place-items: center;
    cursor: pointer;
    transition: transform 160ms ease, background 160ms ease, border-color 160ms ease;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    font-family: inherit;
  }

  .dbv-icon-btn:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,0.14);
    border-color: rgba(255,255,255,0.22);
  }

  .dbv-hero {
    display: grid;
    grid-template-columns: 82px 1fr;
    gap: 15px;
    align-items: center;
  }

  .dbv-orb-wrap {
    width: 82px;
    height: 82px;
    position: relative;
  }

  .dbv-ring {
    position: absolute;
    inset: 0;
    border-radius: 999px;
    background: conic-gradient(var(--accent), var(--accent2), var(--hot), var(--accent));
    box-shadow: 0 0 34px rgba(38,182,255,0.26);
  }

  .dbv-ring::after {
    content: "";
    position: absolute;
    inset: 7px;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(8,14,24,0.92), rgba(20,26,39,0.78));
    border: 1px solid rgba(255,255,255,0.10);
  }

  .dbv-big-icon {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-size: 35px;
    filter: drop-shadow(0 8px 16px rgba(0,0,0,0.35));
    z-index: 2;
  }

  .dbv-title {
    font-size: 25px;
    line-height: 1.02;
    letter-spacing: -0.035em;
    font-weight: 950;
    margin: 0 0 7px;
    color: #fff;
    text-shadow: 0 1px 24px rgba(255,255,255,0.12);
  }

  .dbv-date-line {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255,255,255,0.78);
    font-size: 12px;
    font-weight: 700;
  }

  .dbv-pill {
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.10);
    color: rgba(255,255,255,0.74);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 850;
  }

  .dbv-pill.muted {
    color: rgba(255,255,255,0.48);
  }

  .dbv-verse-card {
    position: relative;
    margin-top: 16px;
    border-radius: 19px;
    padding: 16px 16px 14px;
    background: rgba(255,255,255,0.075);
    border: 1px solid rgba(255,255,255,0.11);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
    overflow: hidden;
  }

  .dbv-quote-mark {
    position: absolute;
    right: 13px;
    top: -14px;
    font-size: 78px;
    line-height: 1;
    font-weight: 900;
    color: rgba(255,255,255,0.075);
    font-family: Georgia, serif;
  }

  .dbv-verse-text {
    position: relative;
    font-size: 18px;
    line-height: 1.36;
    letter-spacing: -0.018em;
    font-weight: 820;
    color: rgba(255,255,255,0.94);
  }

  .dbv-ref-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 12px;
    color: rgba(255,255,255,0.56);
    font-size: 10px;
    line-height: 1.25;
    text-transform: uppercase;
    letter-spacing: 0.10em;
    font-weight: 850;
  }

  .dbv-ref-row span:last-child {
    text-align: right;
  }

  .dbv-prayer {
    margin-top: 11px;
    padding: 11px 12px;
    border-radius: 15px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.70);
    font-size: 11px;
    line-height: 1.35;
    font-weight: 700;
  }

  .dbv-prayer-label {
    display: block;
    margin-bottom: 4px;
    color: rgba(255,255,255,0.42);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 9px;
    font-weight: 900;
  }

  .dbv-source-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 11px;
  }

  .dbv-link-btn {
    border: 1px solid rgba(255,255,255,0.11);
    border-radius: 13px;
    padding: 9px 10px;
    cursor: pointer;
    color: rgba(255,255,255,0.84);
    background: rgba(255,255,255,0.075);
    font-size: 11px;
    font-weight: 900;
    font-family: inherit;
  }

  .dbv-link-btn:hover {
    background: rgba(255,255,255,0.13);
  }

  .dbv-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 12px;
    color: rgba(255,255,255,0.42);
    font-size: 10px;
    font-weight: 750;
  }

  .dbv-mini {
    display: none;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    cursor: pointer;
  }

  .dbv-mini-icon {
    width: 34px;
    height: 34px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.12);
    font-size: 18px;
  }

  .dbv-mini-title {
    font-size: 14px;
    font-weight: 950;
    letter-spacing: -0.02em;
  }

  .dbv-mini-sub {
    margin-top: 1px;
    font-size: 11px;
    color: rgba(255,255,255,0.56);
    font-weight: 750;
  }

  .dbv-shell.is-collapsed {
    width: 240px;
    border-radius: 19px;
  }

  .dbv-shell.is-collapsed .dbv-inner {
    display: none;
  }

  .dbv-shell.is-collapsed .dbv-mini {
    display: flex;
  }

  .dbv-shell.settings-open {
    height: calc(100vh - 110px);
    max-height: 560px;
  }

  .dbv-shell.settings-open .dbv-inner,
  .dbv-shell.settings-open .dbv-mini {
    display: none;
  }

  .dbv-settings {
    display: none;
    position: relative;
    z-index: 50;
    height: 100%;
    min-height: 0;
    border-radius: 20px;
    background: rgba(9, 13, 22, 0.97);
    border: 1px solid rgba(255,255,255,0.15);
    box-shadow: 0 22px 60px rgba(0,0,0,0.45);
    backdrop-filter: blur(22px) saturate(170%);
    -webkit-backdrop-filter: blur(22px) saturate(170%);
    padding: 14px;
    overflow: hidden;
    flex-direction: column;
  }

  .dbv-shell.settings-open .dbv-settings {
    display: flex;
  }

  .dbv-settings-head {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin: 0 0 12px;
    padding: 0 0 10px;
    position: relative;
    z-index: 3;
    border-bottom: 1px solid rgba(255,255,255,0.09);
  }

  .dbv-settings-title {
    font-size: 16px;
    font-weight: 950;
    letter-spacing: -0.03em;
  }

  .dbv-form-grid {
    flex: 1 1 auto;
    min-height: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-content: start;
    gap: 10px;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 0 3px 14px 0;
    margin-right: -3px;
  }

  .dbv-form-grid::-webkit-scrollbar {
    width: 7px;
  }

  .dbv-form-grid::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.045);
    border-radius: 999px;
  }

  .dbv-form-grid::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.22);
    border-radius: 999px;
  }

  .dbv-field {
    min-width: 0;
    display: block;
  }

  .dbv-field.full, .dbv-help.full {
    grid-column: 1 / -1;
  }

  .dbv-label {
    display: block;
    margin: 0 0 5px;
    color: rgba(255,255,255,0.56);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 850;
  }

  .dbv-input, .dbv-select {
    width: 100%;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 12px;
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.94);
    outline: none;
    padding: 9px 10px;
    font-size: 12px;
    font-weight: 750;
    font-family: inherit;
  }

  .dbv-select option {
    color: #111;
    background: #fff;
  }

  .dbv-toggle-stack {
    grid-column: 1 / -1;
    display: grid;
    gap: 8px;
  }

  .dbv-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 13px;
    padding: 9px 10px;
    background: rgba(255,255,255,0.07);
    color: rgba(255,255,255,0.78);
    cursor: pointer;
    font-size: 12px;
    font-weight: 850;
    text-align: left;
    font-family: inherit;
  }

  .dbv-toggle-dot {
    width: 24px;
    height: 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.12);
    position: relative;
    flex: 0 0 auto;
  }

  .dbv-toggle-dot::after {
    content: "";
    position: absolute;
    top: 2px;
    left: 2px;
    width: 8px;
    height: 8px;
    border-radius: 99px;
    background: rgba(255,255,255,0.72);
    transition: transform 160ms ease;
  }

  .dbv-toggle.is-on .dbv-toggle-dot {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
  }

  .dbv-toggle.is-on .dbv-toggle-dot::after {
    transform: translateX(10px);
    background: #fff;
  }

  .dbv-help {
    padding: 11px 12px;
    border-radius: 14px;
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.09);
    color: rgba(255,255,255,0.56);
    font-size: 11px;
    line-height: 1.4;
    font-weight: 650;
  }

  .dbv-settings-actions {
    flex: 0 0 auto;
    display: flex;
    gap: 8px;
    margin-top: 12px;
    padding: 12px 0 0;
    position: relative;
    z-index: 3;
    border-top: 1px solid rgba(255,255,255,0.09);
    background: rgba(9,13,22,0.97);
  }

  .dbv-save, .dbv-secondary {
    flex: 1;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 13px;
    padding: 10px 12px;
    cursor: pointer;
    color: #fff;
    font-size: 12px;
    font-weight: 900;
    font-family: inherit;
  }

  .dbv-save {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    box-shadow: 0 10px 22px rgba(38,182,255,0.18);
  }

  .dbv-secondary {
    background: rgba(255,255,255,0.08);
  }
`;
