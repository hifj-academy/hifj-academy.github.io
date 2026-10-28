/* অফলাইনে চালানোর জন্য। ইন্টারনেট থাকলে সবসময় নতুন সংস্করণ নেয়, না থাকলে জমা রাখা কপি চালায়। */
const VERSION = "bjha-office-1.5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES.map(f => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request; const url = new URL(req.url);
  if(req.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    try{
      const r = await fetch(req, { cache: "no-cache" });
      if(r && r.ok) c.put(req, r.clone());
      return r;
    }catch(err){
      return (await c.match(req, { ignoreSearch: true })) || (await c.match("./index.html"));
    }
  })());
});
