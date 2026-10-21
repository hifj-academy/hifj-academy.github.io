/*!
 * বায়তুশ শরফ হিফজ একাডেমি — ওয়েবসাইটের স্ক্রিপ্ট (সব পাতায় একই ফাইল)
 * ফাইল: assets/js/site.js   সংস্করণ: 4.0.0
 * কাজ: মেনু, চলমান নোটিশ, নোটিশ বোর্ড, ভর্তি ফরম, ফি, বই ও অর্ডার।
 * অফিস সফটওয়্যারের Google Sheet (config.js-এর window.BJHA_API) থেকে লাইভ তথ্য আনে;
 * না এলে এই ফাইলের নমুনা তথ্য দেখায়। প্রতিটি অংশ শুধু সেই পাতায় চলে যেখানে তার ঘর আছে।
 */
(function(){
"use strict";
const DIG="০১২৩৪৫৬৭৮৯", bn=s=>String(s??"").replace(/\d/g,d=>DIG[d]), $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MONTHS=["জানুয়ারি","ফেব্রুয়ারি","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টেম্বর","অক্টোবর","নভেম্বর","ডিসেম্বর"];
const MS=["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টে","অক্টো","নভে","ডিসে"];
const money=n=>"৳ "+bn(Math.round(n).toLocaleString("en-IN"));
const PHONE="০১৮২০৭১৭১৭৭", PHONE_TEL="+8801820717177";
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
let WA="";

/* ---------- তারিখ (উপরের লাইনে) ---------- */
const today=$("today"); if(today){const d=new Date();today.textContent=`${bn(d.getDate())} ${MONTHS[d.getMonth()]} ${bn(d.getFullYear())}`}

/* ---------- মেনু ---------- */
const mwrap=$("mwrap"), tog=$("navTog");
if(tog&&mwrap) tog.onclick=()=>{const o=mwrap.classList.toggle("open");tog.setAttribute("aria-expanded",o)};
const dds=[...document.querySelectorAll(".pnav .dd>button")];
dds.forEach(b=>b.addEventListener("click",()=>{const o=b.getAttribute("aria-expanded")==="true";dds.forEach(x=>x.setAttribute("aria-expanded","false"));b.setAttribute("aria-expanded",String(!o))}));
document.addEventListener("click",e=>{if(!e.target.closest(".pnav .dd"))dds.forEach(x=>x.setAttribute("aria-expanded","false"))});
addEventListener("keydown",e=>{if(e.key==="Escape")dds.forEach(x=>x.setAttribute("aria-expanded","false"))});
const totop=$("totop"); if(totop){addEventListener("scroll",()=>{totop.hidden=scrollY<700},{passive:true});totop.onclick=()=>scrollTo({top:0,behavior:"smooth"})}

/* ---------- নোটিশ ---------- */
let NOTICES=[
 {id:"n1",d:"2026-10-01",tag:"ভর্তি",t:"২০২৭ শিক্ষাবর্ষে ভর্তি কার্যক্রম শুরু",p:"জেনারেল হিফজ, একাডেমিক হিফজ ও কিতাব বিভাগে ভর্তির আবেদন নেওয়া হচ্ছে।"},
 {id:"n2",d:"2026-12-01",tag:"ভর্তি",t:"শিক্ষার্থী ভর্তি পরীক্ষা — ডিসেম্বর ২০২৬",p:"সুনির্দিষ্ট তারিখ ও সময় আবেদনকারী অভিভাবকদের ফোনে জানানো হবে।"},
 {id:"n3",d:"2027-01-01",tag:"একাডেমিক",t:"ভবন উদ্বোধন ও সেমিস্টার-১ ক্লাস শুরু",p:"জানুয়ারি ২০২৭-এ ওরিয়েন্টেশনের মাধ্যমে নতুন শিক্ষাবর্ষের সূচনা।"}];
function dateBox(s){const [y,m,d]=String(s).split("-");const day=d&&d!=="01";return `<div class="dt"><b>${day?bn(+d):MS[+m-1]||""}</b><span>${day?(MS[+m-1]||"")+" ":""}${bn(y)}</span></div>`}
function renderNotices(){
  const tr=$("tickerTrack");
  if(tr) tr.innerHTML=NOTICES.slice(0,8).map(n=>`<a href="notices.html#${esc(n.id)}">${esc(n.t)}</a>`).join("")||`<a href="notices.html">নোটিশ বোর্ড দেখুন</a>`;
  const home=$("noticeHome");
  if(home) home.innerHTML=NOTICES.slice(0,5).map(n=>`<li>${dateBox(n.d)}<div><h3><a href="notices.html#${esc(n.id)}" style="color:inherit;text-decoration:none">${esc(n.t)}</a></h3><p><span class="tag">${esc(n.tag)}</span></p></div></li>`).join("")||`<li><p class="muted">এখন কোনো নোটিশ নেই।</p></li>`;
  const all=$("noticeAll");
  if(all) all.innerHTML=NOTICES.map(n=>`<li id="${esc(n.id)}">${dateBox(n.d)}<div><h3>${esc(n.t)}</h3><p><span class="tag">${esc(n.tag)}</span>${esc(n.p||"")}</p></div></li>`).join("")||`<li><p class="muted">এখন কোনো নোটিশ নেই।</p></li>`;
}
renderNotices();

/* ---------- বই ও অর্ডার (শুধু প্রকাশনা পাতায়) ---------- */
let BOOKS=[]; const SEED={"সমন্বিত পাঠ্যবই (বাংলা • English • গণিত)":["আমার প্রথম পাঠ","আমার দ্বিতীয় পাঠ","আমার তৃতীয় পাঠ","আমার চতুর্থ পাঠ","আমার পঞ্চম পাঠ","আমার ষষ্ঠ পাঠ"],"কুরআন ও হিফজ":["আদর্শ হিফজ কায়দা","আদর্শ হিফজ ডায়েরি","আদর্শ শিক্ষার্থী ডায়েরি"],"আরবি ভাষা":["আল আরবিয়্যাতু লিআওলাদিনা – ০১","সহজ নাহুমীর","আরবি শব্দার্থ সংকলন – ১ম শ্রেণি","আরবি শব্দার্থ সংকলন – ২য় শ্রেণি","আরবি শব্দার্থ সংকলন – ৩য় শ্রেণি","আরবি শব্দার্থ সংকলন – ৪র্থ শ্রেণি","আরবি শব্দার্থ সংকলন – ৫ম শ্রেণি","আরবি শব্দার্থ সংকলন – ৬ষ্ঠ শ্রেণি","শব্দার্থ সংকলন – এসো আরবি শিখি ১ম খণ্ড","শব্দার্থ সংকলন – এসো আরবি শিখি ২য় খণ্ড","শব্দার্থ সংকলন – এসো আরবি শিখি ৩য় খণ্ড","শব্দার্থ সংকলন – আত তামরিনুল কিতাবি","শব্দার্থ সংকলন – মুনশায়িব"],"ইংরেজি ভাষা":["ইংলিশ ফর ফিউচার","ইংলিশ ভোকাবুলারি – ১ম শ্রেণি","ইংলিশ ভোকাবুলারি – ২য় শ্রেণি","ইংলিশ ভোকাবুলারি – ৩য় শ্রেণি","ইংলিশ ভোকাবুলারি – ৪র্থ শ্রেণি","ইংলিশ ভোকাবুলারি – ৫ম শ্রেণি","ইংলিশ ভোকাবুলারি – ৬ষ্ঠ শ্রেণি"],"বিজ্ঞান ও প্রযুক্তি":["লিটল ইঞ্জিনিয়ার – ০১"],"শিক্ষক সহায়িকা":["আরবিতে ক্লাস পরিচালনা","ইংরেজিতে ক্লাস পরিচালনা"]};
let k=0; Object.entries(SEED).forEach(([c,ns])=>ns.forEach(n=>BOOKS.push({id:"s"+(++k),name:n,category:c,price:0,status:"",level:"",desc:"",featured:["আমার প্রথম পাঠ","আমার দ্বিতীয় পাঠ","আদর্শ হিফজ কায়দা"].includes(n)})));
const B=id=>BOOKS.find(b=>b.id===id);
let cart={}; try{cart=JSON.parse(localStorage.getItem("bjha_cart3")||"{}")||{}}catch(e){}
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function renderBooks(){
  if(!$("bookList")) return;
  const cls=["c1","c2","c3"]; const feat=BOOKS.filter(b=>b.featured).slice(0,3);
  $("bookList").innerHTML=feat.map((b,i)=>`<article class="book"><div class="cover ${cls[i%3]}"><div class="jacket"><div><div class="s">বায়তুশ শরফ হিফজ একাডেমি</div><div class="t">${esc(b.name)}</div></div><div class="geo"></div><div class="s">${esc(b.level||b.category)}</div></div></div>
   <div class="binfo"><div>${b.level?`<span class="chip">${esc(b.level)}</span> `:""}${b.status?`<span class="chip gold">${esc(b.status)}</span>`:""}</div><h3>${esc(b.name)}</h3>${b.desc?`<p>${esc(b.desc)}</p>`:""}
   <div class="buy">${b.price?`<span class="price">${money(b.price)}${b.mrp>b.price?`<s>${money(b.mrp)}</s>`:""}</span>`:`<span class="small muted">দাম জানতে যোগাযোগ করুন</span>`}<button class="btn brand" type="button" data-add="${b.id}">অর্ডারে যোগ</button></div></div></article>`).join("");
  const cats=[...new Set(BOOKS.map(b=>b.category))];
  $("catalog").innerHTML=cats.map(c=>`<div class="card cat"><h3>${esc(c)}</h3><ul class="blist">${BOOKS.filter(b=>b.category===c).map(b=>`<li><span>${esc(b.name)}${b.price?` <b style="white-space:nowrap">${money(b.price)}</b>`:""}${b.status&&b.status!=="প্রস্তুত"?` <span class="chip gold">${esc(b.status)}</span>`:""}</span><button type="button" data-add="${b.id}" data-pick="${b.id}">যোগ</button></li>`).join("")}</ul></div>`).join("");
  renderCart();
}
function renderCart(){
  if(!$("drawer")) return;
  for(const i in cart) if(!B(i)) delete cart[i];
  $("cartCount").textContent=bn(count());
  const ids=BOOKS.filter(b=>cart[b.id]);
  $("cartItems").innerHTML=ids.length?ids.map(b=>`<div class="citem"><div><b>${esc(b.name)}</b><div class="small muted">${bn(cart[b.id])} কপি${b.price?" × "+money(b.price):""}</div></div><div class="qty"><button type="button" data-dec="${b.id}" aria-label="কমান">−</button><span>${bn(cart[b.id])}</span><button type="button" data-add="${b.id}" aria-label="বাড়ান">+</button></div></div>`).join(""):`<p class="small muted">এখনো কোনো বই বাছাই করা হয়নি। তালিকা থেকে “যোগ” চাপুন।</p>`;
  const tot=ids.reduce((a,b)=>a+(b.price||0)*cart[b.id],0); $("cartTotal").textContent=tot?`মোট (ডেলিভারি চার্জ ছাড়া): ${money(tot)}`:"দাম ও ডেলিভারি চার্জ অর্ডার নিশ্চিত করার সময় জানানো হবে।";
  document.querySelectorAll("[data-pick]").forEach(x=>{const n=cart[x.dataset.pick]||0;x.classList.toggle("added",n>0);x.textContent=n?bn(n)+" কপি":"যোগ"});
  try{localStorage.setItem("bjha_cart3",JSON.stringify(cart))}catch(e){}
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]"), d=e.target.closest("[data-dec]"), c=e.target.closest("[data-copy]");
  if(a){cart[a.dataset.add]=(cart[a.dataset.add]||0)+1;renderCart();if($("ordOut"))$("ordOut").hidden=true;if(!a.closest(".drawer"))toast("অর্ডারে যোগ হয়েছে")}
  if(d){cart[d.dataset.dec]--;if(cart[d.dataset.dec]<=0)delete cart[d.dataset.dec];renderCart();if($("ordOut"))$("ordOut").hidden=true}
  if(c){const el=$(c.dataset.copy);try{navigator.clipboard.writeText(el.textContent).then(()=>toast("কপি হয়েছে"),()=>toast("সিলেক্ট করে কপি করুন"))}catch(x){}}
});
if($("drawer")){
  const openCart=()=>{$("drawer").hidden=false;document.body.style.overflow="hidden"}, closeCart=()=>{$("drawer").hidden=true;document.body.style.overflow=""};
  $("cartOpen").onclick=openCart;$("cartClose").onclick=closeCart;$("shade").onclick=closeCart;addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
  $("orderForm").addEventListener("submit",e=>{e.preventDefault();const err=$("ordErr"),n=$("o_name").value.trim(),p=$("o_phone").value.trim(),ad=$("o_addr").value.trim();
    if(!count()){err.textContent="অন্তত একটি বই যোগ করুন।";err.hidden=false;return} if(!n||!p||!ad){err.textContent="নাম, মোবাইল ও ঠিকানা লিখুন।";err.hidden=false;return} err.hidden=true;
    const ids=BOOKS.filter(b=>cart[b.id]); const tot=ids.reduce((a,b)=>a+(b.price||0)*cart[b.id],0);
    const txt=`বইয়ের অর্ডার — বায়তুশ শরফ হিফজ একাডেমি\n\n${ids.map(b=>`• ${b.name} — ${bn(cart[b.id])} কপি${b.price?" ("+money(b.price*cart[b.id])+")":""}`).join("\n")}\n${tot?"মোট: "+money(tot)+" (ডেলিভারি চার্জ আলাদা)\n":""}\nনাম: ${n}\nমোবাইল: ${p}\nঠিকানা: ${ad}`;
    $("ordText").textContent=txt; const w=$("ordWa"); if(WA){w.href="https://wa.me/"+WA+"?text="+encodeURIComponent(txt);w.hidden=false} $("ordOut").hidden=false;});
}
renderBooks();

