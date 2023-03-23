import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const refineButton = document.getElementById('refineButton');
    
    refineButton.addEventListener('click', async (event) => {
        event.preventDefault();
        console.log('Refine button clicked');
        
        const inputText = document.getElementById('inputText').value;
        const textToSend = createGPT3Prompt(inputText);
        console.log('Input Text:', inputText);
        
        try {
            console.log('Sending API request');
            // Call the GPT-3 API
            const refinedText = await refineTextWithGPT3(textToSend);
            
            console.log('API response received:', refinedText);
            // Display the refined text
            document.getElementById('refinedText').value = refinedText;
        } catch (error) {
            console.error('Error refining text:', error);
            alert('An error occurred while refining the text. Please try again.');
        }
    });
    
    console.log('Refine button event listener added');
});

function createGPT3Prompt(inputText) {
    return `Please refine the following input text by ensuring that: 
    1. Grammatical and spelling errors are corrected. 
    2. Missing context is added to improve clarity and coherence. 
    3. The specific task or objective associated with the input is clearly identified. 
    4. A professional tone is adopted, using information or terminology appropriate for an expert in the relevant field. 
    5. The refined text encourages user focus and reflection on the implications and results of the input. 

    Following input:
    "${inputText}"
    Return only enhanced prompt, nothing more.
    `;
}


async function refineTextWithGPT3(gpt3Prompt) {
    const requestBody = {
        model: config.model,
        prompt: gpt3Prompt,
        max_tokens: config.maxTokens,
        temperature: config.temperature
    };

    if (config.stop) {
        requestBody.stop = config.stop;
    }
    
    const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    console.log('API response:', response);
    
    if (response.ok) {
        const data = await response.json();
        console.log('Complete API Response:', data);
        return data.choices[0].text.trim(); 
    } else {
        const errorData = await response.json(); 
        console.error('Error data:', errorData); 
        throw new Error(`API request failed with status ${response.status}`);
    }
}
