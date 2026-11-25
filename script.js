/* ==========================================================
   DATA PUBLIK: isi dari API/backend saat integrasi.
   Hanya data yang ditujukan untuk publik (PUB-10).
   Kosong = tampilan "konten belum tersedia" (tanpa error).
========================================================== */
const DEMO = "(contoh)"; // hapus saat data asli dari backend sudah dipakai
const DATA = {
  struktur: [
    { nama: "Nama Ketua " + DEMO, jabatan: "Ketua Umum", divisi: "Inti" },
    { nama: "Nama Wakil " + DEMO, jabatan: "Wakil Ketua", divisi: "Inti" },
    { nama: "Nama Sekretaris " + DEMO, jabatan: "Sekretaris", divisi: "Sekretariat" },
    { nama: "Nama Bendahara " + DEMO, jabatan: "Bendahara", divisi: "Keuangan" },
    { nama: "Nama Kadiv " + DEMO, jabatan: "Kepala Divisi", divisi: "Pengembangan Diri" },
    { nama: "Nama Kadiv " + DEMO, jabatan: "Kepala Divisi", divisi: "Humas & Media" }
  ],
  proker: [
    { nama: "Program Kerja 1 " + DEMO, tanggal: "Januari 2026", divisi: "Pengembangan Diri", deskripsi: "Deskripsi singkat kegiatan yang sudah terlaksana.", status: "Terlaksana", publik: true },
    { nama: "Program Kerja 2 " + DEMO, tanggal: "Maret 2026", divisi: "Humas & Media", deskripsi: "Deskripsi singkat kegiatan yang sudah terlaksana.", status: "Terlaksana", publik: true },
    { nama: "Program Kerja 3 " + DEMO, tanggal: "Mei 2026", divisi: "Inti", deskripsi: "Deskripsi singkat kegiatan yang sudah terlaksana.", status: "Terlaksana", publik: true }
  ],
  berita: [
    { judul: "Judul Berita 1 " + DEMO, tanggal: "10 Nov 2026", ringkasan: "Ringkasan berita singkat tampil di sini.", isi: ["Paragraf isi berita lengkap " + DEMO + ".", "Paragraf lanjutan berita."] },
    { judul: "Judul Berita 2 " + DEMO, tanggal: "02 Nov 2026", ringkasan: "Ringkasan berita singkat tampil di sini.", isi: ["Paragraf isi berita lengkap " + DEMO + ".", "Paragraf lanjutan berita."] },
    { judul: "Judul Berita 3 " + DEMO, tanggal: "25 Okt 2026", ringkasan: "Ringkasan berita singkat tampil di sini.", isi: ["Paragraf isi berita lengkap " + DEMO + ".", "Paragraf lanjutan berita."] }
  ],
  galeri: [
    { judul: "Dokumentasi Kegiatan 1 " + DEMO, tanggal: "Mar 2026" },
    { judul: "Dokumentasi Kegiatan 2 " + DEMO, tanggal: "Mei 2026" },
    { judul: "Dokumentasi Kegiatan 3 " + DEMO, tanggal: "Agu 2026" }
  ],
  prestasi: [
    { judul: "Prestasi 1 " + DEMO, tahun: "2026", keterangan: "Keterangan singkat prestasi." },
    { judul: "Prestasi 2 " + DEMO, tahun: "2026", keterangan: "Keterangan singkat prestasi." }
  ],
  rekrutmen: {
    dibuka: false, periodeBerikutnya: "Akan diumumkan " + DEMO, // link: "https://..." jika pendaftaran lewat tautan eksternal
    persyaratan: ["Mahasiswa aktif Sistem Informasi " + DEMO, "Persyaratan lain " + DEMO],
    jadwal: ["Pendaftaran: tanggal " + DEMO, "Seleksi: tanggal " + DEMO],
    tataCara: ["Isi formulir pendaftaran " + DEMO, "Ikuti tahapan seleksi " + DEMO]
  }
};

/* Pengganti replaceChildren (tidak ada di Edge/Chrome lama) */
function setChildren(parent, node) {
  while (parent.firstChild) parent.removeChild(parent.firstChild);
  parent.appendChild(node);
}
if ("IntersectionObserver" in window) document.documentElement.classList.add("js");
/* Pengaman: apa pun yang terjadi, semua konten tampil setelah 2 detik */
setTimeout(() => document.querySelectorAll(".reveal").forEach(n => n.classList.add("in")), 2000);

/* Helper pembuat elemen (aman: memakai textContent) */
const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const icon = (name) => { const i = el("i", "fas " + name); i.setAttribute("aria-hidden", "true"); return i; };

function renderEmpty(slot) {
  const box = el("div", "empty-content");
  box.append(icon(slot.dataset.emptyIcon), el("h3", null, slot.dataset.emptyTitle), el("p", null, slot.dataset.emptyText));
  setChildren(slot, box);
}

function renderCards(slot, items, build, extraClass = "") {
  if (!items || !items.length) return renderEmpty(slot);
  const grid = el("div", "card-grid");
  items.forEach(it => { const c = build(it); c.classList.add("card", "reveal", "in"); if (extraClass) c.classList.add(extraClass); grid.append(c); });
  setChildren(slot, grid);
}

