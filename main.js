/* ====== EDIT THESE ====== */
var CONFIG = {
  whatsapp: "https://whatsapp.com/channel/0029VbD6jtsGOj9wdHlK4G0m",                 // country code + number, no + or spaces
  instagram: "https://instagram.com/_i_morgan",
  x: "https://x.com/morgan_i_",
  facebook: "https://https://www.facebook.com/morgan26za/"
};
var WORKS = [
  ["Bilt Website", "A furniture store with a calm, product-first shopping flow.", "Website", "#d58ba0", "wrk1"],
  ["Nova Mobile", "A task app for teams that need more than standard workflows.", "Mobile App", "#6a2a5e", "wrk2"],
  ["Linar Ecosystem", "A sustainability dashboard to track energy use and impact.", "Website", "#7a1d3a", "wrk3"],
  ["Tranova Platform", "Booking for airport-to-hotel transfers with live tracking.", "Mobile App & Website", "#b4617a", "wrk4"]
];
var WORDS = ["Developer", "Creator", "Designer", "Artist", "Writer","Editor"];
/* ======================== */

var $ = function (s) { return document.querySelector(s); };
var EXTS = ["jpg", "jpeg", "png", "webp", "svg"];

/* try assets/<name>.<ext> for each extension until one loads */
function probe(name, exts) {
  return new Promise(function (res) {
    var i = 0;
    (function next() {
      if (i >= exts.length) return res(null);
      var src = "assets/" + name + "." + exts[i++], im = new Image();
      im.onload = function () { res(src); };
      im.onerror = next;
      im.src = src;
    })();
  });
}
function fillImages(root) {
  (root || document).querySelectorAll("img[data-img]").forEach(function (img) {
    var ex = img.dataset.exts ? img.dataset.exts.split(",") : EXTS;
    probe(img.dataset.img, ex).then(function (src) { if (src) img.src = src; else img.style.display = "none"; });
  });
}

/* contact links */
document.querySelectorAll("[data-link]").forEach(function (a) {
  var k = a.dataset.link;
  a.href = k === "whatsapp" ? "https://wa.me/" + CONFIG.whatsapp : CONFIG[k];
});

/* works */
$("#list").innerHTML = WORKS.map(function (w) {
  return '<article class="card"><div class="top"><h3>' + w[0] + '</h3><span class="go">&#8594;</span></div><p>' + w[1] +
    '</p><span class="tag">' + w[2].replace("&", "&amp;") + '</span><div class="art" style="background:' + w[3] +
    '"><img data-img="' + w[4] + '" alt="' + w[0] + '"></div></article>';
}).join("");
fillImages();

/* routing: #home #works #about */
var pages = ["home", "works", "about"];
function route() {
  var h = (location.hash || "#home").slice(1);
  if (pages.indexOf(h) < 0) h = "home";
  pages.forEach(function (p) { $("#" + p).classList.toggle("show", p === h); });
  document.querySelectorAll("nav a").forEach(function (a) { a.classList.toggle("on", a.dataset.p === h); });
  setMenu(false);
  window.scrollTo(0, 0);
  document.title = "Morgan I · " + h[0].toUpperCase() + h.slice(1);
}
function setMenu(open) {
  document.body.classList.toggle("open", open);
  $("#bg").setAttribute("aria-expanded", open);
  $("#bg").setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
$("#bg").onclick = function () { setMenu(!document.body.classList.contains("open")); };
document.querySelectorAll("[data-scroll]").forEach(function (a) {
  a.onclick = function (e) { e.preventDefault(); $("#contact").scrollIntoView({ behavior: "smooth" }); };
});
document.querySelectorAll("nav a").forEach(function (a) {
  a.addEventListener("click", function () { if (location.hash === "#" + a.dataset.p) route(); });
});
window.addEventListener("hashchange", route);
route();

/* typewriter */
var wi = 0, ci = 0, del = false, tw = $("#tw"), ar = $("#art");
var still = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
function tick() {
  var w = WORDS[wi];
  ar.textContent = /^[AEIOU]/i.test(w) ? "an" : "a";
  if (still) { tw.textContent = w; wi = (wi + 1) % WORDS.length; return setTimeout(tick, 2000); }
  tw.textContent = w.slice(0, ci) || "\u00a0";
  var d = del ? 55 : 110;
  if (!del && ci === w.length) { del = true; d = 1400; }
  else if (del && ci === 0) { del = false; wi = (wi + 1) % WORDS.length; d = 350; }
  else ci += del ? -1 : 1;
  setTimeout(tick, d);
}
tick();

/* swipeable photo stack: abt1, abt2, abt3 ... (up to 12) */
(function () {
  var deck = $("#deck"), cards = [], busy = false;
  var POS = ["translate(0,0) rotate(0)", "translate(0,16px) scale(.95) rotate(-3deg)", "translate(0,32px) scale(.9) rotate(3deg)"];
  function render() {
    cards.forEach(function (c, i) {
      c.style.zIndex = 100 - i;
      c.style.transform = POS[Math.min(i, 2)];
      c.style.opacity = i > 2 ? 0 : 1;
    });
    $("#count").textContent = cards.length ? "Swipe · " + cards.length + " photos" : "";
    $("#next").style.display = cards.length > 1 ? "" : "none";
  }
  function advance(dir) {
    if (busy || cards.length < 2) return;
    busy = true;
    var top = cards[0];
    top.style.transition = "transform .3s ease-in,opacity .3s";
    top.style.transform = "translate(" + (dir * 520) + "px,0) rotate(" + (dir * 22) + "deg)";
    top.style.opacity = 0;
    setTimeout(function () {
      cards.push(cards.shift());
      top.style.transition = "none";
      render();
      void top.offsetWidth;
      top.style.transition = "";
      busy = false;
    }, 300);
  }
  function drag(el) {
    var x0 = 0, y0 = 0, dx = 0, on = false;
    el.addEventListener("pointerdown", function (e) {
      if (el !== cards[0] || busy) return;
      on = true; x0 = e.clientX; y0 = e.clientY; dx = 0;
      el.setPointerCapture(e.pointerId); el.style.transition = "none";
    });
    el.addEventListener("pointermove", function (e) {
      if (!on) return;
      dx = e.clientX - x0;
      el.style.transform = "translate(" + dx + "px," + (e.clientY - y0) * 0.25 + "px) rotate(" + dx / 18 + "deg)";
    });
    function end() {
      if (!on) return; on = false; el.style.transition = "";
      if (Math.abs(dx) > 80) advance(dx > 0 ? 1 : -1);
      else if (Math.abs(dx) < 6) advance(1);   /* tap */
      else render();
    }
    el.addEventListener("pointerup", end);
    el.addEventListener("pointercancel", end);
  }
  (async function load() {
    for (var n = 1; n <= 12; n++) {
      var src = await probe("abt" + n, EXTS);
      if (!src) continue;
      var c = document.createElement("div"); c.className = "sc";
      c.innerHTML = '<img alt="Photo of Morgan ' + n + '" src="' + src + '" draggable="false">';
      deck.appendChild(c); cards.push(c); drag(c);
    }
    if (!cards.length) $("#photos").style.display = "none";
    render();
  })();
  $("#next").onclick = function () { advance(1); };
  document.addEventListener("keydown", function (e) {
    if (location.hash !== "#about") return;
    if (e.key === "ArrowRight") advance(1);
    if (e.key === "ArrowLeft") advance(-1);
  });
})();
