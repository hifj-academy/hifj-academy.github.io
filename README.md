# বায়তুশ শরফ হিফজ একাডেমি — ওয়েবসাইট

খাগড়াছড়ি বায়তুশ শরফ জব্বারিয়া ইন্টারন্যাশনাল হিফজ একাডেমির অফিসিয়াল ওয়েবসাইট, অভিভাবক পোর্টাল ও অফিস ম্যানেজমেন্ট অ্যাপ (PWA)।

- লাইভ সাইট: https://hifj-academy.github.io/
- সংস্করণ: 3.0.0 (দেখুন `CHANGELOG.md`)
- প্রযুক্তি: Static HTML/CSS/vanilla JS (কোনো build step বা framework নেই), Google Apps Script + Google Sheets (ডেটা ও API)

## আর্কিটেকচার

```
অফিস অ্যাপ (office/, অফলাইন PWA, IndexedDB)
        │  সিঙ্ক (POST, গোপন SYNC_KEY সহ)
        ▼
Google Apps Script Web App  ──►  Google Sheet (মূল ডেটাবেস)
        │  GET ?action=public  (শুধু প্রকাশিত তথ্য, ক্যাশড)
        │  POST action=portal  (শিক্ষার্থী আইডি + পিন)
        ▼
ওয়েবসাইট (index.html)  ও  অভিভাবক পোর্টাল (student.html)
```

## ফোল্ডার কাঠামো

| পথ | কাজ |
|---|---|
| `index.html` | মূল ওয়েবসাইট (সব অংশ এক পাতায়, `#notice`, `#admission` ইত্যাদি) |
| `student.html` | অভিভাবক/শিক্ষার্থী পোর্টাল (noindex) |
| `404.html` | ভুল লিংকের পাতা |
| `config.js` | **রিপোজিটরিতে আলাদা থাকে।** শুধু `window.BJHA_API = "<Web app URL>"` |
| `assets/css/main.css` | মূল সাইটের স্টাইল; রং `:root`-এ |
| `assets/js/main.js` | মেনু, নোটিশ, বই-অর্ডার, ফি, লাইভ ডেটা `apply()` |
| `assets/css/portal.css`, `assets/js/portal.js` | পোর্টালের স্টাইল ও লজিক |
| `assets/img/` | লোগো (192/512) ও `og-cover.jpg` (১২০০×৬৩০, ফেসবুক শেয়ারের ছবি) |
| `office/` | অফিস ম্যানেজমেন্ট অ্যাপ (PWA: `index.html`, `sw.js`, `manifest.webmanifest`, আইকন) |
| `favicon.ico`, `site.webmanifest` | ব্রাউজার আইকন |
| `robots.txt`, `sitemap.xml` | সার্চ ইঞ্জিন |
| `.htaccess` | শুধু cPanel/Apache হোস্টিংয়ে: HTTPS, ক্যাশ, নিরাপত্তা হেডার |
| `.nojekyll` | GitHub Pages-এ Jekyll বন্ধ রাখে |
| `googleXXXX.html` | Search Console যাচাই ফাইল, **মুছবেন না** |

## নিরাপত্তা নিয়ম (অবশ্যই মানবেন)

1. `Code.gs`, `SYNC_KEY`, ব্যাকআপ JSON, শিক্ষার্থীর তালিকা **কখনও এই রিপোজিটরিতে রাখবেন না**। রিপোজিটরি পাবলিক।
2. `config.js`-এ শুধু Web app URL থাকবে; সিঙ্ক কী নয়।
3. পোর্টালের পিন SHA-256 (salt = student id) হিসেবে Sheet-এ থাকে; ৫ বার ভুল হলে ১৫ মিনিট লক।

## লোকাল-এ চালানো

```
python -m http.server 8080
```
তারপর ব্রাউজারে `http://localhost:8080` (service worker-এর জন্য `file://` নয়, সার্ভার লাগবে)।

## পরিবর্তনের নিয়ম

- CSS/JS বদলালে `index.html`/`student.html`-এ `?v=3.0.0` সংখ্যা বাড়ান (যেমন `3.0.1`), নইলে পুরোনো ক্যাশ থেকে যেতে পারে।
- অফিস অ্যাপ বদলালে `office/sw.js`-এর `VERSION` বাড়ান।
- নোটিশ, বই, ফি, ভর্তি চালু/বন্ধ, হোয়াটসঅ্যাপ নম্বর: কোড নয়, **অফিস অ্যাপ → ওয়েবসাইট** থেকে বদলান।

## ডোমেইন বদলানোর চেকলিস্ট

`hifj-academy.github.io` লেখাটি নতুন ডোমেইন দিয়ে বদলাতে হবে এই জায়গাগুলোতে:

| ফাইল | কোথায় |
|---|---|
| `index.html` | `og:url`, `og:image`, `canonical`, JSON-LD (`url`, `logo`, `image`) |
| `robots.txt` | `Sitemap:` লাইন |
| `sitemap.xml` | `<loc>` |
| `CNAME` (নতুন ফাইল, শুধু GitHub Pages) | এক লাইনে ডোমেইন, যেমন `baitushsharafhifz.com` |
| অফিস অ্যাপ → ওয়েবসাইট → প্রদর্শন | `siteUrl`, `portalUrl` |

বাকি সব লিংক relative, তাই আর কিছু বদলাতে হবে না।

## ভবিষ্যৎ উন্নয়নের জন্য নোট (ডেভেলপারদের জন্য)

- কোনো dependency নেই, শুধু Google Fonts (Tiro Bangla, Hind Siliguri, Amiri)।
- নতুন পাতা যোগ করলে `sitemap.xml`-এ যোগ করুন এবং `index.html`-এর মতো `<head>` মেটা কপি করুন।
- পাবলিক API-এর ফরম্যাট: `GET <API>?action=public` → `{settings, fees, notices[], books[], stats}`।
