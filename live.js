/* সফটওয়্যার থেকে আসা তথ্য (গুগল শিট হয়ে) — নিজে থেকে হালনাগাদ */
(function(){
  const API = (window.BJHA_API || "").trim(); if(!API) return;
  try{ const c = JSON.parse(localStorage.getItem("bjha_pub")); if(c && c.ok) applyLive(c); }catch(e){}
  fetch(API + (API.includes("?") ? "&" : "?") + "action=public").then(r => r.json()).then(j => { if(j && j.ok){ try{ localStorage.setItem("bjha_pub", JSON.stringify(j)); }catch(e){} applyLive(j); } }).catch(() => {});
})();
const PRICE = {};
function applyLive(j){
  const st = j.settings || {}; const S = v => String(v ?? "");
  const strip = document.querySelector(".strip");
  if(strip){ if(st.admissionOpen === false) strip.hidden = true; else { strip.hidden = false; if(st.admissionMsg) strip.innerHTML = esc(S(st.admissionMsg)) + ' • <a href="#admission">আবেদন করুন</a>'; } }
  if(st.formAdmission && !$("liveForm")){ const h = document.querySelector("#admission .sec-head"); if(h){ const a = document.createElement("a"); a.id = "liveForm"; a.className = "btn gold"; a.style.justifySelf = "start"; a.style.background = "#e7c27a"; a.href = st.formAdmission; a.target = "_blank"; a.rel = "noopener"; a.textContent = "অনলাইনে ভর্তির আবেদন করুন →"; h.appendChild(a); } }
  if(st.formRequest && !$("liveReq")){ const c = document.querySelector("#contact .contact"); if(c){ const d = document.createElement("div"); d.className = "box"; d.id = "liveReq"; d.innerHTML = `<b>অভিযোগ ও অনুরোধ</b><p><a href="${esc(S(st.formRequest))}" target="_blank" rel="noopener">ফরম পূরণ করুন →</a></p>`; c.appendChild(d); } }
  if(j.stats && j.stats.students){ const f = document.querySelectorAll(".facts div"); if(f[1]){ f[1].innerHTML = `<b>${bn(j.stats.students)}</b><span>বর্তমান শিক্ষার্থী</span>`; } }
  if(Array.isArray(j.notices) && j.notices.length){
    NOTICES.length = 0; j.notices.forEach(n => NOTICES.push({ d:S(n.date), tag:S(n.tag)||"সাধারণ", t:S(n.title), p:S(n.body) }));
    tags.length = 0; tags.push("সব", ...new Set(NOTICES.map(n => n.tag))); cur = "সব"; renderNotices();
  }
  if(Array.isArray(j.books) && j.books.length){
    Object.keys(TITLE).forEach(k => delete TITLE[k]); ORDER.length = 0; CATS.length = 0;
    const byCat = {}; j.books.forEach(b => { const c = S(b.category)||"অন্যান্য"; if(!byCat[c]){ byCat[c] = { name:c, items:[] }; CATS.push(byCat[c]); } byCat[c].items.push([b.id, S(b.name)]); TITLE[b.id] = S(b.name) + (b.price ? " (৳" + bn(b.price) + ")" : ""); PRICE[b.id] = b; ORDER.push(b.id); });
    for(const k in cart) if(!TITLE[k]) delete cart[k];
    const cls = ["c1","c2","c3"]; const feat = j.books.filter(b => b.featured).slice(0,3);
    if(feat.length) $("bookList").innerHTML = feat.map((b,i) => `<article class="book"><div class="cover ${cls[i%3]}"><div class="jacket"><div><div class="s">বায়তুশ শরফ হিফজ একাডেমি</div><div class="t">${esc(S(b.name))}</div></div><div class="geo"></div><div class="s">${esc(S(b.level||b.category))}</div></div></div>
      <div class="binfo"><div class="meta">${b.level?`<span class="chip">${esc(S(b.level))}</span>`:""}${b.status?`<span class="chip new">${esc(S(b.status))}</span>`:""}</div><h3>${esc(S(b.name))}</h3>${b.desc?`<p>${esc(S(b.desc))}</p>`:""}
      <div class="buy">${b.price?`<span class="price">৳ ${bn(b.price)}${b.mrp>b.price?`<s>৳ ${bn(b.mrp)}</s>`:""}</span>`:`<span class="small">দাম জানতে যোগাযোগ করুন</span>`}<button class="btn brand" type="button" data-add="${esc(b.id)}">অর্ডারে যোগ</button></div></div></article>`).join("");
    $("catalog").innerHTML = CATS.map(c => `<div class="box cat"><h3>${esc(c.name)}</h3><ul class="blist">${c.items.map(([id,t]) => { const b = PRICE[id]; return `<li><span>${esc(t)}${b.price?` <b style="white-space:nowrap">৳ ${bn(b.price)}</b>`:""}${b.status&&b.status!=="প্রস্তুত"?` <span class="chip new">${esc(S(b.status))}</span>`:""}</span><button type="button" data-add="${esc(id)}" data-pick="${esc(id)}">যোগ</button></li>`; }).join("")}</ul></div>`).join("");
    renderCart();
  }
}
renderNotices = function(){
  $("filters").innerHTML = tags.map(t => `<button type="button" aria-pressed="${t===cur}" data-tag="${esc(t)}">${esc(t)}</button>`).join("");
  $("noticeList").innerHTML = NOTICES.filter(n => cur==="সব" || n.tag===cur).map(n => { const [y,m,d] = n.d.split("-");
    return `<article class="notice"><div class="date"><b>${d && d!=="01" ? bn(+d) : MONTHS[+m-1]}</b><span>${d && d!=="01" ? MONTHS[+m-1]+" " : ""}${bn(y)}</span></div><div><span class="chip">${esc(n.tag)}</span><h3>${esc(n.t)}</h3><p style="white-space:pre-line">${esc(n.p)}</p></div></article>`; }).join("") || `<p class="small">এখন কোনো নোটিশ নেই।</p>`;
};
