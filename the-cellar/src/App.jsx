import { useState, useEffect } from "react";
import { LEVELS, CATEGORIES, CARDS, REFERENCES } from "./data/cards.js";

// ── Saved progress (stored in this browser only — no account needed) ─────────

const STORAGE_KEY = "the-cellar-progress-v1";

function emptyProgress() {
  const p = {};
  Object.keys(CARDS).forEach(k => { p[k] = { known: [], review: [] }; });
  return p;
}

function loadProgress() {
  const base = emptyProgress();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") {
      Object.keys(base).forEach(k => {
        if (saved[k]) {
          base[k] = {
            known: Array.isArray(saved[k].known) ? saved[k].known : [],
            review: Array.isArray(saved[k].review) ? saved[k].review : [],
          };
        }
      });
    }
  } catch { /* storage unavailable or corrupt — start fresh */ }
  return base;
}

function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch { /* ignore */ }
}

// ── Aroma Wheel Component ─────────────────────────────────────────────────────

const AROMA_DATA = [
  {
    family: "Fruit", color: "#c9a84c", sub: [
      { name: "Citrus", aromas: ["Lemon", "Lime", "Grapefruit", "Orange peel"] },
      { name: "Green fruit", aromas: ["Apple", "Pear", "Gooseberry", "Quince"] },
      { name: "Stone fruit", aromas: ["Peach", "Apricot", "Nectarine", "Plum"] },
      { name: "Tropical", aromas: ["Pineapple", "Mango", "Passion fruit", "Lychee"] },
      { name: "Red fruit", aromas: ["Strawberry", "Raspberry", "Cherry", "Redcurrant"] },
      { name: "Black fruit", aromas: ["Blackberry", "Blackcurrant", "Blueberry", "Damson"] },
      { name: "Dried fruit", aromas: ["Fig", "Date", "Prune", "Raisin", "Sultana"] },
    ]
  },
  {
    family: "Floral", color: "#9b5fa5", sub: [
      { name: "Blossom", aromas: ["Acacia", "Elderflower", "Orange blossom", "Jasmine"] },
      { name: "Rose", aromas: ["Rose petal", "Rose water", "Potpourri", "Turkish delight"] },
      { name: "Violet", aromas: ["Violet", "Lavender", "Iris", "Blue flowers"] },
    ]
  },
  {
    family: "Spice", color: "#b8512a", sub: [
      { name: "Fresh spice", aromas: ["Black pepper", "White pepper", "Cinnamon", "Nutmeg", "Ginger"] },
      { name: "Dried herbs", aromas: ["Thyme", "Rosemary", "Bay leaf", "Dried oregano", "Garrigue"] },
      { name: "Green herb", aromas: ["Grass", "Tomato leaf", "Bell pepper", "Eucalyptus", "Mint"] },
    ]
  },
  {
    family: "Oak", color: "#7a5c2e", sub: [
      { name: "New oak", aromas: ["Vanilla", "Clove", "Coconut", "Toast", "Cedar"] },
      { name: "Aged oak", aromas: ["Cigar box", "Pencil shavings", "Sandalwood", "Coffee"] },
    ]
  },
  {
    family: "Earth & Mineral", color: "#5a7a4a", sub: [
      { name: "Earth", aromas: ["Wet stone", "Slate", "Flint/gunflint", "Chalk", "Clay"] },
      { name: "Mineral", aromas: ["Petrol (TDN)", "Struck match", "Iodine/saline", "Graphite"] },
      { name: "Vegetal", aromas: ["Mushroom", "Forest floor", "Truffle", "Sous-bois"] },
    ]
  },
  {
    family: "Yeast & Dairy", color: "#3a7a8a", sub: [
      { name: "Yeast", aromas: ["Bread dough", "Brioche", "Biscuit", "Pastry", "Lager"] },
      { name: "Dairy", aromas: ["Butter", "Cream", "Yoghurt", "Crème brûlée"] },
    ]
  },
  {
    family: "Oxidative & Aged", color: "#8b6914", sub: [
      { name: "Oxidative", aromas: ["Walnut", "Hazelnut", "Almond", "Dried apricot", "Marmite"] },
      { name: "Tertiary aged", aromas: ["Leather", "Tobacco", "Tar", "Game", "Dried meat"] },
    ]
  },
];

