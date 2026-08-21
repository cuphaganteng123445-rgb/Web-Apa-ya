function simpanKeStorage() {
    localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatDariStorage() {
    const data = localStorage.getItem("daftarTugas");
    daftarTugas = data ? JSON.parse(data) : [];

    renderTugas();
}

const app = document.getElementById("app");

const judul = document.createElement("h2");
judul.textContent = "Selamat Datang di daily board!";

//bagian tugas
const sectionTugas = document.createElement("section");
const judulTugas = document.createElement("h3")
judulTugas.textContent = "Tugas";
const tombolTambah = document.createElement("button");
tombolTambah.textContent = "Tambah Tugas";
const input = document.createElement("input");
const art1 = document.createElement("article");

const wadahFilter = document.createElement("div");
wadahFilter.style.display = "flex";
wadahFilter.style.gap = "0";

const filterSemua = document.createElement("button");
filterSemua.textContent = "Semua";
filterSemua.addEventListener("click", () => renderTugas("semua"));

const filterSelesai = document.createElement("button");
filterSelesai.textContent = "Selesai";
filterSelesai.addEventListener("click", () => renderTugas("selesai"));

const filterBelum = document.createElement("button");
filterBelum.textContent = "Belum";
filterBelum.addEventListener("click", () => renderTugas("belum"));

wadahFilter.appendChild(filterSemua);
wadahFilter.appendChild(filterSelesai);
wadahFilter.appendChild(filterBelum);

const search = document.createElement("input");
search.placeholder = "cari tugas..";

app.appendChild(judul);
app.appendChild(sectionTugas);
sectionTugas.appendChild(judulTugas)
sectionTugas.appendChild(input);
sectionTugas.appendChild(tombolTambah);
sectionTugas.appendChild(wadahFilter);
sectionTugas.appendChild(search);
sectionTugas.appendChild(art1);

let daftarTugas = [
    { id: 1, nama: "jees ", selesai: false },
    { id: 2, nama: "css ", selesai: false },
];

let ddrop = null;
let nextId = 3;

search.addEventListener("input", (e) => {
    const katakunci = e.target.value.toLowerCase();
    const semuaLi = art1.querySelectorAll("li");

    semuaLi.forEach((li) => {
        const namaTugas = li.querySelector("span").textContent.toLowerCase();

        if (namaTugas.includes(katakunci)) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    })
})

function tambahTugas(nama) {
    daftarTugas.push({ id: nextId++, nama: nama, selesai: false });
    renderTugas();
    simpanKeStorage();
}

tombolTambah.addEventListener("click", () => {
    const nama = input.value.trim();
    if (validasiInput(nama)) {
        tambahTugas(nama);
        input.value = "";
    }
});

function hapusTugas(id) {
    daftarTugas = daftarTugas.filter((t) => t.id !== id);
    renderTugas();
    simpanKeStorage();
}

function toggleSelesai(id) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, selesai: !t.selesai } : t
    );
    renderTugas();
    simpanKeStorage();
}

function editTugas(id, namaBaru) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, nama: namaBaru } : t
    );
    renderTugas();
    simpanKeStorage();
}

function validasiInput(namaBaru) {
    if (namaBaru.trim() === "") {
        alert("Nama tugas tidak boleh kosong!");
        return false;
    }
    if (namaBaru.length > 100) {
        alert("Nama tugas tidak boleh lebih dari 100 karakter!");
        return false;
    }
    return true;
}

function buatElemenTugas(tugas) {
    const li = document.createElement("li");
    li.className = "drag";
    li.dataset.id = tugas.id;

    const span = document.createElement("span");
    span.textContent = tugas.nama;
    span.style.textDecoration = tugas.selesai ? "line-through" : "none";
    span.addEventListener("click", () => toggleSelesai(tugas.id));

    span.addEventListener("dblclick", () => {
        const tugasBaru = prompt("masukan nama baru", tugas.nama);
        if (tugasBaru !== null && validasiInput(tugasBaru)) {
            editTugas(tugas.id, tugasBaru);
        }
    })

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", () => hapusTugas(tugas.id));

    li.appendChild(span);
    li.appendChild(tombolHapus);

    li.setAttribute("draggable", true);
    li.addEventListener("dragstart", () => {
        ddrop = li;
    })

    return li;
}

