# Morgan I – portfolio (morgan26.co.za)

Plain HTML/CSS/JS. No build step. Pages: Home (#home), Works (#works), About (#about).

## Image names (put them in /assets)
| File | Used for |
|---|---|
| `menu.svg` | Your logo, replaces the hamburger menu (also the browser tab icon) |
| `ndx1.jpg` | Your photo on Home ("Hey, I'm [photo]") |
| `ndx2.jpg` | Mzansi picture on Home ("based in [photo] Mzansi") |
| `ndx3.svg` | Small logo/badge after "a Developer at [logo]" |
| `abt1.jpg`, `abt2.jpg`, `abt3.jpg` … up to `abt12` | About page swipeable photo stack, in this order |
| `wrk1.jpg` … `wrk4.jpg` | Optional project images on Works |

Any of `.jpg .jpeg .png .webp .svg` works, so `ndx2.jpeg` is fine. The site tries them in that order.
**Delete the matching placeholder `.svg` when you add a real photo** (e.g. remove `abt1.svg` after adding `abt1.jpg`), and delete any placeholder you don't replace.
Tip: keep photos under ~400 KB each (about 1200 px on the long side) so the site stays fast.

## Edit your details
Open `js/main.js`, top of the file: WhatsApp number (e.g. `27821234567`), Instagram, X, Facebook links, project list and the 5 rotating words.
Text on the About page is in `index.html`.

## Upload to GitHub
1. Create an empty repo on github.com (e.g. `morgan-site`).
2. In this folder:
```
git init
git add .
git commit -m "First version"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/morgan-site.git
git push -u origin main
```
(No terminal? On the repo page use Add file → Upload files and drag in everything.)

## Deploy on Vercel
1. vercel.com → Add New → Project → import the GitHub repo.
2. Framework Preset: **Other**. Leave build command and output directory empty. Deploy.
3. Every `git push` redeploys automatically.

## Connect morgan26.co.za
1. Vercel → your project → Settings → Domains → add `morgan26.co.za` (and `www.morgan26.co.za`).
2. Vercel shows the exact DNS records. At your .co.za registrar's DNS page, add them. Typically:
   - `A` record, host `@` → `76.76.21.21`
   - `CNAME` record, host `www` → `cname.vercel-dns.com`
3. Wait a few minutes to a few hours; Vercel issues HTTPS automatically. Use the values Vercel shows if they differ.
