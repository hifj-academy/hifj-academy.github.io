/*!
 * বায়তুশ শরফ হিফজ একাডেমি — মূল ওয়েবসাইটের স্ক্রিপ্ট
 * ফাইল: assets/js/main.js   সংস্করণ: 3.0.0
 * কাজ: মেনু, নোটিশ, বই ও অর্ডার, ফি, ভর্তি ফরম লিংক — অফিস সফটওয়্যারের
 * Google Sheet (config.js-এর window.BJHA_API) থেকে লাইভ তথ্য এনে দেখায়।
 * লাইভ তথ্য না এলে এই ফাইলের নমুনা তথ্য দেখায়।
 */
const DIG="০১২৩৪৫৬৭৮৯", bn=s=>String(s??"").replace(/\d/g,d=>DIG[d]), $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const MONTHS=["জানু","ফেব্রু","মার্চ","এপ্রিল","মে","জুন","জুলাই","আগস্ট","সেপ্টে","অক্টো","নভে","ডিসে"];
const money=n=>"৳ "+bn(Math.round(n).toLocaleString("en-IN"));
function toast(m){const t=document.createElement("div");t.className="toast";t.textContent=m;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}
let WA="", FORM_ADM="";

/* মেনু */
const navwrap=$("navwrap"), menuBtn=$("menuBtn");
menuBtn.onclick=()=>{const o=navwrap.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o)};
document.querySelectorAll(".nav>li>button").forEach(b=>b.addEventListener("click",()=>{const o=b.getAttribute("aria-expanded")==="true";document.querySelectorAll(".nav>li>button").forEach(x=>x.setAttribute("aria-expanded","false"));b.setAttribute("aria-expanded",!o)}));
document.addEventListener("click",e=>{if(e.target.closest(".sub a")||(e.target.closest("#nav a"))){navwrap.classList.remove("open");document.querySelectorAll(".nav>li>button").forEach(x=>x.setAttribute("aria-expanded","false"))} else if(!e.target.closest(".nav")) document.querySelectorAll(".nav>li>button").forEach(x=>x.setAttribute("aria-expanded","false"))});
const totop=$("totop"); addEventListener("scroll",()=>{totop.hidden=scrollY<700},{passive:true}); totop.onclick=()=>scrollTo({top:0,behavior:"smooth"});

/* নোটিশ (সফটওয়্যার থেকে না এলে এগুলো দেখাবে) */
let NOTICES=[
 {d:"2026-10-01",tag:"ভর্তি",t:"২০২৭ শিক্ষাবর্ষে ভর্তি কার্যক্রম শুরু",p:"জেনারেল হিফজ, একাডেমিক হিফজ ও কিতাব বিভাগে ভর্তির আবেদন নেওয়া হচ্ছে।"},
 {d:"2026-12-01",tag:"ভর্তি",t:"শিক্ষার্থী ভর্তি পরীক্ষা — ডিসেম্বর ২০২৬",p:"সুনির্দিষ্ট তারিখ ও সময় আবেদনকারী অভিভাবকদের ফোনে জানানো হবে।"},
 {d:"2027-01-01",tag:"একাডেমিক",t:"ভবন উদ্বোধন ও সেমিস্টার-১ ক্লাস শুরু",p:"জানুয়ারি ২০২৭-এ ওরিয়েন্টেশনের মাধ্যমে নতুন শিক্ষাবর্ষের সূচনা।"}];
function renderNotices(){ $("noticeList").innerHTML=NOTICES.slice(0,6).map(n=>{const [y,m,d]=String(n.d).split("-");const day=d&&d!=="01";
  return `<article class="nitem"><div class="date"><b>${day?bn(+d):MONTHS[+m-1]}</b><span>${day?MONTHS[+m-1]+" ":""}${bn(y)}</span></div><div><span class="chip">${esc(n.tag)}</span><h3>${esc(n.t)}</h3>${n.p?`<p>${esc(n.p)}</p>`:""}</div></article>`}).join("")||`<p class="muted">এখন কোনো নোটিশ নেই।</p>`; }
renderNotices();

