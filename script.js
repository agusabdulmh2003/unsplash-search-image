const apiKey = ""; // Ganti dengan API Key Pexels
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const gallery = document.getElementById("gallery");
const loading = document.getElementById("loading");

let page = 1;
let query = "";

// Fungsi untuk mengambil gambar dari Pexels API
async function fetchImages(query, page) {
    const url = `https://api.pexels.com/v1/search?query=${query}&per_page=12&page=${page}`;
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: apiKey
            }
        });
        const data = await response.json();
        return data.photos;
    } catch (error) {
        console.error("Gagal mengambil data:", error);
        return [];
    }
}

// Fungsi untuk menampilkan gambar di halaman
function displayImages(images) {
    images.forEach(image => {
        const imgElement = document.createElement("img");
        imgElement.src = image.src.medium;
        imgElement.alt = image.photographer;
        imgElement.classList = "w-full h-64 object-cover rounded-md shadow-md";
        gallery.appendChild(imgElement);
    });
}

// Fungsi utama untuk pencarian
async function searchImages() {
    query = searchInput.value.trim();
    if (!query) return;
    
    page = 1;
    gallery.innerHTML = ""; // Hapus hasil sebelumnya
    loading.classList.remove("hidden");

    const images = await fetchImages(query, page);
    displayImages(images);

    loading.classList.add("hidden");
}

// Fungsi untuk menangani Infinite Scroll
async function loadMoreImages() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loading.classList.remove("hidden");
        page++;
        const images = await fetchImages(query, page);
        displayImages(images);
        loading.classList.add("hidden");
    }
}

// Event listener untuk pencarian
searchButton.addEventListener("click", searchImages);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchImages();
    }
});

// Event listener untuk Infinite Scroll
window.addEventListener("scroll", loadMoreImages);
