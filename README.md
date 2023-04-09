# Text Refiner

Text Refiner is a web application that utilizes the GPT-3 API, LanguageTool API, and DeepL API to iteratively refine and improve the input text. The application is built using TypeScript, HTML, and CSS.

## Features

- Translate input text to English using the DeepL API
- Refine and improve the translated text using the GPT-3 API
- Check grammar and style with the LanguageTool API
- Compare the input and refined text for similarity
- Select GPT-3 models from a list of available models

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/text-refiner.git
cd text-refiner
```

2. Install dependencies

```bash
npm install
```

3. Build the project

```bash
npm run build
```

4. Start the development server

```bash
npm run start
```

5. Open http://localhost:8000 in your browser to access the application

## Usage

1. Enter your text in the input field
2. Click the "Refine Text" button to start the refining process
3. The refined text will be displayed in the output field

## Configuration

To use the GPT-3 API, LanguageTool API, and DeepL API, you will need to obtain API keys from their respective websites. Update the `config.ts` file with your API keys and other configuration details.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)