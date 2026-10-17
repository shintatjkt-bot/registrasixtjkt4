(() => {
  "use strict";
  const $ = (selector) => document.querySelector(selector);
  const authView = $("#auth-view");
  const appView = $("#app-view");
  const contentView = $("#content-view");
  const loginForm = $("#login-form");
  const registerForm = $("#register-form");
  const authMessage = $("#auth-message");
  const STORAGE_USERS = "tjkt4_local_users_v1";
  const STORAGE_SESSION = "tjkt4_local_session_v1";
  const STORAGE_PROFILE = "tjkt4_local_profile_v1";

  let currentUser = null;

  function readUsers() {
    try { return JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]"); }
    catch { return []; }
  }
  function writeUsers(users) { localStorage.setItem(STORAGE_USERS, JSON.stringify(users)); }
  function readSession() {
    try { return JSON.parse(localStorage.getItem(STORAGE_SESSION) || "null"); }
    catch { return null; }
  }
  function showMessage(text, success = false) {
    authMessage.textContent = text;
    authMessage.className = success ? "message success" : "message";
  }
  function switchAuth(mode) {
    const registering = mode === "register";
    loginForm.classList.toggle("hidden", registering);
    registerForm.classList.toggle("hidden", !registering);
    $("#tab-login").classList.toggle("active", !registering);
    $("#tab-register").classList.toggle("active", registering);
    $("#auth-title").textContent = registering ? "Yuk, kenalan dulu!" : "Hai, selamat datang!";
    $("#auth-subtitle").textContent = registering ? "Buat akun lokal untuk browser ini." : "Masuk dulu, yuk.";
    showMessage("");
  }
  function showApp(user) {
    currentUser = user;
    authView.classList.add("hidden");
    contentView.classList.add("hidden");
    appView.classList.remove("hidden");
    $("#welcome-title").textContent = `Hai, ${user.name.split(" ")[0]}!`;
    const now = new Date();
    $("#today-label").textContent = new Intl.DateTimeFormat("id-ID", { weekday: "long", day: "numeric", month: "short" }).format(now);
    $("#main-nav").classList.remove("hidden");
    document.querySelectorAll(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.page === "home"));
    renderPage("home");
  }
  function logout() {
    localStorage.removeItem(STORAGE_SESSION);
    currentUser = null;
    appView.classList.add("hidden");
    contentView.classList.add("hidden");
    authView.classList.remove("hidden");
    $("#main-nav").classList.add("hidden");
    loginForm.reset();
    registerForm.reset();
    switchAuth("login");
  }
  function renderPage(page) {
    if (page === "home") {
      contentView.classList.add("hidden");
      appView.classList.remove("hidden");
    } else {
      appView.classList.add("hidden");
      contentView.classList.remove("hidden");
      $("#content-container").innerHTML = pageTemplates[page] ? pageTemplates[page]() : pageTemplates.info();
      if (page === "profil") attachProfileForm();
    }
    $("#main-nav").classList.add("hidden");
    document.querySelectorAll(".nav-link").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  const pageTemplates = {
    profil() {
      const saved = getProfile();
      return `<article class="content-panel"><span class="panel-icon">👩🏻‍🎓</span><span class="eyebrow">RUANG PERSONAL</span><h1>Profil Saya</h1><p class="lead">Hai, ${escapeHtml(currentUser.name)}! Lengkapi profilmu kalau mau. Data profil disimpan di browser ini.</p>
      <form id="profile-form" class="profile-form">
        <label>Nama lengkap<input name="name" value="${escapeAttr(saved.name || currentUser.name)}" maxlength="60" required></label>
        <label>Username<input value="${escapeAttr(currentUser.username)}" disabled></label>
        <label>Kelas<input name="kelas" value="${escapeAttr(saved.kelas || 'X TJKT 4')}" maxlength="30"></label>
        <label>Hobi<input name="hobi" value="${escapeAttr(saved.hobi || '')}" maxlength="80" placeholder="Contoh: membaca, musik"></label>
        <label class="full">Cita-cita<textarea name="cita" maxlength="180" placeholder="Tulis cita-citamu di sini">${escapeHtml(saved.cita || '')}</textarea></label>
        <div class="full"><button type="submit">Simpan profil ♡</button><span id="profile-message" class="message"></span></div>
      </form></article>`;
    },
    info() {
      return `<article class="content-panel"><span class="panel-icon">📌</span><span class="eyebrow">PAPAN PENGUMUMAN</span><h1>Info Kelas</h1><p class="lead">Tempat untuk menyimpan pengingat penting kelas. Bagian ini bisa kamu edit langsung di file <b>app.js</b>.</p>
      <div class="info-grid"><div class="info-tile"><small>📚 Pengingat belajar</small><b>Siapkan catatan dan alat tulis sebelum pelajaran dimulai.</b></div><div class="info-tile"><small>🛠️ Saat praktik</small><b>Gunakan alat sesuai instruksi dan terapkan K3.</b></div><div class="info-tile"><small>🤝 Kerja kelompok</small><b>Bagi tugas dengan adil dan saling menghargai.</b></div><div class="info-tile"><small>🌼 Jaga kelas</small><b>Buang sampah pada tempatnya dan rapikan kembali perlengkapan.</b></div></div><div class="note-box">Catatan: pengumuman di website statis ini bukan pesan live. Perubahan isi perlu dilakukan lewat file website dan diunggah kembali ke GitHub.</div></article>`;
    },
    teori() {
      const rows = [
        ["Senin","Bahasa Jawa, Bahasa Indonesia, PAIBP, Sejarah"],
        ["Selasa","PJOK, Sejarah, Bahasa Jawa, Bahasa Inggris"],
        ["Rabu","Pendidikan Pancasila, Matematika, PAIBP"],
        ["Kamis","Bahasa Inggris, PJOK, Bahasa Indonesia"],
        ["Jumat","7 Kebiasaan Anak Indonesia Hebat, Matematika"]
      ];
      return schedulePage("📖","Jadwal Teori","Daftar pelajaran teori yang bisa kamu jadikan pengingat.",rows,"Cocokkan lagi dengan jadwal terbaru dari sekolah. Jadwal bisa berubah sewaktu-waktu.");
    },
    bengkel() {
      const rows = [
        ["Senin","DPK"],
        ["Selasa","DPK"],
        ["Rabu","DPK, PIPAS"],
        ["Kamis","Informatika, Seni Budaya"],
        ["Jumat","7 Kebiasaan Anak Indonesia Hebat, Informatika, KKA, PIPAS"]
      ];
      return schedulePage("🛠️","Jadwal Bengkel","Pengingat kegiatan praktik dan pembelajaran produktif.",rows,"Sebelum praktik, cek alat, ikuti instruksi guru, dan terapkan K3. Konfirmasi jadwal aktual kepada guru.");
    },
    piket() {
      return `<article class="content-panel"><span class="panel-icon">🧹</span><span class="eyebrow">KELAS NYAMAN</span><h1>Jadwal Piket</h1><p class="lead">Contoh pembagian piket. Silakan ganti nama sesuai pembagian resmi kelasmu.</p><div class="piket-list"><div class="piket-item"><b>☀️ Senin</b><p>Kelompok 1<br>Rapikan meja dan papan tulis</p></div><div class="piket-item"><b>🌸 Selasa</b><p>Kelompok 2<br>Sapu lantai dan susun kursi</p></div><div class="piket-item"><b>🌿 Rabu</b><p>Kelompok 3<br>Bersihkan area kelas</p></div><div class="piket-item"><b>🍑 Kamis</b><p>Kelompok 4<br>Rapikan alat belajar</p></div><div class="piket-item"><b>🌼 Jumat</b><p>Semua anggota<br>Jaga kebersihan bersama</p></div></div><div class="note-box">Ini hanya contoh, bukan jadwal piket resmi. Ubah isi pada fungsi <b>piket()</b> di file app.js.</div></article>`;
    }
  };
  function schedulePage(icon, title, lead, rows, note) {
    return `<article class="content-panel"><span class="panel-icon">${icon}</span><span class="eyebrow">AGENDA BELAJAR</span><h1>${title}</h1><p class="lead">${lead}</p><div style="overflow-x:auto"><table class="schedule"><thead><tr><th>Hari</th><th>Mata pelajaran / kegiatan</th></tr></thead><tbody>${rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("")}</tbody></table></div><div class="note-box">${note}</div></article>`;
  }
  function getProfile() {
    try { return JSON.parse(localStorage.getItem(STORAGE_PROFILE + "_" + currentUser.username) || "{}"); }
    catch { return {}; }
  }
  function attachProfileForm() {
    const form = $("#profile-form");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      localStorage.setItem(STORAGE_PROFILE + "_" + currentUser.username, JSON.stringify(data));
      currentUser.name = data.name || currentUser.name;
      const users = readUsers();
      const user = users.find(u => u.username === currentUser.username);
      if (user) { user.name = currentUser.name; writeUsers(users); }
      localStorage.setItem(STORAGE_SESSION, JSON.stringify({ username: currentUser.username, name: currentUser.name }));
      $("#welcome-title").textContent = `Hai, ${currentUser.name.split(" ")[0]}!`;
      $("#profile-message").textContent = "Profil tersimpan di browser ini ♡";
      $("#profile-message").className = "message success";
    });
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
  }
  function escapeAttr(value) { return escapeHtml(value); }

  $("#tab-login").addEventListener("click", () => switchAuth("login"));
  $("#tab-register").addEventListener("click", () => switchAuth("register"));
  $("#go-register").addEventListener("click", () => switchAuth("register"));
  $("#go-login").addEventListener("click", () => switchAuth("login"));
  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#reg-name").value.trim();
    const username = $("#reg-username").value.trim().toLowerCase();
    const password = $("#reg-password").value;
    const confirm = $("#reg-confirm").value;
    if (password !== confirm) return showMessage("Password dan ulangi password belum sama.");
    if (!/^[a-z0-9_]{3,24}$/.test(username)) return showMessage("Username 3–24 karakter: huruf, angka, atau garis bawah.");
    const users = readUsers();
    if (users.some(user => user.username === username)) return showMessage("Username sudah dipakai. Coba username lain.");
    // Demo/local-only convenience, NOT secure authentication. Never use sensitive passwords.
    users.push({ name, username, password });
    writeUsers(users);
    showMessage("Akun berhasil dibuat! Sekarang masuk, ya 🌷", true);
    registerForm.reset();
    switchAuth("login");
    $("#login-username").value = username;
    showMessage("Akun berhasil dibuat! Silakan masuk 🌷", true);
  });
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const username = $("#login-username").value.trim().toLowerCase();
    const password = $("#login-password").value;
    const user = readUsers().find(item => item.username === username && item.password === password);
    if (!user) return showMessage("Username atau password salah. Coba cek lagi, ya.");
    const session = { username: user.username, name: user.name };
    localStorage.setItem(STORAGE_SESSION, JSON.stringify(session));
    loginForm.reset();
    showApp(session);
  });
  $("#logout-btn").addEventListener("click", logout);
  $("#back-home").addEventListener("click", () => renderPage("home"));
  $("#mobile-menu").addEventListener("click", () => $("#main-nav").classList.toggle("hidden"));
  document.querySelectorAll("[data-page]").forEach(btn => btn.addEventListener("click", () => {
    if (!currentUser) return;
    renderPage(btn.dataset.page);
  }));
  document.addEventListener("click", (event) => {
    if (!event.target.closest("#main-nav") && !event.target.closest("#mobile-menu")) $("#main-nav").classList.add("hidden");
  });

  const session = readSession();
  if (session) {
    const user = readUsers().find(item => item.username === session.username);
    if (user) showApp({ username: user.username, name: user.name });
    else logout();
  } else {
    $("#main-nav").classList.add("hidden");
    switchAuth("login");
  }
})();