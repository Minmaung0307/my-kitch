// My Kitch - pure frontend, no Firebase required

const RECIPES = [
  {
    id: "egg-fry-rice",
    name: "Everyday Egg Fried Rice",
    category: "daily",
    time: 15,
    level: "easy",
    serves: 1,
    hero: "https://images.pexels.com/photos/1437268/pexels-photo-1437268.jpeg?auto=compress&w=800",
    tags: ["rice", "egg", "pan", "student"],
    short: "One pan, leftover rice + egg + onion. Perfect for hostel / office.",
    ingredients: [
      "Rice (တစ်နေ့လောက်အို) - 1 plate",
      "Egg - 1 or 2",
      "Onion, spring onion, garlic",
      "Oil, salt, soy sauce (optional), pepper"
    ],
    steps: [
      "Pan ကို အနည်းငယ်ဆီထည့်ပြီး ကြက်သွန်နီ၊ ကြက်သွန်ဖြူ ကင်ချယ်ပါ။",
      "အဲဂ်ထည့်ပြီး scramble လုပ်ပါ (မကြမ်းအောင်).",
      "ထုတ်ထားတဲ့ထမင်းထည့်၊ အရောမှုန့်၊ ငန့်သီးခွေး၊ soy sauce အနည်းငယ်ထည့်ပြီး လိမ္မော်ရောင်လေးထိ ကြော်ပေးပါ။",
      "နတ်သမီးမြစ် (spring onion) ဖြူးပြီး ရိုးရှင်းစိတ်ချမ်းသာတဲ့ နေ့စဲဖတ်မ် လုပ်ပြီးပါပြီ။"
    ]
  },
  {
    id: "mohinga-quick",
    name: "Quick Mohinga (Hostel Style)",
    category: "noodle",
    time: 25,
    level: "medium",
    serves: 2,
    hero: "https://images.pexels.com/photos/4194626/pexels-photo-4194626.jpeg?auto=compress&w=800",
    tags: ["mohinga","noodle","soup"],
    short: "Use mohinga paste + fish sauce to get close taste without full prep.",
    ingredients: [
      "Instant mohinga paste (market)",
      "Rice noodle",
      "Onion, garlic, lemongrass (if available)",
      "Boiled egg, cilantro, lime"
    ],
    steps: [
      "ရေနွေးတစ်ချက်ပြုတ်, mohinga paste ထည့်ရမယ့် ratio ကို pack instruction အတိုင်းလုပ်ပါ။",
      "ကြက်သွန်နီ၊ ကြက်သွန်ဖြူနဲ့ နံနံပင်သီးအနည်းငယ် ဆီထဲမှာဖုတ်ပေးပြီး hsaunt ထည့်ရိပ်ပါ။",
      "ခန့်သည့်အရည်ရလာရင် noodle ပေါင်းထည့်ပြီး serve လိုက်ပါ။",
      "Boiled egg, coriander, ထောပတ်သီးနဲ့ ပေါင်းသောက်လိုက်ရင် hostel version လည်း စိတ်ချမ်းသာလောက်ပါတယ်။"
    ]
  },
  {
    id: "tea-milk",
    name: "Myanmar Milk Tea (Easy Ratio)",
    category: "drink",
    time: 5,
    level: "easy",
    hero: "https://images.pexels.com/photos/1417945/pexels-photo-1417945.jpeg?auto=compress&w=800",
    tags: ["tea","drink"],
    short: "Standard shop-style taste using 3:1:1 ratio.",
    ingredients: [
      "Strong black tea",
      "Sweetened condensed milk",
      "Evaporated milk / fresh milk",
      "Sugar (optional)"
    ],
    steps: [
      "လက်ဖက်ရည်ကို အစက်ကြီးအနီရောင်ရအောင် အရမ်းချောကာချက်ပါ။",
      "ခွဲထားတဲ့ glass ထဲမှာ condensed milk (1 tbsp) + milk (1 tbsp) ထည့်ပါ။",
      "ပူနေတဲ့ strong tea ကို 3 portion လောက်ထည့်ပြီး လုံးဝရောကာ ခွက်အပြည့်ဖြည့်ပါ။",
      "နှစ်ချက်သုံးချက် ဆွဲထုတ်ဖွင့်ကာ ဆိုင်ကလေးအနည်းငယ်ထည့်ချင်းရင် ပြီးပါပြီ။"
    ]
  },
  {
    id: "shan-noodle",
    name: "Shan Noodle (Home Style)",
    category: "noodle",
    time: 30,
    level: "medium",
    hero: "https://images.pexels.com/photos/4193872/pexels-photo-4193872.jpeg?auto=compress&w=800",
    tags: ["noodle","shan"],
    short: "Simple version of shan noodle using chicken or pork.",
    ingredients: [
      "Rice noodle",
      "Chicken/pork mince",
      "Tomato, garlic, shallot",
      "Soy sauce, salt, chili oil"
    ],
    steps: [
      "Pan မှာကြက်သွန်နီ၊ ကြက်သွန်ဖြူနဲ့ mince ကို ဖုတ်ပါ။",
      "ချက်ထားတဲ့ ခရမ်းချဉ်သီးထည့်ပြီး ဆား၊ soy sauce နဲ့နည်းနည်းရည်ရှိအောင်ထားပါ။",
      "noodle ကိုပေါင်းပြီး ထမင်းပန်းကန်မှာထည့်, meat sauce + chili oil + crushed peanut + coriander ဖြူးပါ။",
      "အရသာ လိုသလို調整လုပ်ပါ။"
    ]
  },
  {
    id: "laphet-salad",
    name: "Laphet Thoke (Tea Leaf Salad)",
    category: "snack",
    time: 10,
    level: "easy",
    hero: "https://images.pexels.com/photos/4194610/pexels-photo-4194610.jpeg?auto=compress&w=800",
    tags: ["salad","laphet"],
    short: "Quick-balanced version with oil, nuts and veggies.",
    ingredients: [
      "Laphet (tea leave)",
      "Fried beans, peanuts, sesame",
      "Tomato, cabbage, garlic oil",
      "Lime, chili, dried shrimp (optional)"
    ],
    steps: [
      "Laphet ကို ဆီနဲ့နည်းနည်းညှိပေးပါ။",
      "ခရမ်းချဉ်သီး၊ လက်ဖက်၊ ပဲသီး, ထောပတ်သီး, သံပါးဖြူ အားလုံးထည့်ပြီးရောပါ။",
      "သံပုရာရည် နည်းနည်းဖိထည့်ပြီး ဆား ၊ msg မလိုအပ်နိုင်, ဇာဟိန်စကားနဲ့ထည့်ပါ။",
      "plate တစ်ခုနဲ့ အိမ်ထိုင်လာလို့ရပြီ။"
    ]
  },
  {
    id: "garlic-oil",
    name: "Garlic Oil & Chili Oil (Base)",
    category: "basic",
    time: 20,
    level: "easy",
    hero: "https://images.pexels.com/photos/4106483/pexels-photo-4106483.jpeg?auto=compress&w=800",
    tags: ["basic","oil","topping"],
    short: "Make once, use all week for noodles, rice and salads.",
    ingredients: [
      "Neutral oil",
      "Garlic (a lot)",
      "Chili flakes (for chili oil)",
      "Salt"
    ],
    steps: [
      "Pan အေးအေးထဲမှာ ဆီ + ချားထားတဲ့ ကြက်သွန်ဖြူ ထည့်ထားပြီးနိမ့်မီးပူကင်ပါ။",
      "သရေခါးရောင်လေးရောက်ရင် ထုတ်ထားပါ (မလွန်အောင်).",
      "Chili oil လုပ်ချင်ရင် ခဏခိုင်းထားတဲ့ပူဆီကို ခရမ်းမြီးမောင်းအနီထဲပိုင်းပါ။",
      "ဒယ်လံပန်းကန်ထဲထည့်ထားပြီး Noodle, rice, salad တွေအတွက် အသုံးပြုပါ။"
    ]
  }
];

