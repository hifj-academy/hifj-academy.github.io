/*!
 * বায়তুশ শরফ হিফজ একাডেমি — অভিভাবক পোর্টাল: শিক্ষার্থী আইডি + পিন দিয়ে লগইন, হাজিরা ও ফি দেখা
 * ফাইল: assets/js/portal.js   সংস্করণ: 3.0.0
 */
const API = (window.BJHA_API || "").trim();
const DIG = "০১২৩৪৫৬৭৮৯";
const bn = s => String(s ?? "").replace(/\d/g, d => DIG[d]);
const en = s => String(s ?? "").replace(/[০-৯]/g, d => DIG.indexOf(d));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MONTHS = ["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const mName = ym => { if(!ym) return ""; const [y,m] = ym.split("-"); return MONTHS[+m-1] + " " + bn(y); };
const dFmt = s => { if(!s) return "—"; const [y,m,d] = String(s).slice(0,10).split("-"); return bn(+d) + " " + MONTHS[+m-1] + " " + bn(y); };
const money = n => "৳ " + bn(Math.round(Number(n)||0).toLocaleString("en-IN"));
const app = document.getElementById("app");

function loginView(err){
  app.innerHTML = `<div class="card login"><h1>অভিভাবক লগইন</h1><p class="muted small">ভর্তির সময় হোয়াটসঅ্যাপে পাওয়া শিক্ষার্থী আইডি ও পিন দিন।</p>
  ${!API ? `<div class="err">লগইন এখনো চালু হয়নি। অনুগ্রহ করে পরে চেষ্টা করুন।</div>` : ""}${err ? `<div class="err">${esc(err)}</div>` : ""}
  <form id="f"><label>শিক্ষার্থী আইডি<input id="sid" required autocomplete="username" placeholder="যেমন: STD-101"></label>
  <label>পিন<input id="pin" required type="password" inputmode="numeric" autocomplete="current-password"></label>
  <button class="btn" id="go" ${API?"":"disabled"}>প্রবেশ করুন</button></form>
  <p class="small muted" style="margin-top:14px">পিন ভুলে গেলে অফিসে যোগাযোগ করুন, নতুন পিন হোয়াটসঅ্যাপে পাঠানো হবে।</p></div>`;
  document.getElementById("f").onsubmit = async e => {
    e.preventDefault(); const b = document.getElementById("go"); b.disabled = true; b.textContent = "যাচাই হচ্ছে…";
    try{
      const r = await fetch(API, { method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify({ action:"portal", sid: en(document.getElementById("sid").value).trim(), pin: en(document.getElementById("pin").value).trim() }) });
      const j = await r.json();
      if(!j.ok) return loginView(j.error || "লগইন হয়নি");
      try{ sessionStorage.setItem("bjha_portal", JSON.stringify(j)); }catch(x){}
      dash(j);
    }catch(x){ loginView("সংযোগে সমস্যা হয়েছে। ইন্টারনেট দেখে আবার চেষ্টা করুন।"); }
  };
}

function dash(j){
  const s = j.student, f = j.fees, a = j.attendance;
  const ms = Object.keys(a.months || {}).sort().reverse();
  const cur = (a.months||{})[ms[0]] || {P:0,A:0,L:0}; const t = cur.P + cur.A + cur.L;
  app.innerHTML = `<div class="top"><div><h1>${esc(s.name)}</h1><p class="muted" style="margin:4px 0 0">আইডি: <b>${esc(s.id)}</b> • ${esc(s.className)}${s.dept?" ("+esc(s.dept)+")":""}${s.group?" • "+esc(s.group):""}</p></div><button class="btn l" id="out">লগআউট</button></div>
  <div class="grid">
    <div class="stat"><span>${ms[0]?mName(ms[0]):"এ মাস"} — উপস্থিতি</span><b>${t?bn(Math.round(cur.P*100/t))+"%":"—"}</b><span>${bn(cur.P)} দিন উপস্থিত, ${bn(cur.A)} দিন অনুপস্থিত</span></div>
    <div class="stat"><span>বকেয়া</span><b style="color:${f.dueAmount?"var(--bad)":"var(--ok)"}">${f.dueAmount?money(f.dueAmount):"নেই"}</b><span>${f.dueMonths.length?f.dueMonths.map(mName).join(", "):"আলহামদুলিল্লাহ, সব পরিশোধিত"}</span></div>
    <div class="stat"><span>মাসিক বেতন</span><b>${money(s.monthlyFee)}</b><span>${esc(s.residential||"")}</span></div>
    ${s.hifz?`<div class="stat"><span>হিফজ অগ্রগতি</span><b style="font-size:1.2rem">${esc(s.hifz)}</b></div>`:""}
  </div>
  ${(j.progress||[]).length?`<div class="card"><h2>মাসিক অগ্রগতি</h2><div class="tw"><table><tr><th>মাস</th><th>হিফজ</th><th>পড়ালেখা</th><th>আদব-আচরণ</th><th>উস্তাদের মন্তব্য</th></tr>
  ${j.progress.map(p=>`<tr><td>${mName(p.month)}</td><td>${p.para!=null&&p.para!==""?"মোট "+bn(p.para)+" পারা"+(p.newPara>0?" (নতুন "+bn(p.newPara)+")":""):""}${p.hifzGrade?"<br><span class='small muted'>"+esc(p.hifzGrade)+"</span>":""}</td><td>${esc(p.studyGrade||"—")}</td><td>${esc(p.adabGrade||"—")}</td><td class="small">${esc(p.note||"")}</td></tr>`).join("")}</table></div></div>`:""}
  <div class="card"><h2>হাজিরা (শেষ ছয় মাস)</h2><div class="tw"><table><tr><th>মাস</th><th>উপস্থিত</th><th>অনুপস্থিত</th><th>ছুটি</th><th>হার</th></tr>
  ${ms.map(m=>{const x=a.months[m], n=x.P+x.A+x.L; return `<tr><td>${mName(m)}</td><td>${bn(x.P)}</td><td>${bn(x.A)}</td><td>${bn(x.L)}</td><td>${n?bn(Math.round(x.P*100/n))+"%":"—"}</td></tr>`;}).join("")}</table></div>
  ${a.recent && a.recent.length?`<p class="small muted" style="margin:10px 0 0">সাম্প্রতিক অনুপস্থিতি/ছুটি: ${a.recent.map(r=>dFmt(r.date)+(r.v==="A"?" (অনুপস্থিত)":" (ছুটি)")).join(", ")}</p>`:""}</div>
  <div class="card"><h2>ফি পরিশোধের ইতিহাস</h2>${f.payments.length?`<div class="tw"><table><tr><th>রসিদ</th><th>তারিখ</th><th>বিবরণ</th><th>টাকা</th></tr>${f.payments.map(p=>`<tr><td>${esc(p.receiptNo)}</td><td>${dFmt(p.date)}</td><td class="small">${p.items.map(i=>esc(i.head)+(i.month?" ("+mName(i.month)+")":"")).join(", ")}</td><td>${money(p.total)}</td></tr>`).join("")}</table></div>`:`<p class="muted">এখনো কোনো পরিশোধের তথ্য নেই।</p>`}</div>
  <div class="card"><h2>যোগাযোগ</h2><p>শিক্ষার্থী সম্পর্কে কোনো প্রশ্ন, অভিযোগ বা ছুটির আবেদন থাকলে ${j.inst.formRequest?`<a href="${esc(j.inst.formRequest)}" target="_blank" rel="noopener">এই ফরম পূরণ করুন</a> অথবা `:""}অফিসে যোগাযোগ করুন: <b>${esc(j.inst.phones)}</b></p>
  <p class="small muted">তথ্য সর্বশেষ অফিস-সিঙ্ক অনুযায়ী। ভর্তির তারিখ: ${dFmt(s.admissionDate)}</p></div>`;
  document.getElementById("out").onclick = () => { try{ sessionStorage.removeItem("bjha_portal"); }catch(x){} loginView(); };
}

let saved = null; try{ saved = JSON.parse(sessionStorage.getItem("bjha_portal")); }catch(x){}
saved && saved.ok ? dash(saved) : loginView();