/* ---------- ভর্তি ফরম ---------- */
function setAdmission(st){
  const open=st.admissionOpen!==false, url=st.formAdmission||"";
  const msg=$("admMsg"), dl=$("admDeadline");
  let deadline=""; if(st.admissionDeadline){const [y,m,d]=st.admissionDeadline.split("-");deadline=`আবেদনের শেষ তারিখ: ${bn(+d)} ${MONTHS[+m-1]} ${bn(y)}`}
  if(msg) msg.textContent=open?(st.admissionMsg||"ভর্তি চলছে: ২০২৭ শিক্ষাবর্ষ"):"এই মুহূর্তে ভর্তির আবেদন বন্ধ আছে। পরবর্তী ঘোষণার জন্য নোটিশ বোর্ড দেখুন।";
  if(dl) dl.textContent=open?deadline:"";
  const box=$("admForm"); if(!box) return;
  const fr=$("admFrame"), off=$("admOff"), nt=$("admNewTab");
  const embeddable=/^https:\/\/docs\.google\.com\/forms\//.test(url);
  if(open&&url){
    nt.href=url; nt.hidden=false;
    if(embeddable){ if(!fr.src) fr.src=url+(url.includes("?")?"&":"?")+"embedded=true"; fr.hidden=false; off.hidden=true; }
    else { fr.hidden=true; off.hidden=false; off.querySelector("p").textContent="নিচের বোতাম চাপলে ভর্তির আবেদন ফরম খুলবে।"; const b=off.querySelector("a"); b.href=url; b.target="_blank"; b.rel="noopener"; b.textContent="আবেদন ফরম খুলুন ↗"; }
  } else {
    fr.hidden=true; off.hidden=false; nt.hidden=true;
    off.querySelector("p").textContent=open?"অনলাইন ফরম শিগগির চালু হবে। এখন অফিসে এসে বা ফোনে আবেদন করা যাবে।":"এই মুহূর্তে অনলাইন আবেদন বন্ধ আছে।";
  }
}
setAdmission({});

