async function fetchDogBreeds() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds', {
            headers: {
                'accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayBreeds(data.data);
    } catch (error) {
        console.error('Error fetching dog breeds:', error);
        document.getElementById('breeds-container').innerHTML = 
            '<p class="error">Lo siento, hubo un error al cargar la información de las razas.</p>';
    }
}

function displayBreeds(breeds) {
    const container = document.getElementById('breeds-container');
    
    breeds.forEach(breed => {
        const breedCard = document.createElement('div');
        breedCard.className = 'breed-card';
        
        breedCard.innerHTML = `
            <h2>${breed.attributes.name}</h2>
            <p><strong>Descripción:</strong> ${breed.attributes.description || 'No disponible'}</p>
            <p><strong>Vida promedio:</strong> ${breed.attributes.life.min} - ${breed.attributes.life.max} años</p>
            <p><strong>Peso hembra:</strong> ${breed.attributes.female_weight.min} - ${breed.attributes.female_weight.max} kg</p>
            <p><strong>Peso macho:</strong> ${breed.attributes.male_weight.min} - ${breed.attributes.male_weight.max} kg</p>
        `;
        
        container.appendChild(breedCard);
    });
}

// Cargar las razas cuando la página esté lista
document.addEventListener('DOMContentLoaded', fetchDogBreeds);