/* বই */
let BOOKS=[]; const SEED={"সমন্বিত পাঠ্যবই (বাংলা • English • গণিত)":["আমার প্রথম পাঠ","আমার দ্বিতীয় পাঠ","আমার তৃতীয় পাঠ","আমার চতুর্থ পাঠ","আমার পঞ্চম পাঠ","আমার ষষ্ঠ পাঠ"],"কুরআন ও হিফজ":["আদর্শ হিফজ কায়দা","আদর্শ হিফজ ডায়েরি","আদর্শ শিক্ষার্থী ডায়েরি"],"আরবি ভাষা":["আল আরবিয়্যাতু লিআওলাদিনা – ০১","সহজ নাহুমীর","আরবি শব্দার্থ সংকলন – ১ম শ্রেণি","আরবি শব্দার্থ সংকলন – ২য় শ্রেণি","আরবি শব্দার্থ সংকলন – ৩য় শ্রেণি","আরবি শব্দার্থ সংকলন – ৪র্থ শ্রেণি","আরবি শব্দার্থ সংকলন – ৫ম শ্রেণি","আরবি শব্দার্থ সংকলন – ৬ষ্ঠ শ্রেণি","শব্দার্থ সংকলন – এসো আরবি শিখি ১ম খণ্ড","শব্দার্থ সংকলন – এসো আরবি শিখি ২য় খণ্ড","শব্দার্থ সংকলন – এসো আরবি শিখি ৩য় খণ্ড","শব্দার্থ সংকলন – আত তামরিনুল কিতাবি","শব্দার্থ সংকলন – মুনশায়িব"],"ইংরেজি ভাষা":["ইংলিশ ফর ফিউচার","ইংলিশ ভোকাবুলারি – ১ম শ্রেণি","ইংলিশ ভোকাবুলারি – ২য় শ্রেণি","ইংলিশ ভোকাবুলারি – ৩য় শ্রেণি","ইংলিশ ভোকাবুলারি – ৪র্থ শ্রেণি","ইংলিশ ভোকাবুলারি – ৫ম শ্রেণি","ইংলিশ ভোকাবুলারি – ৬ষ্ঠ শ্রেণি"],"বিজ্ঞান ও প্রযুক্তি":["লিটল ইঞ্জিনিয়ার – ০১"],"শিক্ষক সহায়িকা":["আরবিতে ক্লাস পরিচালনা","ইংরেজিতে ক্লাস পরিচালনা"]};
let k=0; Object.entries(SEED).forEach(([c,ns])=>ns.forEach(n=>BOOKS.push({id:"s"+(++k),name:n,category:c,price:0,status:"",level:"",desc:"",featured:["আমার প্রথম পাঠ","আমার দ্বিতীয় পাঠ","আদর্শ হিফজ কায়দা"].includes(n)})));
const B=id=>BOOKS.find(b=>b.id===id);
function renderBooks(){
  const cls=["c1","c2","c3"]; const feat=BOOKS.filter(b=>b.featured).slice(0,3);
  $("bookList").innerHTML=feat.map((b,i)=>`<article class="book"><div class="cover ${cls[i%3]}"><div class="jacket"><div><div class="s">বায়তুশ শরফ হিফজ একাডেমি</div><div class="t">${esc(b.name)}</div></div><div class="geo"></div><div class="s">${esc(b.level||b.category)}</div></div></div>
   <div class="binfo"><div>${b.level?`<span class="chip">${esc(b.level)}</span> `:""}${b.status?`<span class="chip gold">${esc(b.status)}</span>`:""}</div><h3>${esc(b.name)}</h3>${b.desc?`<p>${esc(b.desc)}</p>`:""}
   <div class="buy">${b.price?`<span class="price">${money(b.price)}${b.mrp>b.price?`<s>${money(b.mrp)}</s>`:""}</span>`:`<span class="small muted">দাম জানতে যোগাযোগ করুন</span>`}<button class="btn brand" type="button" data-add="${b.id}">অর্ডারে যোগ</button></div></div></article>`).join("");
  const cats=[...new Set(BOOKS.map(b=>b.category))];
  $("catalog").innerHTML=cats.map(c=>`<div class="card cat"><h3>${esc(c)}</h3><ul class="blist">${BOOKS.filter(b=>b.category===c).map(b=>`<li><span>${esc(b.name)}${b.price?` <b style="white-space:nowrap">${money(b.price)}</b>`:""}${b.status&&b.status!=="প্রস্তুত"?` <span class="chip gold">${esc(b.status)}</span>`:""}</span><button type="button" data-add="${b.id}" data-pick="${b.id}">যোগ</button></li>`).join("")}</ul></div>`).join("");
  renderCart();
}