/* ---------- অফিস সফটওয়্যার থেকে আসা তথ্য ---------- */
function waNum(p){let d=String(p||"").replace(/[০-৯]/g,x=>DIG.indexOf(x)).replace(/\D/g,"");if(!d)return"";if(d.startsWith("880"))return d;if(d.startsWith("0"))return"88"+d;return d}
function apply(j){
  const st=j.settings||{};
  WA=waNum(st.whatsapp||"");
  document.querySelectorAll("[data-wa]").forEach(a=>{ if(WA){a.href="https://wa.me/"+WA+"?text="+encodeURIComponent("আসসালামু আলাইকুম। ");a.target="_blank";a.rel="noopener";a.hidden=false} });
  if(st.formRequest) document.querySelectorAll("[data-req]").forEach(a=>{a.href=st.formRequest;a.target="_blank";a.rel="noopener";a.hidden=false});
  setAdmission(st);
  const sc=$("statStudents"); if(sc&&j.stats&&j.stats.students) sc.textContent=bn(j.stats.students);
  const fb=$("feeBox");
  if(fb&&j.fees&&(j.fees.nonRes||j.fees.res||(j.fees.heads||[]).length)){const f=j.fees;let rows="";
    (f.heads||[]).forEach(h=>rows+=`<tr><td>${esc(h.name)}</td><td>${money(h.amount)}</td></tr>`);
    if(f.nonRes) rows+=`<tr><td>মাসিক বেতন (অনাবাসিক)</td><td>${money(f.nonRes)}</td></tr>`; if(f.res) rows+=`<tr><td>মাসিক বেতন (আবাসিক)</td><td>${money(f.res)}</td></tr>`;
    fb.innerHTML=`<table class="fee">${rows}</table>`;}
  if(Array.isArray(j.notices)&&j.notices.length){NOTICES=j.notices.map(n=>({id:n.id||"",d:n.date,tag:n.tag||"সাধারণ",t:n.title,p:n.body}));renderNotices();const nn=$("noticeNote");if(nn)nn.textContent="নোটিশ অফিস থেকে সরাসরি হালনাগাদ হয়।"}
  if(Array.isArray(j.books)&&j.books.length){BOOKS=j.books.map(b=>({...b,price:Number(b.price)||0,mrp:Number(b.mrp)||0}));renderBooks()}
  if(location.hash){const t=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(t&&!t.dataset.seen){t.dataset.seen=1;setTimeout(()=>t.scrollIntoView(),50)}}
}
const API=(window.BJHA_API||"").trim();
if(API){
  try{const c=JSON.parse(localStorage.getItem("bjha_pub2"));if(c&&c.ok)apply(c)}catch(e){}
  fetch(API+(API.includes("?")?"&":"?")+"action=public").then(r=>r.json()).then(j=>{if(j&&j.ok){try{localStorage.setItem("bjha_pub2",JSON.stringify(j))}catch(e){}apply(j)}}).catch(()=>{});
}
})();
