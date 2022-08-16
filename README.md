This project can be used to translate strings in a JSON object using Google Translate.  
See test-en.json for a sample input file and test-de.json for a sample output file.

## Requirements:
- Node.js
- Python 3 
- Google Cloud Command Line tools

## Installation:
```bash
npm ci 
```

## Usage:
Source of translation is always taken from the `en.json` file.
```bash
npm run translate de
```

The result of translations will be saved in `de.json`.  
Where `de` is the destination language code (german in this case).