function card(meta, title, desc, detail) {
  const c = el("article");
  if (meta) c.append(el("div", "meta", meta));
  c.append(el("h3", null, title));
  if (desc) c.append(el("p", null, desc));
  if (detail) {
    const btn = el("button", "text-link card-more", "Lihat detail ");
    btn.type = "button"; btn.append(icon("fa-arrow-right"));
    btn.addEventListener("click", () => openDetail({ meta, title, body: detail }));
    c.append(btn);
  }
  return c;
}

/* Detail konten (dialog). Konten tidak ditemukan -> pesan, bukan error */
function openDetail(d) {
  const dlg = document.getElementById("detailDialog");
  const body = document.getElementById("detailBody");
  const wrap = el("div");
  if (!d || !d.title) wrap.append(el("h3", null, "Konten tidak ditemukan"), el("p", null, "Konten yang kamu cari tidak tersedia."));
  else {
    if (d.meta) wrap.append(el("div", "meta", d.meta));
    wrap.append(el("h3", null, d.title));
    (Array.isArray(d.body) ? d.body : [d.body]).forEach(t => wrap.append(el("p", null, t)));
  }
  setChildren(body, wrap);
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
}

function renderAll() {
  const $ = id => document.getElementById(id);

  renderCards($("strukturList"), DATA.struktur, p => {
    const c = el("article");
    const av = el("div", "avatar"); av.append(icon("fa-user"));
    c.append(av, el("h3", null, p.nama), el("p", null, [p.jabatan, p.divisi].filter(Boolean).join(" • ")));
    return c;
  }, "person");

  // Hanya proker Terlaksana yang memenuhi aturan publikasi (PUB-08)
  const prokerPublik = (DATA.proker || []).filter(p => p.status === "Terlaksana" && p.publik === true);
  renderCards($("prokerList"), prokerPublik, p => {
    const c = card([p.tanggal, p.divisi].filter(Boolean).join(" • "), p.nama, p.deskripsi, p.deskripsi);
    const b = el("span", "badge"); b.append(icon("fa-circle-check"), document.createTextNode(" Terlaksana"));
    c.prepend(b);
    return c;
  });

  renderCards($("panel-berita"), DATA.berita, b => card(b.tanggal, b.judul, b.ringkasan, b.isi || b.ringkasan));
  renderCards($("panel-galeri"), DATA.galeri, g => card(g.tanggal, g.judul, "Dokumentasi kegiatan.", g.keterangan || "Dokumentasi kegiatan HMPS MASIF."));
  renderCards($("panel-prestasi"), DATA.prestasi, p => card(p.tahun, p.judul, p.keterangan, p.keterangan));

  const r = DATA.rekrutmen, slot = $("rekrutmenInfo");
  if (!r) renderEmpty(slot);
  else {
    const box = el("div", "recruit");
    const open = r.dibuka === true;
    const st = el("span", "badge " + (open ? "" : "badge-off"));
    st.append(icon(open ? "fa-circle-check" : "fa-clock"), document.createTextNode(open ? " Pendaftaran dibuka" : " Pendaftaran belum dibuka"));
    box.append(st);
    if (!open && r.periodeBerikutnya) box.append(el("p", "recruit-next", "Periode berikutnya: " + r.periodeBerikutnya));
    const grid = el("div", "recruit-grid");
    [["fa-list-check", "Persyaratan", r.persyaratan], ["fa-calendar-days", "Jadwal", r.jadwal], ["fa-route", "Tata Cara", r.tataCara]].forEach(([ic, t, items]) => {
      const col = el("div", "card"); const h = el("h3"); h.append(icon(ic), document.createTextNode(" " + t)); col.append(h);
      const ul = el("ul", "recruit-list");
      (items || []).forEach(x => ul.append(el("li", null, x)));
      col.append(ul); grid.append(col);
    });
    box.append(grid);
    if (r.link) { const l = el("a", "btn btn-dark", "Buka Info Pendaftaran "); l.href = r.link; l.target = "_blank"; l.rel = "noopener"; l.append(icon("fa-arrow-up-right-from-square")); box.append(l); }
    setChildren(slot, box);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  try { renderAll(); } catch (e) { console.error(e); }
  document.getElementById("year").textContent = new Date().getFullYear();

  /* Header bayangan saat scroll */
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
  onScroll(); window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile */
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("navLinks");
  const icn = toggle.querySelector("i");
  const setMenu = open => {
    nav.classList.toggle("show", open);
    icn.classList.toggle("fa-bars", !open);
    icn.classList.toggle("fa-xmark", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  };
  toggle.addEventListener("click", () => setMenu(!nav.classList.contains("show")));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setMenu(false); });

  /* Menu aktif sesuai section */
  const links = [...nav.querySelectorAll("a[href^='#']")].filter(a => !a.classList.contains("btn-login"));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) links.forEach(a => {
        const on = a.getAttribute("href") === "#" + en.target.id;
        a.classList.toggle("active", on);
        on ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach(a => { const s = document.querySelector(a.getAttribute("href")); if (s) spy.observe(s); });

  /* Animasi muncul */
  const rv = new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); o.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal:not(.in)").forEach(n => rv.observe(n));

  /* Tabs Publikasi (panah kiri/kanan didukung) */
  const tabs = [...document.querySelectorAll(".tab")];
  const select = t => {
    tabs.forEach(x => {
      const on = x === t;
      x.setAttribute("aria-selected", on);
      x.tabIndex = on ? 0 : -1;
      document.getElementById(x.getAttribute("aria-controls")).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t));
    t.addEventListener("keydown", e => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const n = tabs[(i + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
      select(n); n.focus();
    });
  });
});