/* কার্ট */
let cart={}; try{cart=JSON.parse(localStorage.getItem("bjha_cart3")||"{}")||{}}catch(e){}
const count=()=>Object.values(cart).reduce((a,b)=>a+b,0);
function renderCart(){ for(const i in cart) if(!B(i)) delete cart[i];
  $("cartCount").textContent=bn(count());
  const ids=BOOKS.filter(b=>cart[b.id]);
  $("cartItems").innerHTML=ids.length?ids.map(b=>`<div class="citem"><div><b>${esc(b.name)}</b><div class="small muted">${bn(cart[b.id])} কপি${b.price?" × "+money(b.price):""}</div></div><div class="qty"><button type="button" data-dec="${b.id}" aria-label="কমান">−</button><span>${bn(cart[b.id])}</span><button type="button" data-add="${b.id}" aria-label="বাড়ান">+</button></div></div>`).join(""):`<p class="small muted">এখনো কোনো বই বাছাই করা হয়নি। প্রকাশনা অংশ থেকে “যোগ” চাপুন।</p>`;
  const tot=ids.reduce((a,b)=>a+(b.price||0)*cart[b.id],0); $("cartTotal").textContent=tot?`মোট (ডেলিভারি চার্জ ছাড়া): ${money(tot)}`:"দাম ও ডেলিভারি চার্জ অর্ডার নিশ্চিত করার সময় জানানো হবে।";
  document.querySelectorAll("[data-pick]").forEach(x=>{const n=cart[x.dataset.pick]||0;x.classList.toggle("added",n>0);x.textContent=n?bn(n)+" কপি":"যোগ"});
  try{localStorage.setItem("bjha_cart3",JSON.stringify(cart))}catch(e){} }
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]"), d=e.target.closest("[data-dec]"), c=e.target.closest("[data-copy]");
  if(a){cart[a.dataset.add]=(cart[a.dataset.add]||0)+1;renderCart();$("ordOut").hidden=true;if(!a.closest(".drawer"))toast("অর্ডারে যোগ হয়েছে")}
  if(d){cart[d.dataset.dec]--;if(cart[d.dataset.dec]<=0)delete cart[d.dataset.dec];renderCart();$("ordOut").hidden=true}
  if(c){const el=$(c.dataset.copy);try{navigator.clipboard.writeText(el.textContent).then(()=>toast("কপি হয়েছে"),()=>toast("সিলেক্ট করে কপি করুন"))}catch(x){}}
});
const openCart=()=>{$("drawer").hidden=false;document.body.style.overflow="hidden"}, closeCart=()=>{$("drawer").hidden=true;document.body.style.overflow=""};
$("cartOpen").onclick=openCart;$("cartClose").onclick=closeCart;$("shade").onclick=closeCart;addEventListener("keydown",e=>{if(e.key==="Escape")closeCart()});
$("orderForm").addEventListener("submit",e=>{e.preventDefault();const err=$("ordErr"),n=$("o_name").value.trim(),p=$("o_phone").value.trim(),ad=$("o_addr").value.trim();
  if(!count()){err.textContent="অন্তত একটি বই যোগ করুন।";err.hidden=false;return} if(!n||!p||!ad){err.textContent="নাম, মোবাইল ও ঠিকানা লিখুন।";err.hidden=false;return} err.hidden=true;
  const ids=BOOKS.filter(b=>cart[b.id]); const tot=ids.reduce((a,b)=>a+(b.price||0)*cart[b.id],0);
  const txt=`বইয়ের অর্ডার — বায়তুশ শরফ হিফজ একাডেমি\n\n${ids.map(b=>`• ${b.name} — ${bn(cart[b.id])} কপি${b.price?" ("+money(b.price*cart[b.id])+")":""}`).join("\n")}\n${tot?"মোট: "+money(tot)+" (ডেলিভারি চার্জ আলাদা)\n":""}\nনাম: ${n}\nমোবাইল: ${p}\nঠিকানা: ${ad}`;
  $("ordText").textContent=txt; const w=$("ordWa"); if(WA){w.href="https://wa.me/"+WA+"?text="+encodeURIComponent(txt);w.hidden=false} $("ordOut").hidden=false;});