function urutinUlangTugas() {
    const idBaru = [];
    art1.querySelectorAll("li").forEach((li) => {
        idBaru.push(Number(li.dataset.id));
    });

    daftarTugas.sort((a, b) => idBaru.indexOf(a.id) - idBaru.indexOf(b.id));
    simpanKeStorage();
}

function renderTugas(filter = "semua") {
    art1.innerHTML = "";
    const ul1 = document.createElement("ul");
    art1.appendChild(ul1);

    const tugasTersaring = daftarTugas.filter((t) => {
        if (filter === "selesai") return t.selesai;
        if (filter === "belum") return !t.selesai;
        return true;
    });

    tugasTersaring.forEach((tugas) => {
        const li = buatElemenTugas(tugas);
        ul1.appendChild(li);
    });
    ul1.addEventListener("dragover", (e) => e.preventDefault());
    ul1.addEventListener("drop", (e) => {
        e.preventDefault();
        const targetli = e.target.closest("li");

        if (ddrop && targetli && ddrop !== targetli) {
            targetli.before(ddrop);
            urutinUlangTugas();
        }
    })
}

muatDariStorage();

//bagian catatan
let daftarCatatan = [];

function simpanCatatan() {
    localStorage.setItem("catatan", JSON.stringify(daftarCatatan));
}

function muatCatatan() {
    const data = localStorage.getItem("catatan");
    daftarCatatan = data ? JSON.parse(data) : [];

    renderCatatan();
}

function tambahCatatan(isi) {
    daftarCatatan.push({ id: Date.now(), isi, tanggal: new Date().toLocaleDateString() });
    simpanCatatan();
    renderCatatan();
}

function hapusCatatan(id) {
    daftarCatatan = daftarCatatan.filter((c) => c.id !== id);
    simpanCatatan();
    renderCatatan();
}

function editCatatan(id, catatanBaru) {
    daftarCatatan = daftarCatatan.map((c) =>
        c.id === id ? { ...c, isi: catatanBaru } : c
    );
    renderCatatan();
    simpanCatatan();
}

function validasiCatatan(catatanBaru) {
    if (catatanBaru.trim() === "") {
        alert("Catatan tidak boleh kosong!");
        return false;
    }
    return true;
}

const sectionCatatan = document.createElement("section");
const judulCatatan = document.createElement("h3");
judulCatatan.textContent = "Catatan";
const inputCatatan = document.createElement("textarea");
const tombolCatatan = document.createElement("button");
tombolCatatan.textContent = "Simpan Catatan";

app.appendChild(sectionCatatan);
sectionCatatan.appendChild(judulCatatan);
sectionCatatan.appendChild(inputCatatan);
sectionCatatan.appendChild(tombolCatatan);

const wadahKartu = document.createElement("div");
wadahKartu.className = "wadah-kartu";
sectionCatatan.appendChild(wadahKartu);

let ddropCatatan = null;

function buatElemenCatatan(c) {
    const kartu = document.createElement("div");
    kartu.className = "kartu-catatan";
    kartu.dataset.id = c.id;

    const teks = document.createElement("p");
    teks.textContent = c.isi;

    const tanggal = document.createElement("small");
    tanggal.textContent = c.tanggal;

    const tombolHpsCatatan = document.createElement("button");
    tombolHpsCatatan.textContent = "Hapus";
    tombolHpsCatatan.addEventListener("click", () => hapusCatatan(c.id));

    kartu.addEventListener("dblclick", () => {
        const catatanBaru = prompt("masukan catatan baru", c.isi);
        if (catatanBaru !== null && validasiCatatan(catatanBaru)) {
            editCatatan(c.id, catatanBaru);
        }
    })

    kartu.appendChild(teks);
    kartu.appendChild(tanggal);
    kartu.appendChild(tombolHpsCatatan);

    kartu.setAttribute("draggable", true);
    kartu.addEventListener("dragstart", () => {
        ddropCatatan = kartu;
    })

    return kartu;
}

