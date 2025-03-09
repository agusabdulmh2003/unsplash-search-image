const apiKey = "YqcDaiFf3DJ6YM8O6YDEyg7sM2gqXjwaolhV8VIxpDU2z04ZLgbjVPsk"; // API Key Pexels
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;

let page = 1;
let query = "";

// Fungsi ambil gambar dari API Pexels
async function fetchImages(query, page) {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=${page}`;
    try {
        const response = await fetch(url, { headers: { Authorization: apiKey } });
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error("Error:", error);
        return [];
    }
}

// Fungsi tampilkan gambar
function displayImages(images) {
    images.forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = image.src.medium;
        imgElement.alt = image.photographer;
        imgElement.classList = "w-full h-64 object-cover rounded-md cursor-pointer transition duration-300 transform hover:scale-105";
        
        // Event untuk modal preview
        imgElement.addEventListener("click", () => showModal(image.src.large));

        gallery.appendChild(imgElement);
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

// Fungsi modal preview
function showModal(imageSrc) {
    document.getElementById("modalImage").src = imageSrc;
    document.getElementById("modal").classList.remove("hidden");
}

// Tutup modal
document.getElementById("closeModal").addEventListener("click", () => {
    document.getElementById("modal").classList.add("hidden");
});

// Dark Mode Toggle

// Cek apakah pengguna pernah mengaktifkan dark mode
if (localStorage.getItem("darkMode") === "enabled") {
    enableDarkMode();
}

// Fungsi untuk mengaktifkan dark mode
function enableDarkMode() {
    body.classList.add("dark-mode");
    searchInput.classList.add("bg-gray-800", "text-white", "border-gray-700");
    darkModeToggle.innerText = "☀ Light Mode";
    localStorage.setItem("darkMode", "enabled"); // Simpan preferensi pengguna
}

// Fungsi untuk menonaktifkan dark mode
function disableDarkMode() {
    body.classList.remove("dark-mode");
    searchInput.classList.remove("bg-gray-800", "text-white", "border-gray-700");
    darkModeToggle.innerText = "🌙 Dark Mode";
    localStorage.setItem("darkMode", "disabled"); // Simpan preferensi pengguna
}

// Event Listener untuk tombol toggle
darkModeToggle.addEventListener("click", () => {
    if (localStorage.getItem("darkMode") === "enabled") {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
});

// Event Listener pencarian gambar
searchButton.addEventListener("click", searchImages);

// Event Listener infinite scroll
window.addEventListener("scroll", loadMoreImages);
