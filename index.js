// This file was used to gather data in data.json file from the Website for faster retrieval of Images / Cards

const fs = require('fs');

async function fetchDataAndAppendToJsonFile() {
    // Initialize an array to store fetched data
    let fetchedData = [];

    // Define the number of iterations for the loop
    const numIterations = 282;

    const dataUrl = 'https://app.airbuyandsell.co/api/listing?location=&minPrice=0&maxPrice=2000000&minBathrooms=0&maxBathrooms=20&minBedrooms=0&maxBedrooms=20&page=';
    for (let i = 1; i <= numIterations; i++) {
        console.log("Iteration", i);
        try {
            const response = await fetch(dataUrl + i);
            const data = await response.json();
            let listings = data.results;
            listings = listings.map(e=>{
                return {
                    id: e.id,
                    bathrooms: e.bathrooms,
                    bedrooms: e.bedrooms,
                    city: e.city,
                }
            })
            fetchedData.push(...listings);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Convert the fetched data to JSON string
    const jsonData = JSON.stringify(fetchedData);

    fs.writeFileSync('data.json', jsonData);
}

// Call the function to fetch and append data to JSON file
fetchDataAndAppendToJsonFile();