// --- DOM helpers
const $ = (sel) => document.querySelector(sel);
const grid = $("#recipesGrid");
const heroToday = $("#heroToday");
const searchInput = $("#searchInput");
const filterCategory = $("#filterCategory");
const filterLevel = $("#filterLevel");
const filterTime = $("#filterTime");

function renderHero() {
  if (!heroToday) return;
  const picks = [...RECIPES].sort(() => Math.random() - 0.5).slice(0, 3);
  heroToday.innerHTML = picks.map(r => `
    <div class="hero-mini">
      <div class="thumb" style="background-image:url('${r.hero}')"></div>
      <div class="meta">
        <div class="title">${r.name}</div>
        <div class="sub">${r.time} min • ${labelLevel(r.level)}</div>
      </div>
    </div>
  `).join("");
}

function labelLevel(level) {
  if (level === "easy") return "Super Easy";
  if (level === "medium") return "Normal";
  if (level === "hard") return "Challenging";
  return level || "";
}

function matchFilters(r) {
  const q = (searchInput?.value || "").toLowerCase().trim();
  const cat = filterCategory?.value || "";
  const lvl = filterLevel?.value || "";
  const t = filterTime?.value || "";

  if (cat && r.category !== cat) return false;
  if (lvl && r.level !== lvl) return false;
  if (t) {
    const max = parseInt(t, 10);
    if (r.time > max) return false;
  }
  if (q) {
    const hay = (
      r.name + " " +
      (r.short || "") + " " +
      (r.tags || []).join(" ") + " " +
      (r.category || "")
    ).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

function renderGrid() {
  if (!grid) return;
  const items = RECIPES.filter(matchFilters);
  if (!items.length) {
    grid.innerHTML = `<div class="empty">No recipes found. Try a different keyword or category.</div>`;
    return;
  }

  grid.innerHTML = items.map(r => `
    <article class="card" data-id="${r.id}">
      <div class="card-media" style="background-image:url('${r.hero}')"></div>
      <div class="card-body">
        <h3 class="card-title">${r.name}</h3>
        <div class="card-meta">
          <span>${r.time} min</span>
          <span>${labelLevel(r.level)}</span>
          <span>${prettyCategory(r.category)}</span>
        </div>
        <p class="card-text">${r.short}</p>
      </div>
      <div class="card-tags">
        ${(r.tags || []).map(t=>`<span>#${t}</span>`).join("")}
      </div>
      <div class="card-actions">
        <button class="btn small outline" data-view="${r.id}">
          View steps
        </button>
      </div>
    </article>
  `).join("");
}

function prettyCategory(c) {
  switch(c) {
    case "daily": return "Daily";
    case "noodle": return "Noodle";
    case "snack": return "Snack";
    case "drink": return "Drink";
    case "onepot": return "One-Pot";
    case "basic": return "Basics";
    default: return c || "";
  }
}

// --- Modal
const modal = $("#recipeModal");
const modalContent = $("#modalContent");
const modalClose = $("#modalClose");

function openRecipe(id) {
  const r = RECIPES.find(x => x.id === id);
  if (!r || !modal || !modalContent) return;
  modalContent.innerHTML = `
    <div class="recipe-full">
      <div class="rf-hero" style="background-image:url('${r.hero}')"></div>
      <h2>${r.name}</h2>
      <div class="rf-meta">
        <span><i class="ri-time-line"></i> ${r.time} min</span>
        <span><i class="ri-sun-line"></i> ${labelLevel(r.level)}</span>
        <span><i class="ri-restaurant-2-line"></i> ${prettyCategory(r.category)}</span>
        <span><i class="ri-user-line"></i> ${r.serves || 2} ppl</span>
      </div>
      <p class="rf-short">${r.short}</p>
      <h3>Ingredients</h3>
      <ul class="rf-list">
        ${(r.ingredients || []).map(i=>`<li>${i}</li>`).join("")}
      </ul>
      <h3>Steps</h3>
      <ol class="rf-list">
        ${(r.steps || []).map(s=>`<li>${s}</li>`).join("")}
      </ol>
      <p class="rf-note">
        Tip: Adjust salt/oil to your family style. Save this recipe offline by screenshot or printing.
      </p>
    </div>
  `;
  modal.classList.remove("hidden");
  document.body.classList.add("modal-open");
}

function closeModal() {
  if (!modal) return;
  modal.classList.add("hidden");
  document.body.classList.remove("modal-open");
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) closeModal();
  });
}

// --- Events
if (searchInput) searchInput.addEventListener("input", renderGrid);
if (filterCategory) filterCategory.addEventListener("change", renderGrid);
if (filterLevel) filterLevel.addEventListener("change", renderGrid);
if (filterTime) filterTime.addEventListener("change", renderGrid);

if (grid) {
  grid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    openRecipe(btn.getAttribute("data-view"));
  });
}

// Init
renderHero();
renderGrid();