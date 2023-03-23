# Text Refinement with GPT-3

This is a simple web application to refine text using OpenAI's GPT-3 API. The app provides an interface to input text and returns a refined version of the text after processing with GPT-3.

## Features

- Input text area for users to enter text
- Refined text area to display the refined version of the input text
- Refine text button to initiate text refinement process

## Setup

1. Clone this repository and navigate to the project folder.
2. Install dependencies:
   ```
   npm install
   ```
3. Replace 'put_you_api_key_here' in the config.js file with your GPT-3 API key.
4. Start the local development server: 

   ```
   npm run start
   ```
5. Open http://localhost:8000 in your browser to access the application.

## Usage

1. Enter the text you want to refine in the "Input Text" textarea.
2. Click the "Refine Text" button to process the text with GPT-3.
3. The refined version of your input text will be displayed in the "Refined Text" textarea.

## Dependencies

- Tailwind CSS for styling
- Autoprefixer
- PostCSS

## License

This project is licensed under the MIT License.