function AromaWheel() {
  const [active, setActive] = useState(null);
  const [activeFamily, setActiveFamily] = useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.refPageTitle}>Aroma Wheel</div>
      <p style={{ color:"#9a8a74", fontSize:14, marginBottom:24, fontFamily:"sans-serif" }}>
        Tap a family to explore sub-categories and individual descriptors.
      </p>

      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:28 }}>
        {AROMA_DATA.map(fam => (
          <button key={fam.family}
            style={{
              background: activeFamily===fam.family ? fam.color : "rgba(255,255,255,0.05)",
              border: `1px solid ${fam.color}`,
              color: activeFamily===fam.family ? "#fff" : fam.color,
              padding:"8px 18px", borderRadius:30, cursor:"pointer",
              fontSize:13, fontFamily:"sans-serif", fontWeight:600,
              letterSpacing:"0.06em", transition:"all 0.2s",
            }}
            onClick={() => { setActiveFamily(activeFamily===fam.family ? null : fam.family); setActive(null); }}>
            {fam.family}
          </button>
        ))}
      </div>

      {activeFamily && (() => {
        const fam = AROMA_DATA.find(f => f.family === activeFamily);
        return (
          <div style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color: fam.color, marginBottom:12, fontFamily:"sans-serif" }}>
              {fam.family} — Sub-categories
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {fam.sub.map(s => (
                <button key={s.name}
                  style={{
                    background: active===s.name ? fam.color+"33" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${active===s.name ? fam.color : "rgba(255,255,255,0.12)"}`,
                    color: active===s.name ? fam.color : "#c8b896",
                    padding:"6px 14px", borderRadius:20, cursor:"pointer",
                    fontSize:12, fontFamily:"sans-serif", transition:"all 0.2s",
                  }}
                  onClick={() => setActive(active===s.name ? null : s.name)}>
                  {s.name}
                </button>
              ))}
            </div>

            {active && (() => {
              const sub = fam.sub.find(s => s.name === active);
              return (
                <div style={{ marginTop:16, background:"rgba(255,255,255,0.04)", border:`1px solid ${fam.color}44`, borderRadius:10, padding:16 }}>
                  <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color: fam.color, marginBottom:10, fontFamily:"sans-serif" }}>
                    {sub.name} descriptors
                  </div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {sub.aromas.map(a => (
                      <span key={a} style={{
                        background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                        color:"#e8dcc8", padding:"5px 12px", borderRadius:20,
                        fontSize:13, fontFamily:"sans-serif",
                      }}>{a}</span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#c9a84c", borderBottom:"1px solid rgba(201,168,76,0.2)", paddingBottom:8, marginBottom:16, fontFamily:"sans-serif" }}>
        Full aroma reference
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14 }}>
        {AROMA_DATA.map(fam => (
          <div key={fam.family} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, overflow:"hidden" }}>
            <div style={{ background: fam.color+"22", borderBottom:`2px solid ${fam.color}`, padding:"8px 14px" }}>
              <span style={{ color: fam.color, fontWeight:600, fontSize:13, fontFamily:"sans-serif", letterSpacing:"0.05em" }}>{fam.family}</span>
            </div>
            <div style={{ padding:"10px 14px" }}>
              {fam.sub.map(s => (
                <div key={s.name} style={{ marginBottom:8 }}>
                  <div style={{ fontSize:11, color:"#9a8a74", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:4, fontFamily:"sans-serif" }}>{s.name}</div>
                  <div style={{ fontSize:13, color:"#c8b896", lineHeight:1.6, fontFamily:"sans-serif" }}>{s.aromas.join(" · ")}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tasting Guides Component ──────────────────────────────────────────────────

const WSET_SAT = {
  title: "WSET Systematic Approach to Tasting (SAT)",
  org: "WSET",
  orgColor: "#b8860b",
  levels: ["Level 2", "Level 3", "Level 4 Diploma"],
  sections: [
    {
      name: "Appearance", icon: "👁", color: "#4a7a9b",
      items: [
        { label: "Clarity", options: ["Clear", "Hazy (fault?)"] },
        { label: "Intensity", options: ["Pale", "Medium", "Deep"] },
        { label: "Colour (white)", options: ["Lemon-green", "Lemon", "Gold", "Amber", "Brown"] },
        { label: "Colour (rosé)", options: ["Pink", "Salmon", "Orange"] },
        { label: "Colour (red)", options: ["Purple", "Ruby", "Garnet", "Tawny", "Brown"] },
        { label: "Other observations", options: ["Bubbles (sparkling)", "Legs/tears (viscosity)"] },
      ]
    },
    {
      name: "Nose", icon: "👃", color: "#7a5c9b",
      items: [
        { label: "Condition", options: ["Clean", "Unclean (fault — TCA, VA, reduction)"] },
        { label: "Intensity", options: ["Light", "Medium(-)", "Medium", "Medium(+)", "Pronounced"] },
        { label: "Aroma characteristics", options: ["Fruit · Floral · Spice · Herbal · Oak · Earth · Yeast/Dairy · Other"] },
        { label: "Development", options: ["Youthful (primary/secondary)", "Developing", "Fully developed (tertiary)"] },
      ]
    },
    {
      name: "Palate", icon: "👅", color: "#7a3a3a",
      items: [
        { label: "Sweetness", options: ["Bone dry", "Dry", "Off-dry", "Medium-dry", "Medium-sweet", "Sweet", "Luscious"] },
        { label: "Acidity", options: ["Low", "Medium(-)", "Medium", "Medium(+)", "High"] },
        { label: "Tannin (reds)", options: ["Low", "Medium(-)", "Medium", "Medium(+)", "High"] },
        { label: "Tannin texture", options: ["Soft/silky", "Smooth", "Grippy/firm", "Coarse/harsh"] },
        { label: "Alcohol", options: ["Low (<11%)", "Medium (11–13.9%)", "High (14%+)"] },
        { label: "Body", options: ["Light", "Medium(-)", "Medium", "Medium(+)", "Full"] },
        { label: "Mousse (sparkling)", options: ["Delicate", "Creamy", "Mousse (aggressive)"] },
        { label: "Flavour intensity", options: ["Light", "Medium(-)", "Medium", "Medium(+)", "Pronounced"] },
        { label: "Flavour characteristics", options: ["Same descriptors as nose — confirm and expand"] },
        { label: "Finish", options: ["Short (<3s)", "Medium(-)", "Medium (5–7s)", "Medium(+)", "Long (10s+)"] },
      ]
    },
    {
      name: "Conclusions", icon: "📋", color: "#3a7a4a",
      items: [
        { label: "Quality level", options: ["Faulty", "Poor", "Acceptable", "Good", "Very Good", "Outstanding"] },
        { label: "Level of readiness", options: ["Too young", "Can drink now but has potential", "Drink now", "Too old/tired"] },
        { label: "Grape variety/ies", options: ["State your conclusion"] },
        { label: "Country/region of origin", options: ["State your conclusion"] },
        { label: "Vintage", options: ["State your conclusion"] },
      ]
    },
  ]
};

const CMS_GRID = {
  title: "Court of Master Sommeliers Deductive Tasting Grid",
  org: "CMS",
  orgColor: "#7a1a2e",
  levels: ["Introductory", "Certified", "Advanced", "Master Sommelier"],
  sections: [
    {
      name: "Sight", icon: "👁", color: "#4a7a9b",
      items: [
        { label: "Colour (white)", options: ["Water-white", "Straw yellow", "Yellow gold", "Gold", "Deep gold", "Amber/orange"] },
        { label: "Colour (red)", options: ["Purple", "Ruby", "Ruby-garnet", "Garnet", "Garnet-tawny", "Tawny/orange"] },
        { label: "Colour (rosé)", options: ["Pink", "Salmon", "Orange-pink", "Copper-orange"] },
        { label: "Clarity", options: ["Brilliant", "Clear", "Hazy", "Cloudy"] },
        { label: "Rim variation", options: ["None (young)", "Slight (developing)", "Pronounced (aged)"] },
        { label: "Viscosity", options: ["Low", "Medium", "High — legs/tears indicate alcohol or sugar"] },
      ]
    },
    {
      name: "Smell", icon: "👃", color: "#7a5c9b",
      items: [
        { label: "Condition", options: ["Clean", "TCA/cork taint", "VA/acetic", "Reductive/sulfur", "Oxidised"] },
        { label: "Fruit character", options: ["Citrus · Green · Stone · Tropical · Red berry · Dark berry · Dried fruit"] },
        { label: "Non-fruit character", options: ["Floral · Herbal/vegetal · Mineral/earth · Oak/spice"] },
        { label: "Secondary notes", options: ["Yeast (bread/lees)", "Dairy (butter/cream) from MLF"] },
        { label: "Tertiary notes", options: ["Leather · Tobacco · Tar · Petrol · Mushroom · Dried fruit · Caramel"] },
        { label: "Oak influence", options: ["None · Subtle · Moderate · Prominent — vanilla, toast, cedar, coconut"] },
        { label: "Development", options: ["Unevolved (primary) → Developing → Complex (tertiary)"] },
      ]
    },
    {
      name: "Taste", icon: "👅", color: "#7a3a3a",
      items: [
        { label: "Sweetness", options: ["Bone dry", "Dry", "Off-dry", "Sweet", "Very sweet/luscious"] },
        { label: "Acidity", options: ["Flabby · Low · Medium · Refreshing · High · Tart/nervous"] },
        { label: "Tannin level", options: ["None (whites) · Silky · Supple · Moderate · Firm · Grippy/harsh"] },
        { label: "Tannin texture", options: ["Fine-grained", "Dusty", "Chalky", "Coarse — also note ripeness"] },
        { label: "Alcohol", options: ["Low (<12%) · Medium (12–13.5%) · High (>13.5%) · Hot/burning"] },
        { label: "Body", options: ["Light · Medium-light · Medium · Medium-full · Full"] },
        { label: "Texture/Mouthfeel", options: ["Lean · Supple · Round · Creamy · Plush · Rich · Oily"] },
        { label: "Flavour intensity", options: ["Weak · Moderate · Flavourful · Concentrated"] },
        { label: "Finish length", options: ["Short (<5s) · Medium (5–10s) · Long (10–20s) · Very long (20s+)"] },
        { label: "Finish quality", options: ["Clean · Bitter · Astringent · Warming · Complex"] },
      ]
    },
    {
      name: "Conclusions", icon: "📋", color: "#3a7a4a",
      items: [
        { label: "1. Grape variety", options: ["State primary grape — then secondary blending varieties if detectable"] },
        { label: "2. Country of origin", options: ["Old World (France/Italy/Spain/Germany…) vs New World"] },
        { label: "3. Region/Appellation", options: ["Narrow as specifically as your analysis allows"] },
        { label: "4. Vintage", options: ["Estimate within ±2 years — cite structural/development evidence"] },
        { label: "5. Quality assessment", options: ["Poor · Acceptable · Good · Very Good · Outstanding"] },
        { label: "Suggested study weighting", options: ["Sight 10% · Smell 35% · Taste 35% · Conclusions 20% — a practice guide, not the official CMS mark scheme"] },
      ]
    },
  ]
};

const COMPARISON = [
  { aspect: "Format", wset: "Written assessment — SAT grid filled with standardized terms", cms: "Spoken 25-min timed verbal deduction — 6 wines in exam conditions" },
  { aspect: "Structure", wset: "Appearance → Nose → Palate → Conclusions", cms: "Sight → Smell → Taste → Conclusions (same logic, different terminology)" },
  { aspect: "Terminology", wset: "Strictly WSET-prescribed terms only (Medium(-), Medium(+) etc.)", cms: "More flexible vocabulary; examiners want confident, precise language" },
  { aspect: "Conclusions", wset: "Quality level + readiness to drink; variety/region optional at L2, required at L3/L4", cms: "Must state: variety, country, region, vintage — all four, with justification" },
  { aspect: "Scoring basis", wset: "Completeness of SAT grid + accuracy of conclusions for the mark scheme", cms: "Reasoning matters as much as the correct answer — suggested weighting: Sight 10%, Smell 35%, Taste 35%, Conclusions 20%" },
  { aspect: "Quality scale", wset: "Faulty · Poor · Acceptable · Good · Very Good · Outstanding", cms: "Poor · Acceptable · Good · Very Good · Outstanding (no 'Faulty' tier)" },
  { aspect: "Sweetness terms", wset: "Bone dry → Dry → Off-dry → Medium-dry → Medium-sweet → Sweet → Luscious", cms: "Bone dry → Dry → Off-dry → Sweet → Very sweet — simpler scale" },
  { aspect: "Tannin terms", wset: "Low / Med(-) / Med / Med(+) / High + texture", cms: "Silky / Supple / Moderate / Firm / Grippy + grain (fine/dusty/chalky/coarse)" },
];

function TastingGuides() {
  const [activeGuide, setActiveGuide] = useState("wset");
  const [expandedSection, setExpandedSection] = useState(null);
  const guide = activeGuide === "wset" ? WSET_SAT : CMS_GRID;

  return (
    <div style={styles.page}>
      <div style={styles.refPageTitle}>Tasting Guides</div>

      <div style={{ display:"flex", gap:10, marginBottom:28, flexWrap:"wrap" }}>
        {[{id:"wset",label:"WSET SAT Grid",color:"#b8860b"},{id:"cms",label:"CMS Deductive Grid",color:"#7a1a2e"},{id:"compare",label:"Side-by-Side Comparison",color:"#4a7a9b"}].map(g => (
          <button key={g.id}
            style={{
              background: activeGuide===g.id ? g.color : "rgba(255,255,255,0.05)",
              border:`1px solid ${g.color}`,
              color: activeGuide===g.id ? "#fff" : g.color,
              padding:"9px 20px", borderRadius:6, cursor:"pointer",
              fontSize:13, fontFamily:"sans-serif", fontWeight:600, letterSpacing:"0.05em",
              transition:"all 0.2s",
            }}
            onClick={() => { setActiveGuide(g.id); setExpandedSection(null); }}>
            {g.label}
          </button>
        ))}
      </div>

      {activeGuide !== "compare" && (
        <>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:18, color:"#e8dcc8", fontWeight:600, marginBottom:4 }}>{guide.title}</div>
            <div style={{ fontSize:12, fontFamily:"sans-serif", color:"#9a8a74", letterSpacing:"0.1em" }}>
              Applies to: {guide.levels.join(" · ")}
            </div>
          </div>

          {guide.sections.map((sec, si) => (
            <div key={sec.name} style={{ marginBottom:12, border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, overflow:"hidden" }}>
              <button
                style={{
                  width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
                  background: expandedSection===si ? sec.color+"22" : "rgba(255,255,255,0.03)",
                  border:"none", borderBottom: expandedSection===si ? `2px solid ${sec.color}` : "none",
                  padding:"14px 18px", cursor:"pointer", textAlign:"left",
                }}
                onClick={() => setExpandedSection(expandedSection===si ? null : si)}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:18 }}>{sec.icon}</span>
                  <span style={{ color: sec.color, fontSize:16, fontWeight:600, letterSpacing:"0.05em" }}>{sec.name}</span>
                  <span style={{ color:"#9a8a74", fontSize:12, fontFamily:"sans-serif" }}>{sec.items.length} criteria</span>
                </div>
                <span style={{ color:"#9a8a74", fontSize:18 }}>{expandedSection===si ? "−" : "+"}</span>
              </button>

              {expandedSection===si && (
                <div style={{ padding:"16px 18px", display:"flex", flexDirection:"column", gap:14 }}>
                  {sec.items.map((item, ii) => (
                    <div key={ii} style={{ borderLeft:`3px solid ${sec.color}55`, paddingLeft:14 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:"#e8dcc8", marginBottom:4, fontFamily:"sans-serif", letterSpacing:"0.04em" }}>{item.label}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                        {item.options.map((opt, oi) => (
                          <span key={oi} style={{
                            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
                            color:"#c8b896", padding:"3px 10px", borderRadius:20,
                            fontSize:12, fontFamily:"sans-serif",
                          }}>{opt}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop:20, background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.3)", borderRadius:8, padding:16 }}>
            <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#c9a84c", marginBottom:8, fontFamily:"sans-serif" }}>
              {activeGuide === "wset" ? "WSET exam tip" : "CMS exam tip"}
            </div>
            <div style={{ fontSize:13, color:"#c8b896", lineHeight:1.7, fontFamily:"sans-serif" }}>
              {activeGuide === "wset"
                ? "WSET assessors use a mark scheme tied exactly to the SAT terminology. Use only prescribed terms (e.g. 'Medium(+)' not 'quite high'). For Level 3 and Diploma, your conclusions must include a justified assessment of quality level AND readiness to drink — both are required for full marks."
                : "CMS examiners reward logical, systematic deduction over correct guessing. Always state your structural evidence before your conclusion: 'Given the high acidity, orange rim, and tar/rose aromas, I believe this is Nebbiolo from Piedmont, likely Barolo, around 2016.' A confident wrong answer beats a hesitant right one."
              }
            </div>
          </div>
        </>
      )}

      {activeGuide === "compare" && (
        <>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:16, color:"#e8dcc8", fontWeight:600, marginBottom:4 }}>WSET SAT vs. CMS Deductive Grid</div>
            <div style={{ fontSize:12, fontFamily:"sans-serif", color:"#9a8a74" }}>Key differences in format, terminology, and scoring</div>
          </div>
          <div style={{ overflowX:"auto" }}>
            <div style={{ minWidth:560, display:"flex", flexDirection:"column", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, overflow:"hidden" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1.4fr", background:"rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.1)" }}>
                <div style={{ padding:"10px 14px", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#9a8a74", fontFamily:"sans-serif" }}>Aspect</div>
                <div style={{ padding:"10px 14px", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#b8860b", fontFamily:"sans-serif", borderLeft:"1px solid rgba(255,255,255,0.08)" }}>WSET SAT</div>
                <div style={{ padding:"10px 14px", fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#9b2335", fontFamily:"sans-serif", borderLeft:"1px solid rgba(255,255,255,0.08)" }}>CMS Deductive</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr 1.4fr", borderBottom: i<COMPARISON.length-1 ? "1px solid rgba(255,255,255,0.06)" : "none", background: i%2===0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                  <div style={{ padding:"12px 14px", fontSize:12, fontWeight:600, color:"#c9a84c", fontFamily:"sans-serif", letterSpacing:"0.04em" }}>{row.aspect}</div>
                  <div style={{ padding:"12px 14px", fontSize:12, color:"#c8b896", lineHeight:1.6, fontFamily:"sans-serif", borderLeft:"1px solid rgba(255,255,255,0.06)" }}>{row.wset}</div>
                  <div style={{ padding:"12px 14px", fontSize:12, color:"#c8b896", lineHeight:1.6, fontFamily:"sans-serif", borderLeft:"1px solid rgba(255,255,255,0.06)" }}>{row.cms}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop:20, background:"rgba(74,122,155,0.1)", border:"1px solid rgba(74,122,155,0.3)", borderRadius:8, padding:16 }}>
            <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", color:"#4a7a9b", marginBottom:8, fontFamily:"sans-serif" }}>Studying for both?</div>
            <div style={{ fontSize:13, color:"#c8b896", lineHeight:1.7, fontFamily:"sans-serif" }}>
              The underlying logic is identical — both systems assess Appearance/Sight, Nose/Smell, Palate/Taste, and Conclusions in sequence. Master the WSET SAT first for its precision with terminology, then adapt to the CMS format by practicing spoken delivery and committing to conclusions backed by structural evidence.
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function SommelierApp() {
  const [screen, setScreen] = useState("home"); // home | study | reference | progress | aroma | tasting
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedCat, setSelectedCat] = useState("All");
  const [deckCards, setDeckCards] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState(loadProgress);
  const [toast, setToast] = useState(null);

  useEffect(() => { saveProgress(progress); }, [progress]);

  const showToast = (msg, color = "#c9a84c") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2200);
  };

  const startDeck = (level, cat) => {
    let cards = CARDS[level.id] || [];
    if (cat !== "All") cards = cards.filter(c => c.category === cat);
    if (!cards.length) { showToast("No cards for this selection"); return; }
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeckCards(shuffled);
    setCardIndex(0);
    setFlipped(false);
    setSelectedLevel(level);
    setSelectedCat(cat);
    setScreen("study");
    window.scrollTo(0, 0);
  };

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex(i => (i + 1) % deckCards.length), 120);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => setCardIndex(i => (i - 1 + deckCards.length) % deckCards.length), 120);
  };

  const markCard = (action) => {
    const card = deckCards[cardIndex];
    const lvl = selectedLevel.id;
    setProgress(prev => {
      const known = prev[lvl].known.filter(i => i !== card.id);
      const review = prev[lvl].review.filter(i => i !== card.id);
      if (action === "known") known.push(card.id); else review.push(card.id);
      return { ...prev, [lvl]: { known, review } };
    });
    showToast(action === "known" ? "✓ Marked as known" : "↩ Added to review", action === "known" ? "#4caf7d" : "#e07b54");
    nextCard();
  };

  const totalKnown = Object.values(progress).reduce((acc, v) => acc + v.known.length, 0);
  const totalCards = Object.values(CARDS).reduce((acc, v) => acc + v.length, 0);
  const card = deckCards[cardIndex];

  return (
    <div style={styles.root}>
      <div style={styles.grain} />

      {toast && (
        <div style={{ ...styles.toast, background: toast.color }}>{toast.msg}</div>
      )}

      {/* ── NAV ── */}
      <nav style={styles.nav}>
        <div style={styles.navLogo} onClick={() => setScreen("home")}>
          <span style={styles.navLogoMark}>𝕎</span>
          <span style={styles.navLogoText}>The Cellar</span>
        </div>
        <div style={styles.navLinks}>
          {["home","study","reference","aroma","tasting","progress"].map(s => (
            <button key={s} style={{ ...styles.navBtn, ...(screen===s?styles.navBtnActive:{}) }}
              onClick={() => { if(s==="study" && !selectedLevel) return showToast("Select a level first"); setScreen(s); setFlipped(false); window.scrollTo(0, 0); }}>
              {s === "home" ? "Levels" : s === "aroma" ? "Aroma Wheel" : s === "tasting" ? "Tasting Guides" : s.charAt(0).toUpperCase()+s.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* ── HOME ── */}
      {screen === "home" && (
        <div style={styles.page}>
          <header style={styles.hero}>
            <div style={styles.heroEyebrow}>WSET · Court of Master Sommeliers</div>
            <h1 style={styles.heroTitle}>The Cellar</h1>
            <p style={styles.heroSub}>Free sommelier exam preparation</p>
          </header>

          <div style={styles.orgSection}>
            {["WSET","CMS"].map(org => (
              <div key={org} style={styles.orgBlock}>
                <div style={styles.orgLabel}>{org === "WSET" ? "WSET" : "Court of Master Sommeliers"}</div>
                <div style={styles.levelGrid}>
                  {LEVELS.filter(l => l.org === org).map(level => {
                    const cards = CARDS[level.id] || [];
                    const known = progress[level.id]?.known.length || 0;
                    const pct = cards.length ? Math.round((known/cards.length)*100) : 0;
                    return (
                      <div key={level.id} style={styles.levelCard} onClick={() => startDeck(level, "All")}>
                        <div style={{ ...styles.levelAccent, background: level.color }} />
                        <div style={styles.levelName}>{level.label}</div>
                        <div style={styles.levelMeta}>{cards.length} cards</div>
                        <div style={styles.levelBar}>
                          <div style={{ ...styles.levelBarFill, width: pct+"%", background: level.color }} />
                        </div>
                        <div style={styles.levelPct}>{pct}% mastered</div>
                        <div style={styles.levelCats}>
                          {CATEGORIES.filter(c => c !== "All").map(cat => {
                            const count = cards.filter(cd=>cd.category===cat).length;
                            if (!count) return null;
                            return (
                              <button key={cat} style={styles.catPill}
                                onClick={e => { e.stopPropagation(); startDeck(level, cat); }}>
                                {cat} ({count})
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── STUDY ── */}
      {screen === "study" && selectedLevel && card && (
        <div style={styles.page}>
          <div style={styles.studyHeader}>
            <div>
              <div style={styles.studyLevel}>{selectedLevel.label}</div>
              <div style={styles.studyCat}>{selectedCat} · Card {cardIndex + 1} of {deckCards.length}</div>
            </div>
            <div style={styles.studyActions}>
              <button style={styles.outlineBtn} onClick={() => setScreen("home")}>← Levels</button>
              <button style={styles.outlineBtn} onClick={() => { startDeck(selectedLevel, selectedCat); showToast("Deck shuffled"); }}>
                🔀 Shuffle
              </button>
            </div>
          </div>

          <div style={styles.studyProgress}>
            <div style={{ ...styles.studyProgressFill, width: `${((cardIndex+1)/deckCards.length)*100}%`, background: selectedLevel.color }} />
          </div>

          <div style={styles.cardScene} onClick={() => setFlipped(f => !f)}>
            <div style={{ ...styles.cardInner, transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
              <div style={{ ...styles.cardFace, ...styles.cardFront }}>
                <div style={{ ...styles.cardAccentBar, background: selectedLevel.color }} />
                <div style={styles.cardCatTag}>{card.category}</div>
                <div style={styles.cardQ}>{card.q}</div>
                <div style={styles.cardHint}>tap to reveal</div>
              </div>
              <div style={{ ...styles.cardFace, ...styles.cardBack }}>
                <div style={{ ...styles.cardAccentBar, background: selectedLevel.color }} />
                <div style={styles.cardA}>{card.a}</div>
                {card.ref && (
                  <a href={card.ref.url} target="_blank" rel="noopener noreferrer" style={styles.refLink}
                    onClick={e => e.stopPropagation()}>
                    {card.ref.type === "map" ? "🗺" : card.ref.type === "image" ? "🖼" : "🔍"} {card.ref.label} ↗
                  </a>
                )}
              </div>
            </div>
          </div>

          <div style={styles.cardControls}>
            <button style={styles.ctrlBtn} onClick={prevCard}>‹ Prev</button>
            {flipped && (
              <>
                <button style={{ ...styles.markBtn, background: "#4caf7d" }} onClick={() => markCard("known")}>✓ Got it</button>
                <button style={{ ...styles.markBtn, background: "#e07b54" }} onClick={() => markCard("review")}>↩ Review</button>
              </>
            )}
            <button style={styles.ctrlBtn} onClick={nextCard}>Next ›</button>
          </div>

          <div style={styles.catFilter}>
            {CATEGORIES.map(cat => {
              const count = cat === "All" ? 1 : (CARDS[selectedLevel.id]||[]).filter(c=>c.category===cat).length;
              if (!count) return null;
              return (
                <button key={cat} style={{ ...styles.catFilterBtn, ...(selectedCat===cat?{background:selectedLevel.color,color:"#fff",borderColor:selectedLevel.color}:{}) }}
                  onClick={() => startDeck(selectedLevel, cat)}>
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── REFERENCE ── */}
      {screen === "reference" && (
        <div style={styles.page}>
          <h2 style={styles.refPageTitle}>Reference Library</h2>
          <div style={styles.refGrid}>
            <div style={styles.refSection}>
              <div style={styles.refSectionTitle}>🗺 Wine Region Maps</div>
              <div style={styles.refList}>
                {REFERENCES.maps.map(r => (
                  <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" style={styles.refItem}>
                    <span>{r.label}</span><span style={styles.refArrow}>↗</span>
                  </a>
                ))}
              </div>
            </div>
            <div style={styles.refSection}>
              <div style={styles.refSectionTitle}>📚 Study Tools & Resources</div>
              <div style={styles.refList}>
                {REFERENCES.tools.map(r => (
                  <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" style={styles.refItem}>
                    <span>{r.label}</span><span style={styles.refArrow}>↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.refSection}>
            <div style={styles.refSectionTitle}>🍾 Quick Bottle Search by Variety</div>
            <div style={styles.bottleGrid}>
              {[
                { label:"Pinot Noir", url:"https://www.wine-searcher.com/find/pinot+noir" },
                { label:"Chardonnay", url:"https://www.wine-searcher.com/find/chardonnay" },
                { label:"Cabernet Sauvignon", url:"https://www.wine-searcher.com/find/cabernet+sauvignon" },
                { label:"Nebbiolo / Barolo", url:"https://www.wine-searcher.com/find/barolo" },
                { label:"Riesling", url:"https://www.wine-searcher.com/find/riesling" },
                { label:"Champagne NV", url:"https://www.wine-searcher.com/find/champagne" },
                { label:"Sauternes", url:"https://www.wine-searcher.com/find/sauternes" },
                { label:"Fino Sherry", url:"https://www.wine-searcher.com/find/fino+sherry" },
                { label:"Syrah / Hermitage", url:"https://www.wine-searcher.com/find/hermitage+syrah" },
                { label:"Viognier / Condrieu", url:"https://www.wine-searcher.com/find/condrieu" },
                { label:"Brunello di Montalcino", url:"https://www.wine-searcher.com/find/brunello+montalcino" },
                { label:"Rioja Reserva", url:"https://www.wine-searcher.com/find/rioja+reserva" },
              ].map(b => (
                <a key={b.label} href={b.url} target="_blank" rel="noopener noreferrer" style={styles.bottleCard}>
                  <span style={styles.bottleIcon}>🍷</span>
                  <span style={styles.bottleLabel}>{b.label}</span>
                  <span style={styles.refArrow}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {screen === "aroma" && <AromaWheel />}
      {screen === "tasting" && <TastingGuides />}

      {/* ── PROGRESS ── */}
      {screen === "progress" && (
        <div style={styles.page}>
          <h2 style={styles.refPageTitle}>Your Progress</h2>
          <div style={styles.progressSummary}>
            <div style={styles.progressBig}>{totalKnown} / {totalCards}</div>
            <div style={styles.progressSub}>cards mastered across all levels</div>
            <div style={{ ...styles.progressSub, fontSize:12, marginTop:8 }}>Progress is saved on this device and browser.</div>
          </div>
          <div style={styles.progressGrid}>
            {LEVELS.map(level => {
              const cards = CARDS[level.id] || [];
              const known = progress[level.id]?.known.length || 0;
              const review = progress[level.id]?.review.length || 0;
              const pct = cards.length ? Math.round((known/cards.length)*100) : 0;
              return (
                <div key={level.id} style={styles.progressCard}>
                  <div style={{ ...styles.progressCardAccent, background: level.color }} />
                  <div style={styles.progressCardName}>{level.label}</div>
                  <div style={styles.progressBarWrap}>
                    <div style={{ ...styles.progressBarFill, width: pct+"%", background: level.color }} />
                  </div>
                  <div style={styles.progressStats}>
                    <span style={{ color: "#4caf7d" }}>✓ {known} known</span>
                    <span style={{ color: "#e07b54" }}>↩ {review} review</span>
                    <span style={{ color: "#888" }}>{cards.length - known - review} unseen</span>
                  </div>
                  <button style={{ ...styles.ctrlBtn, marginTop: 10 }} onClick={() => startDeck(level, "All")}>
                    Study Now
                  </button>
                </div>
              );
            })}
          </div>
          <button style={{ ...styles.markBtn, background:"#7a1a2e", marginTop:24 }}
            onClick={() => {
              if (!window.confirm("Reset all progress on this device? This can't be undone.")) return;
              setProgress(emptyProgress()); showToast("Progress reset");
            }}>
            Reset All Progress
          </button>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        The Cellar is a free, independent study aid. It is not affiliated with, endorsed by, or sponsored by
        the Wine & Spirit Education Trust (WSET) or the Court of Master Sommeliers. Always check official course
        materials before your exam.
      </footer>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0d0a07",
    color: "#e8dcc8",
    fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
    position: "relative",
    overflowX: "hidden",
  },
  grain: {
    position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
    backgroundRepeat: "repeat", opacity: 0.6,
  },
  toast: {
    position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
    padding: "10px 24px", borderRadius: 40, color: "#fff", fontFamily: "sans-serif",
    fontSize: 14, fontWeight: 600, zIndex: 1000, letterSpacing: "0.03em",
    boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
  },
  nav: {
    position: "sticky", top: 0, zIndex: 10,
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8,
    padding: "14px 20px", borderBottom: "1px solid rgba(201,168,76,0.2)",
    background: "rgba(13,10,7,0.95)", backdropFilter: "blur(12px)",
  },
  navLogo: { display:"flex", alignItems:"center", gap:10, cursor:"pointer" },
  navLogoMark: { fontSize: 26, color: "#c9a84c", fontFamily:"serif", lineHeight:1 },
  navLogoText: { fontSize: 16, fontWeight:400, letterSpacing:"0.12em", textTransform:"uppercase", color:"#e8dcc8" },
  navLinks: { display:"flex", gap:4, overflowX:"auto", maxWidth:"100%", WebkitOverflowScrolling:"touch" },
  navBtn: {
    background:"none", border:"none", color:"#9a8a74", fontSize:12,
    letterSpacing:"0.1em", textTransform:"uppercase", cursor:"pointer",
    padding:"6px 12px", borderRadius:4, transition:"color 0.2s",
    fontFamily:"sans-serif", whiteSpace:"nowrap",
  },
  navBtnActive: { color:"#c9a84c", borderBottom:"1px solid #c9a84c" },
  page: {
    position:"relative", zIndex:1,
    maxWidth: 960, margin: "0 auto", padding: "32px 20px 48px",
  },
  footer: {
    position:"relative", zIndex:1, maxWidth:960, margin:"0 auto",
    padding:"20px 20px 40px", borderTop:"1px solid rgba(201,168,76,0.15)",
    fontSize:11, lineHeight:1.6, color:"#6f6352", fontFamily:"sans-serif", textAlign:"center",
  },
  hero: { textAlign:"center", padding:"48px 0 40px" },
  heroEyebrow: { fontSize:11, letterSpacing:"0.25em", textTransform:"uppercase", color:"#c9a84c", marginBottom:12 },
  heroTitle: {
    fontSize: "clamp(52px, 10vw, 96px)", fontWeight:400, margin:0,
    color:"#e8dcc8", letterSpacing:"-0.02em", lineHeight:1,
    fontFamily:"'Palatino Linotype', Palatino, Georgia, serif",
  },
  heroSub: { fontSize:16, color:"#9a8a74", marginTop:12, letterSpacing:"0.05em" },
  orgSection: { marginTop: 48 },
  orgBlock: { marginBottom: 48 },
  orgLabel: {
    fontSize: 11, letterSpacing:"0.25em", textTransform:"uppercase",
    color:"#c9a84c", borderBottom:"1px solid rgba(201,168,76,0.25)",
    paddingBottom:8, marginBottom:20,
  },
  levelGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16 },
  levelCard: {
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:8, padding:20, cursor:"pointer", position:"relative", overflow:"hidden",
    transition:"background 0.2s, border-color 0.2s",
  },
  levelAccent: { position:"absolute", top:0, left:0, right:0, height:3 },
  levelName: { fontSize:15, fontWeight:600, color:"#e8dcc8", marginBottom:4 },
  levelMeta: { fontSize:12, color:"#9a8a74", fontFamily:"sans-serif", marginBottom:10 },
  levelBar: { height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:4 },
  levelBarFill: { height:"100%", borderRadius:2, transition:"width 0.5s" },
  levelPct: { fontSize:11, color:"#9a8a74", fontFamily:"sans-serif", marginBottom:12 },
  levelCats: { display:"flex", flexWrap:"wrap", gap:4 },
  catPill: {
    background:"rgba(201,168,76,0.1)", border:"1px solid rgba(201,168,76,0.3)",
    color:"#c9a84c", fontSize:10, padding:"2px 8px", borderRadius:20,
    cursor:"pointer", fontFamily:"sans-serif", letterSpacing:"0.04em",
  },
  studyHeader: { display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12, marginBottom:16 },
  studyLevel: { fontSize:18, fontWeight:600, color:"#e8dcc8" },
  studyCat: { fontSize:12, color:"#9a8a74", fontFamily:"sans-serif", marginTop:2 },
  studyActions: { display:"flex", gap:8 },
  studyProgress: { height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:32 },
  studyProgressFill: { height:"100%", borderRadius:2, transition:"width 0.4s" },
  cardScene: { perspective: 1000, cursor:"pointer", marginBottom:24 },
  // Both faces share one grid cell, so the card grows to fit the longer side.
  cardInner: {
    position:"relative", transformStyle:"preserve-3d", display:"grid",
    transition:"transform 0.55s cubic-bezier(0.4,0,0.2,1)",
  },
  cardFace: {
    gridArea:"1 / 1", position:"relative", boxSizing:"border-box",
    backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
    background:"rgba(30,22,14,0.95)", border:"1px solid rgba(201,168,76,0.25)",
    borderRadius:12, padding:"32px 28px", display:"flex", flexDirection:"column",
    justifyContent:"center", minHeight:320,
    boxShadow:"0 8px 40px rgba(0,0,0,0.6)",
  },
  cardFront: {},
  cardBack: { transform:"rotateY(180deg)", background:"rgba(20,14,8,0.98)" },
  cardAccentBar: { position:"absolute", top:0, left:0, right:0, height:4, borderRadius:"12px 12px 0 0" },
  cardCatTag: { fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#c9a84c", marginBottom:20, fontFamily:"sans-serif" },
  cardQ: { fontSize:"clamp(18px,3vw,26px)", lineHeight:1.5, color:"#e8dcc8", fontWeight:400 },
  cardHint: { fontSize:12, color:"rgba(200,180,150,0.35)", marginTop:24, fontFamily:"sans-serif", letterSpacing:"0.1em" },
  cardA: { fontSize:"clamp(14px,2.4vw,19px)", lineHeight:1.65, color:"#d4c4a8" },
  refLink: {
    display:"inline-block", marginTop:20, alignSelf:"flex-start",
    color:"#c9a84c", fontSize:13, textDecoration:"none",
    border:"1px solid rgba(201,168,76,0.35)", borderRadius:4,
    padding:"6px 14px", fontFamily:"sans-serif", letterSpacing:"0.06em",
  },
  cardControls: { display:"flex", justifyContent:"center", gap:12, marginBottom:20, flexWrap:"wrap" },
  ctrlBtn: {
    background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)",
    color:"#e8dcc8", padding:"10px 22px", borderRadius:6, cursor:"pointer",
    fontSize:14, fontFamily:"sans-serif", letterSpacing:"0.05em",
  },
  markBtn: {
    border:"none", color:"#fff", padding:"10px 22px", borderRadius:6,
    cursor:"pointer", fontSize:14, fontWeight:600, fontFamily:"sans-serif", letterSpacing:"0.04em",
  },
  catFilter: { display:"flex", flexWrap:"wrap", gap:6, justifyContent:"center" },
  catFilterBtn: {
    background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)",
    color:"#9a8a74", padding:"5px 12px", borderRadius:20,
    cursor:"pointer", fontSize:11, fontFamily:"sans-serif", letterSpacing:"0.06em", transition:"all 0.2s",
  },
  refPageTitle: { fontSize:28, fontWeight:400, color:"#e8dcc8", marginBottom:28, letterSpacing:"-0.01em" },
  refGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:24, marginBottom:8 },
  refSection: { background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:20, marginBottom:24 },
  refSectionTitle: { fontSize:13, letterSpacing:"0.15em", textTransform:"uppercase", color:"#c9a84c", marginBottom:14, fontFamily:"sans-serif" },
  refList: { display:"flex", flexDirection:"column", gap:2 },
  refItem: {
    display:"flex", justifyContent:"space-between", alignItems:"center",
    padding:"9px 12px", borderRadius:5, textDecoration:"none",
    color:"#c8b896", fontSize:14, fontFamily:"sans-serif",
    transition:"background 0.15s", border:"1px solid transparent",
  },
  refArrow: { color:"#c9a84c", fontSize:12 },
  bottleGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(140px, 1fr))", gap:10 },
  bottleCard: {
    display:"flex", flexDirection:"column", alignItems:"center", gap:6,
    padding:"14px 10px", borderRadius:8,
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
    textDecoration:"none", color:"#c8b896", fontSize:12, fontFamily:"sans-serif",
    textAlign:"center", transition:"background 0.15s",
  },
  bottleIcon: { fontSize:22 },
  bottleLabel: { lineHeight:1.3 },
  progressSummary: { textAlign:"center", marginBottom:36 },
  progressBig: { fontSize:56, fontWeight:300, color:"#c9a84c", lineHeight:1 },
  progressSub: { fontSize:14, color:"#9a8a74", fontFamily:"sans-serif", marginTop:4 },
  progressGrid: { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:16 },
  progressCard: {
    background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
    borderRadius:8, padding:20, position:"relative", overflow:"hidden",
  },
  progressCardAccent: { position:"absolute", top:0, left:0, right:0, height:3 },
  progressCardName: { fontSize:14, fontWeight:600, color:"#e8dcc8", marginBottom:12, marginTop:4 },
  progressBarWrap: { height:3, background:"rgba(255,255,255,0.08)", borderRadius:2, marginBottom:8 },
  progressBarFill: { height:"100%", borderRadius:2, transition:"width 0.5s" },
  progressStats: { display:"flex", flexDirection:"column", gap:3, fontSize:12, fontFamily:"sans-serif" },
  outlineBtn: {
    background:"none", border:"1px solid rgba(201,168,76,0.35)",
    color:"#c9a84c", padding:"7px 14px", borderRadius:5,
    cursor:"pointer", fontSize:12, fontFamily:"sans-serif", letterSpacing:"0.06em",
  },
};
