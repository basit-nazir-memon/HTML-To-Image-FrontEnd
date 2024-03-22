BACKEND_URL = "https://html-to-image-data-scrap-backend.onrender.com"

// Add an event listener for when the input value changes
handleSubmit = async () => {
    var button = document.getElementById('singleJobButton');
    
    // Disable the button
    button.disabled = true;

    // Save the original content of the button
    var originalContent = button.innerHTML;

    // Set the button content to a loading GIF
    button.innerHTML = '<img src="./assets/css/Spinner.gif" alt="Loading..." />';

    const pngLinkInput = document.getElementById('pngLinkInput');

    var selectElement = document.getElementById("type");

    const inputValue = pngLinkInput.value;

    var selectedValue = selectElement.value;

    // Send the input value to the server
    try {
        const response = await fetch(`${BACKEND_URL}/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ linkText: inputValue, Imgtype: selectedValue })
        });

        if (!response.ok) {
            throw new Error('Failed to convert PNG image');
        }

        // Convert the response to a blob
        const imageBlob = await response.blob();

        // Create a temporary URL for the blob
        const imageURL = URL.createObjectURL(imageBlob);

        // Create a link element and simulate a click to trigger the download
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'image.' + (selectedValue === "PNG" ? 'png' : 'jpeg');
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        // Clean up the URL object
        URL.revokeObjectURL(imageURL);
    } catch (error) {
        console.error('Error:', error.message);
    }
    
    button.disabled = false;
    button.innerHTML = originalContent;
    pngLinkInput.value = ""
}


const handleMultipleSubmit = () => {
    var button = document.getElementById('blukJobButton');
    
    // Disable the button
    button.disabled = true;

    // Save the original content of the button
    var originalContent = button.innerHTML;

    // Set the button content to a loading GIF
    button.innerHTML = '<img src="./assets/css/Spinner.gif" alt="Loading..." />';


    var file = document.getElementById('fileInput').files[0]; // Accessing files directly
    var selectElement = document.getElementById("type");

    var selectedValue = selectElement.value;

    var reader = new FileReader();

    reader.onload = async function() {
        var content = reader.result;
        var lines = content.split('\n');

        let index = 1;
        for (const line of lines) {
            // console.log(line);
            try {
                const response = await fetch(`${BACKEND_URL}/convert`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ linkText: line, Imgtype: selectedValue })
                });
        
                if (!response.ok) {
                    throw new Error('Failed to convert PNG image');
                }
        
                // Convert the response to a blob
                const imageBlob = await response.blob();
        
                // Create a temporary URL for the blob
                const imageURL = URL.createObjectURL(imageBlob);
        
                // Create a link element and simulate a click to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = imageURL;
                downloadLink.download = `ABS_${(new Date()).toDateString().replace(/\s+/g, '-')}_${index}`;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
        
                // Clean up the URL object
                URL.revokeObjectURL(imageURL);
            } catch (error) {
                console.error('Error:', error.message);
            }
            // Add a delay between iterations if needed
            await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust the delay time as needed

            index++;
        }
    };

    reader.readAsText(file);    


    button.disabled = false;
    button.innerHTML = originalContent;
    document.getElementById('fileInput').value = '';
}