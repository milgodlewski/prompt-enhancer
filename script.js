import { config } from './config.js';

async function init() {
    try {
        const models = await getAvailableModels();
        console.log('Available models:', models);
        populateModelSelection(models);
        configureEventListeners();
    } catch (error) {
        console.error('Error fetching available models:', error);
    }
}

function configureEventListeners() {
    const refineButton = document.getElementById('refineButton');
    refineButton.addEventListener('click', handleRefineButtonClick);
    console.log('Refine button event listener added');
}

document.addEventListener('DOMContentLoaded', init);

function cleanInputText(inputText) {
    const removeMultipleSpaces = inputText.replace(/\s\s+/g, ' ');
    const removeMultiplePunctuation = removeMultipleSpaces.replace(/([.,!?])\1+/g, '$1');
    const trimSpacesBeforePunctuation = removeMultiplePunctuation.replace(/\s+([.,!?])/g, '$1');
    return trimSpacesBeforePunctuation;
}

async function refineTextIteratively(gpt3Prompt, inputText, maxIterations) {
    let currentIteration = 0;
    let refinedText = '';
    
    do {
        currentIteration++;
        refinedText = await refineTextWithGPT3(gpt3Prompt);
        
        if (await isResultSatisfactory(refinedText, inputText)) {
            break;
        }
    } while (currentIteration < maxIterations);
    
    return refinedText;
}

async function checkGrammarWithLanguageTool(text) {
    const languageToolUrl = 'https://api.languagetool.org/v2/check';
    const params = new URLSearchParams({
        text: text,
        language: 'en'
    });
    
    const response = await fetch(`${languageToolUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    
    if (response.ok) {
        return await response.json();
    } else {
        console.error('Error while checking grammar:', await response.json());
        throw new Error('Failed to check grammar');
    }
}

async function isResultSatisfactory(refinedText, inputText) {
    const similarityThreshold = 0.8;
    const similarity = calculateTextSimilarity(refinedText, inputText);
    const grammarCheckResult = await checkGrammarWithLanguageTool(refinedText);
    
    return similarity < similarityThreshold && grammarCheckResult.matches.length === 0;
}

async function getAvailableModels() {
    const response = await fetch(config.openaiEnginesEndpoint, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${config.apiKey}`
        }
    });
    
    if (response.ok) {
        const modelData = await response.json();
        return modelData.data.map(engine => engine.id);
    } else {
        console.error('Error fetching available models:', await response.json());
        throw new Error('Failed to fetch available models');
    }
}

function populateModelSelection(models) {
    const modelSelection = document.getElementById('modelSelection');
    
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        if (model === 'gpt-3.5-turbo') {
            option.selected = true;
        }
        modelSelection.appendChild(option);
    });
}

async function handleRefineButtonClick(event) {
    event.preventDefault();
    console.log('Refine button clicked');

    const inputText = document.getElementById('inputText').value;
    const cleanedInputText = cleanInputText(inputText);

    const deepLApiKey = config.deeplKey;
    const translatedText = await translateToEnglishWithDeepL(cleanedInputText, deepLApiKey);

    const gpt3Prompt = createGPT3Prompt(translatedText);
    console.log('Translated Text:', translatedText);

    try {
        console.log('Sending API request');
        const refinedText = await refineTextIteratively(gpt3Prompt, translatedText, 3);
        console.log('API response received:', refinedText);
        document.getElementById('refinedText').value = refinedText;
    } catch (error) {
        console.error('Error refining text:', error);
        alert('An error occurred while refining the text. Please try again.');
    }
}

function createGPT3Prompt(inputText) {
    const preprocessedText = preprocessInputText(inputText);
    const instructions = `
    Please refine the following input text by:
    1. Correcting grammatical and spelling errors.
    2. Adding missing context to improve clarity and coherence.
    3. Clearly identifying the specific task or objective associated with the input.
    4. Adopting a professional tone, using information or terminology appropriate for an expert in the relevant field.
    5. Encouraging user focus and reflection on the implications and results of the input.
    
    Input Text:
    "${preprocessedText}"
    
    Return only the enhanced prompt, nothing more.
    `;
    
    return instructions;
}

function preprocessInputText(inputText) {
    const removeMultipleSpaces = inputText.replace(/\s\s+/g, ' ');
    const removeMultiplePunctuation = removeMultipleSpaces.replace(/([.,!?])\1+/g, '$1');
    const trimSpacesBeforePunctuation = removeMultiplePunctuation.replace(/\s+([.,!?])/g, '$1');
    return trimSpacesBeforePunctuation;
}

async function refineTextWithGPT3(gpt3Prompt) {
    const selectedModel = document.getElementById('modelSelection').value;
    const requestBody = {
        model: selectedModel,
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
    
    if (response.ok) {
        const data = await response.json();
        return data.choices[0].text.trim();
    } else {
        const errorData = await response.json();
        console.error('Error data:', errorData);
        throw new Error(`API request failed with status ${response.status}`);
    }
}

function calculateTextSimilarity(text1, text2) {
    const words1 = new Set(text1.split(/\s+/));
    const words2 = new Set(text2.split(/\s+/));
    const intersection = new Set([...words1].filter(word => words2.has(word)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
}

async function translateToEnglishWithDeepL(text, apiKey) {
    const params = new URLSearchParams({
        auth_key: apiKey,
        text: text,
        target_lang: 'EN'
    });

    const response = await fetch(`${config.deepLUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (response.ok) {
        const data = await response.json();
        return data.translations[0].text;
    } else {
        console.error('Error while translating text:', await response.json());
        throw new Error('Failed to translate text');
    }
}
