import { db } from "./firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

async function loadRecipes() {
  const ref = collection(db, "recipes");
  const snap = await getDocs(ref);
  const grid = document.getElementById("recipeGrid");
  grid.innerHTML = "";
  snap.forEach((doc) => {
    const r = doc.data();
    grid.innerHTML += `
      <div class="card">
        <img src="${r.image}" alt="${r.title}">
        <div class="card-content">
          <h3>${r.title_mm}</h3>
          <p>${r.category}</p>
          <a href="#" class="btn">ကြည့်မယ်</a>
        </div>
      </div>`;
  });
}
window.addEventListener("DOMContentLoaded", loadRecipes);
