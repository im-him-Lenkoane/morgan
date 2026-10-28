/* ====== EDIT THESE ====== */
var CONFIG = {
  whatsapp: "27000000000",                 // country code + number, no + or spaces
  apply: "",
instagram: "https://instagram.com/yourcompany",
  x: "https://x.com/yourcompany",
  facebook: "https://facebook.com/Morgan26i"
};
/* [name, description, label, solid colour, open to everyone?]  Optional images: assets/svc1 ... svc6 */
var SERVICES = [
  ["Tutoring Classes", "Subject support for learners, one-on-one or in small groups, in person and online.", "Tutoring", "#9a9a9a", false],
  ["Mobile Phone repairs", "Safe, reliable daily transport so learners get to school and home again on time.", "Transport", "#6e6e6e", false],
  ["Desktop & Laptop Repairs", "Advice on subject choices, university and college applications, bursaries and career paths.", "Guidance", "#b0b0b0", false],
  ["Computer Upgrade", "Websites, mobile apps and custom systems built for schools and businesses.", "Software", "#808080", false],
  ["Software Development", "An extra-curricular subject: computer basics, the internet, email, office tools and staying safe online.", "Extra-curricular", "#8c8c8c", true],
  ["Programming Fundamentals", "An extra-curricular subject: how code works, logic, problem-solving and writing your first programs.", "Extra-curricular", "#a6a6a6", true]
];
var WORDS = ["Tutoring Classes", "School Transport", "Career Guidance", "Software Development", "Digital Literacy", "Programming Fundamentals"];
/* ======================== */

var $ = function (s) { return document.querySelector(s); };
var EXTS = ["jpg", "jpeg", "png", "webp", "svg", "JPG", "JPEG", "PNG", "WEBP"];
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

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
$("#apply").href = CONFIG.apply || "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent("Hi Morgan26, I’d like to apply for the 2027 intake.");

/* services */
$("#list").innerHTML = SERVICES.map(function (s, i) {
  var msg = encodeURIComponent("Hi Morgan26, I’d like to know more about " + s[0] + ".");
  return '<article class="card' + (s[4] ? " free" : "") + '">' + (s[4] ? '<span class="ribbon">Open to everyone</span>' : "") +
    '<h3>' + esc(s[0]) + '</h3><p>' + esc(s[1]) + '</p><span class="tag">' + esc(s[2]) + '</span>' +
    '<div class="art" style="background:' + s[3] + '"><img data-img="svc' + (i + 1) + '" alt="' + esc(s[0]) + '"></div>' +
    '<a class="btn sm" target="_blank" rel="noopener" href="https://wa.me/' + CONFIG.whatsapp + '?text=' + msg + '">Enquire on WhatsApp</a></article>';
}).join("");
fillImages();

/* routing: #home #services #about */
var pages = ["home", "services", "about"];
function route() {
  var h = (location.hash || "#home").slice(1);
  if (pages.indexOf(h) < 0) h = "home";
  pages.forEach(function (p) { $("#" + p).classList.toggle("show", p === h); });
  document.querySelectorAll("nav a").forEach(function (a) { a.classList.toggle("on", a.dataset.p === h); });
  setMenu(false);
  window.scrollTo(0, 0);
  document.title = "Morgan26 · " + h[0].toUpperCase() + h.slice(1);
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

/* typewriter: types and erases each service */
var wi = 0, ci = 0, del = false, tw = $("#tw");
var still = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
function tick() {
  var w = WORDS[wi];
  if (still) { tw.textContent = w; wi = (wi + 1) % WORDS.length; return setTimeout(tick, 2200); }
  tw.textContent = w.slice(0, ci) || "\u00a0";
  var d = del ? 45 : 90;
  if (!del && ci === w.length) { del = true; d = 1500; }
  else if (del && ci === 0) { del = false; wi = (wi + 1) % WORDS.length; d = 350; }
  else ci += del ? -1 : 1;
  setTimeout(tick, d);
}
tick();

/* Home: one arched photo, ndx1..ndx10 reveal as you scroll */
(function () {
  var stage = $("#stage"), stick = $("#stick"), arch = $("#arch"), slides = [];
  function update() {
    if (slides.length < 2) return;
    var top = parseFloat(getComputedStyle(stick).top) || 0;
    var dist = stage.offsetHeight - stick.offsetHeight;
    var p = dist > 0 ? Math.min(1, Math.max(0, (top - stage.getBoundingClientRect().top) / dist)) : 0;
    var t = Math.min(1, p / 0.88) * (slides.length - 1);
    slides.forEach(function (s, i) {
      s.style.zIndex = i;
      var f = i === 0 ? 1 : Math.min(1, Math.max(0, t - (i - 1)));
      s.style.transform = "translateX(" + (100 - f * 100) + "%)";
    });
  }
  (async function () {
    for (var n = 1; n <= 10; n++) {
      var src = await probe("ndx" + n, EXTS);
      if (!src) continue;
      var im = new Image(); im.src = src; im.className = "slide"; im.alt = n === 1 ? "Morgan26" : "";
      arch.insertBefore(im, arch.querySelector(".name")); slides.push(im);
    }
    stage.style.height = slides.length > 1 ? "calc(100svh - 96px + " + (slides.length - 1) * 80 + "svh)" : "auto";
    update();
  })();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  window.addEventListener("hashchange", function () { setTimeout(update, 0); });
})();

/* swipeable photo stack on About: abt1, abt2, abt3 ... (up to 12) */
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
      else if (Math.abs(dx) < 6) advance(1);
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
      c.innerHTML = '<img alt="Morgan26 photo ' + n + '" src="' + src + '" draggable="false">';
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
