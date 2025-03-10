/**
 * API Keys untuk layanan eksternal
 * Pexels: Digunakan untuk mendapatkan gambar
 * remove.bg: Digunakan untuk menghapus background gambar
 */
const apiKey = "YqcDaiFf3DJ6YM8O6YDEyg7sM2gqXjwaolhV8VIxpDU2z04ZLgbjVPsk"; 
const removeBgApiKey = "tekYZ62LjfKcoQmcEkQqccbs"; 

// Mengambil elemen HTML yang dibutuhkan
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");
const darkModeToggle = document.getElementById("darkModeToggle");
const voiceSearch = document.getElementById("voiceSearch");
const body = document.body;
const canvas = document.getElementById("wallpaperCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;
let img = new Image();

let page = 1;
let query = "";

/**
 * Fungsi untuk mengambil gambar dari API Pexels berdasarkan query pencarian
 * @param {string} query - Kata kunci pencarian
 * @param {number} page - Nomor halaman untuk pagination
 * @returns {Promise<Array>} - Mengembalikan daftar gambar dalam bentuk array
 */
async function fetchImages(query, page) {
    const orientation = document.getElementById("orientationFilter")?.value || "all";
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=${page}&orientation=${orientation}`;
    try {
        const response = await fetch(url, { headers: { Authorization: apiKey } });
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

/**
 * Fungsi untuk menampilkan gambar di galeri dengan tombol Download & Bookmark
 * @param {Array} images - Array gambar dari API
 */
function displayImages(images) {
    images.forEach(image => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("relative", "group");

        const imgElement = document.createElement("img");
        imgElement.src = image.src.medium;
        imgElement.alt = image.photographer;
        imgElement.classList.add("w-full", "h-64", "object-cover", "rounded-md", "cursor-pointer", "transition", "duration-300", "transform", "hover:scale-105");
        imgElement.addEventListener("click", () => showModal(image.src.large));

        // Tombol Download
        const downloadButton = document.createElement("a");
        downloadButton.href = image.src.original;
        downloadButton.download = "image.jpg";
        downloadButton.classList.add("absolute", "bottom-2", "right-2", "bg-blue-500", "text-white", "px-2", "py-1", "text-sm", "rounded-md", "hidden", "group-hover:block");
        downloadButton.innerText = "⬇ Download";

        // Tombol Bookmark
        const bookmarkButton = document.createElement("button");
        bookmarkButton.classList.add("absolute", "top-2", "right-2", "bg-yellow-500", "text-white", "px-2", "py-1", "text-sm", "rounded-md", "hidden", "group-hover:block");
        bookmarkButton.innerText = "⭐";
        bookmarkButton.addEventListener("click", () => saveToFavorites(image));

        // Tambahkan elemen ke container
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(downloadButton);
        imgContainer.appendChild(bookmarkButton);
        gallery.appendChild(imgContainer);
    });
}

/**
 * Fungsi pencarian gambar berdasarkan input pengguna
 */
async function searchImages() {
    query = searchInput.value.trim();
    if (!query) return;

    page = 1;
    gallery.innerHTML = "";
    loading.classList.remove("hidden");

    const images = await fetchImages(query, page);
    displayImages(images);

    loading.classList.add("hidden");
}

/**
 * Fungsi infinite scroll untuk memuat lebih banyak gambar saat pengguna scroll ke bawah
 */
async function loadMoreImages() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loading.classList.remove("hidden");
        page++;
        const images = await fetchImages(query, page);
        displayImages(images);
        loading.classList.add("hidden");
    }
}

/**
 * Fungsi menyimpan gambar ke daftar favorit (localStorage)
 * @param {Object} image - Data gambar yang akan disimpan
 */
function saveToFavorites(image) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(image);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Gambar telah ditambahkan ke favorit!");
}

/**
 * Fungsi modal preview gambar dalam ukuran besar
 * @param {string} imageSrc - URL gambar yang ditampilkan di modal
 */
function showModal(imageSrc) {
    const modalImage = document.getElementById("modalImage");
    const modal = document.getElementById("modal");
    if (modalImage && modal) {
        modalImage.src = imageSrc;
        modal.classList.remove("hidden");
    }
}

// Menutup modal
document.getElementById("closeModal")?.addEventListener("click", () => {
    document.getElementById("modal")?.classList.add("hidden");
});

// Event Listener untuk pencarian gambar
searchButton?.addEventListener("click", searchImages);
window.addEventListener("scroll", loadMoreImages);

/**
 * Fungsi untuk menghapus background gambar dengan remove.bg
 * @param {string} imageUrl - URL gambar yang akan diproses
 */
async function removeBackground(imageUrl) {
    const formData = new FormData();
    formData.append("image_url", imageUrl);
    formData.append("size", "auto");

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { Authorization: `Bearer ${removeBgApiKey}` },
            body: formData,
        });

        if (!response.ok) throw new Error("Gagal menghapus background");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        showModal(url);
    } catch (error) {
        console.error("Error:", error);
        alert("Gagal menghapus background");
    }
}