renderBooks();

/* সফটওয়্যার থেকে আসা তথ্য */
function waNum(p){let d=String(p||"").replace(/[০-৯]/g,x=>DIG.indexOf(x)).replace(/\D/g,"");if(!d)return"";if(d.startsWith("880"))return d;if(d.startsWith("0"))return"88"+d;return d}
function apply(j){
  const st=j.settings||{};
  WA=waNum(st.whatsapp||"");
  const wa=$("svcWa"); if(WA){wa.href="https://wa.me/"+WA+"?text="+encodeURIComponent("আসসালামু আলাইকুম। ")} else {wa.href="tel:+8801820717177";wa.removeAttribute("target");wa.querySelector("span").textContent="০১৮২০৭১৭১৭৭"}
  FORM_ADM=st.formAdmission||"";
  if(FORM_ADM){document.querySelectorAll("[data-apply]").forEach(a=>{a.href=FORM_ADM;a.target="_blank";a.rel="noopener"});$("applyNote").textContent="ফরম পূরণের পর অফিস যাচাই করে যোগাযোগ করবে।"}
  else {$("applyBtn").href="#contact";$("applyBtn").removeAttribute("target")}
  if(st.formRequest){$("reqBox").hidden=false;$("reqLink").href=st.formRequest;$("svcReq").href=st.formRequest;$("svcReq").target="_blank"}
  const rb=$("ribbon"); if(st.admissionOpen===false) rb.hidden=true; else { rb.hidden=false; let t=`<b>${esc(st.admissionMsg||"ভর্তি চলছে: ২০২৭ শিক্ষাবর্ষ")}</b>`; if(st.admissionDeadline){const [y,m,d]=st.admissionDeadline.split("-");t+=` • আবেদনের শেষ তারিখ: ${bn(+d)} ${MONTHS[+m-1]} ${bn(y)}`} $("ribbonText").innerHTML=t; }
  if(j.stats&&j.stats.students){$("factStudents").innerHTML=`<b>${bn(j.stats.students)}</b><span>বর্তমান শিক্ষার্থী</span>`}
  if(j.fees&&(j.fees.nonRes||j.fees.res||(j.fees.heads||[]).length)){const f=j.fees;let rows="";
    (f.heads||[]).forEach(h=>rows+=`<tr><td>${esc(h.name)}</td><td>${money(h.amount)}</td></tr>`);
    if(f.nonRes) rows+=`<tr><td>মাসিক বেতন (অনাবাসিক)</td><td>${money(f.nonRes)}</td></tr>`; if(f.res) rows+=`<tr><td>মাসিক বেতন (আবাসিক)</td><td>${money(f.res)}</td></tr>`;
    $("feeBox").innerHTML=`<table class="fee">${rows}</table>`;}
  if(Array.isArray(j.notices)&&j.notices.length){NOTICES=j.notices.map(n=>({d:n.date,tag:n.tag||"সাধারণ",t:n.title,p:n.body}));renderNotices();$("noticeNote").textContent="সর্বশেষ নোটিশ অফিস থেকে সরাসরি হালনাগাদ হয়।"}
  if(Array.isArray(j.books)&&j.books.length){BOOKS=j.books.map(b=>({...b,price:Number(b.price)||0,mrp:Number(b.mrp)||0}));renderBooks()}
}
(function(){const API=(window.BJHA_API||"").trim(); if(!API) return;
  try{const c=JSON.parse(localStorage.getItem("bjha_pub2"));if(c&&c.ok)apply(c)}catch(e){}
  fetch(API+(API.includes("?")?"&":"?")+"action=public").then(r=>r.json()).then(j=>{if(j&&j.ok){try{localStorage.setItem("bjha_pub2",JSON.stringify(j))}catch(e){}apply(j)}}).catch(()=>{});
})();