function urutinUlangCatatan() {
    const idBaru = [];
    wadahKartu.querySelectorAll(".kartu-catatan").forEach((kartu) => {
        idBaru.push(Number(kartu.dataset.id));
    });

    daftarCatatan.sort((a, b) => idBaru.indexOf(a.id) - idBaru.indexOf(b.id));
    simpanCatatan();
}

function renderCatatan() {
    wadahKartu.innerHTML = "";

    daftarCatatan.forEach((c) => {
        const kartu = buatElemenCatatan(c);
        wadahKartu.appendChild(kartu);
    });

    wadahKartu.addEventListener("dragover", (e) => e.preventDefault());
    wadahKartu.addEventListener("drop", (e) => {
        e.preventDefault();
        const targetKartu = e.target.closest(".kartu-catatan");

        if (ddropCatatan && targetKartu && ddropCatatan !== targetKartu) {
            targetKartu.before(ddropCatatan);
            urutinUlangCatatan();
        }
    })
}

tombolCatatan.addEventListener("click", () => {
    const isi = inputCatatan.value.trim();
    if (isi) {
        tambahCatatan(isi);
        inputCatatan.value = "";
    }
});

muatCatatan();

//bagian kutipan
const kutipan = document.createElement("div");
const teksKutipan = document.createElement("p");
teksKutipan.textContent = "Memuat...";
const authorKutipan = document.createElement("p");

kutipan.appendChild(teksKutipan);
kutipan.appendChild(authorKutipan);

async function ambilKutipan() {
    try {
        const res = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random");
        const data = await res.json();
        teksKutipan.textContent = data.quote;
        authorKutipan.textContent = "- " + data.author;
    } catch (error) {
        console.error("gagal di muat:", error);
    }
}

ambilKutipan();
app.appendChild(kutipan);

//bagian cuaca
const sectionCuaca = document.createElement("section");
const judulCuaca = document.createElement("h3");
judulCuaca.textContent = "Cuaca";

const labelKota = document.createElement("p");
labelKota.textContent = "Masukan nama kota:";

const inputKota = document.createElement("input");

inputKota.placeholder = "";

const tombolCariKota = document.createElement("button");
tombolCariKota.textContent = "Cari";

const wadahCuaca = document.createElement("div")

sectionCuaca.appendChild(judulCuaca);
sectionCuaca.appendChild(labelKota);
sectionCuaca.appendChild(inputKota);
sectionCuaca.appendChild(tombolCariKota);
sectionCuaca.appendChild(wadahCuaca);

async function ambilCuaca(kota) {
    const apikey = "12b8feeef90d304fe5e56c5b4f76aa8e";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apikey}&units=metric`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kota tidak ditemukan");
        const data = await res.json();
        wadahCuaca.innerHTML = `
            <p>${data.name}: ${data.main.temp}°C</p>
            <p>${data.weather[0].description}</p>`;
    } catch (error) {
        wadahCuaca.innerHTML = `<p>${error.message}</p>`;
    }
}

tombolCariKota.addEventListener("click", () => {
    const kota = inputKota.value.trim();
    if (kota !== "") {
        ambilCuaca(kota);
    } else {
        alert("Nama kota tidak boleh kosong!");
    }
});


inputKota.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        tombolCariKota.click();
    }
});

ambilCuaca("Jakarta");
app.appendChild(sectionCuaca);

async function semuaData() {
    const statusEl = document.getElementById("status");
    if (statusEl) statusEl.textContent = "Memuat Data...";
    await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);
    if (statusEl) statusEl.textContent = "Data Berhasil dimuat";
}
window.addEventListener("DOMContentLoaded", semuaData);

//bagian tema
const toggleTema = document.createElement("button");
toggleTema.textContent = "Mode Gelap🌙"
app.appendChild(toggleTema)

toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", modeAktif ? "gelap" : "terang")
});

window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tema") === "gelap") {
        document.body.classList.add("dark-mode");
    }
});