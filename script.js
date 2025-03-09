const apiKey = ""; // API Key Pexels
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");
const darkModeToggle = document.getElementById("darkModeToggle");
const voiceSearch = document.getElementById("voiceSearch");
const body = document.body;

let page = 1;
let query = "";

// Fungsi ambil gambar dari API Pexels
async function fetchImages(query, page) {
    const orientation = document.getElementById("orientationFilter").value;
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

// Fungsi tampilkan gambar dengan tombol Download & Bookmark
function displayImages(images) {
    images.forEach(image => {
        const imgContainer = document.createElement("div");
        imgContainer.classList = "relative group";

        const imgElement = document.createElement("img");
        imgElement.src = image.src.medium;
        imgElement.alt = image.photographer;
        imgElement.classList = "w-full h-64 object-cover rounded-md cursor-pointer transition duration-300 transform hover:scale-105";
        imgElement.addEventListener("click", () => showModal(image.src.large));

        // Tombol Download
        const downloadButton = document.createElement("a");
        downloadButton.href = image.src.original;
        downloadButton.download = "image.jpg";
        downloadButton.classList = "absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 text-sm rounded-md hidden group-hover:block";
        downloadButton.innerText = "⬇ Download";

        // Tombol Bookmark
        const bookmarkButton = document.createElement("button");
        bookmarkButton.classList = "absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 text-sm rounded-md hidden group-hover:block";
        bookmarkButton.innerText = "⭐ Bookmark";
        bookmarkButton.addEventListener("click", () => saveToFavorites(image));

        // Tambahkan elemen ke container
        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(downloadButton);
        imgContainer.appendChild(bookmarkButton);
        gallery.appendChild(imgContainer);
    });
}

// Fungsi pencarian
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

// Fungsi infinite scroll
async function loadMoreImages() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
        loading.classList.remove("hidden");
        page++;
        const images = await fetchImages(query, page);
        displayImages(images);
        loading.classList.add("hidden");
    }
}

// Fungsi Simpan ke Bookmark
function saveToFavorites(image) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(image);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Gambar telah ditambahkan ke favorit!");
}

// Fungsi modal preview
function showModal(imageSrc) {
    document.getElementById("modalImage").src = imageSrc;
    document.getElementById("modal").classList.remove("hidden");
}

// Tutup modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
});

// Voice Search
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
voiceSearch.addEventListener("click", () => {
    recognition.start();
    voiceSearch.innerText = "🎤 Mendengarkan...";
});

recognition.onresult = (event) => {
    searchInput.value = event.results[0][0].transcript;
    voiceSearch.innerText = "🎙 Cari dengan Suara";
    searchImages();
};

recognition.onerror = () => {
    voiceSearch.innerText = "🎙 Cari dengan Suara";
    alert("Gagal mengenali suara. Coba lagi!");
};

// Dark Mode Toggle
if (localStorage.getItem("darkMode") === "enabled") {
    enableDarkMode();
}

function enableDarkMode() {
    body.classList.add("dark-mode");
    searchInput.classList.add("bg-gray-800", "text-white", "border-gray-700");
    darkModeToggle.innerText = "Light Mode ☀";
    localStorage.setItem("darkMode", "enabled");
}

function disableDarkMode() {
    body.classList.remove("dark-mode");
    searchInput.classList.remove("bg-gray-800", "text-white", "border-gray-700");
    darkModeToggle.innerText = "Dark Mode 🌙";
    localStorage.setItem("darkMode", "disabled");
}

darkModeToggle.addEventListener("click", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Event Listener pencarian gambar
searchButton.addEventListener("click", searchImages);
window.addEventListener("scroll", loadMoreImages);
