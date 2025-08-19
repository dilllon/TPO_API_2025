// await fetch('https://dogapi.dog/api/v2/breeds')
//     .then(response => {response.json()})
//     .then(data => { 
//         console.log(data);
//         .. proceso
//     })
//     .catch(error => { 
//         console.error('Error fetching data:', error);
//     });


// Cargar las razas cuando la página esté lista
// document.addEventListener('DOMContentLoaded', fetchDogBreeds);

// const startButton = document.getElementByClass('start-btn');
const startButton = document.getElementById('start-btn');
startButton.addEventListener('click', () => {
    fetchDogBreeds(); 
});


async function fetchDogBreeds() {
    try {
        const response = await fetch('https://dogapi.dog/api/v2/breeds');
        // mock de error
        // throw new Error('Network response was not ok');
        
        if (!response.ok) {
            throw new Error('Network response was not ok')
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
    const tableBody = document.getElementById('breeds-table-body');
    
    breeds.forEach(breed => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${breed.attributes.name}</td>
            <td>${breed.attributes.description || 'No disponible'}</td>
            <td>${breed.attributes.life.min} - ${breed.attributes.life.max} años</td>
            <td>${breed.attributes.male_weight.min} - ${breed.attributes.male_weight.max} kg</td>
            <td>${breed.attributes.female_weight.min} - ${breed.attributes.female_weight.max} kg</td>
        `;
        
        tableBody.appendChild(row);
    });
}

