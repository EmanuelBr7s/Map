// Inicializar el mapa
let map = L.map('map').setView([4.639386,-74.082412], 6);
let marker;

// Agregar el mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Función de búsqueda
async function searchPlace(query) {
    try {
        console.log('Buscando:', query); // Para depuración

        // Búsqueda de ubicación usando Nominatim
        const searchUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl);
        const data = await response.json();

        console.log('Resultados:', data); // Para depuración

        if (data.length > 0) {
            const place = data[0];
            const lat = parseFloat(place.lat);
            const lon = parseFloat(place.lon);

            // Mover el mapa a la ubicación
            map.setView([lat, lon], 13);

            // Agregar o actualizar marcador
            if (marker) {
                marker.setLatLng([lat, lon]);
            } else {
                marker = L.marker([lat, lon]).addTo(map);
            }

            // Buscar imagen en Wikipedia
            const wikiUrl = `https://es.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(place.display_name.split(',')[0])}&pithumbsize=300&origin=*`;
            const wikiResponse = await fetch(wikiUrl);
            const wikiData = await wikiResponse.json();
            const pages = wikiData.query.pages;
            const pageId = Object.keys(pages)[0];

            let imageHtml = '';
            if (pages[pageId].thumbnail) {
                imageHtml = `<img src="${pages[pageId].thumbnail.source}" style="width:100%; margin-top:10px;">`;
            }

            // Mostrar información
            document.getElementById('place-info').style.display = 'block';
            document.getElementById('place-info').innerHTML = `
                <h3>${place.display_name}</h3>
                ${imageHtml}
            `;
        } else {
            alert('No se encontraron resultados para esta búsqueda');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al realizar la búsqueda');
    }
}

// Agregar evento al botón de búsqueda
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado'); // Para depuración

    const searchButton = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');

    searchButton.addEventListener('click', () => {
        console.log('Botón clickeado'); // Para depuración
        const query = searchInput.value.trim();
        if (query) {
            searchPlace(query);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchPlace(query);
            }
        }
    });
});