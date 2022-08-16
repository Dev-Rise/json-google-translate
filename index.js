const fs = require("fs");
// Imports the Google Cloud client library
const {Translate} = require("@google-cloud/translate").v2;

const target = process.argv.slice(2)[0];


console.info(`Destination language: ${target}`);

if (!target) {
    throw Error("Missing destination language")
}

// Creates a client
const translate = new Translate();

const sourceJSON = "en.json";
const source = JSON.parse(fs.readFileSync(sourceJSON, "UTF-8"));

translateSource(source);

async function translateSource(source) {
    const desktopTranslated = await deepTranslateObject(source);
    console.log(desktopTranslated);
    writeJSONToFile(desktopTranslated);
}

async function deepTranslateObject(obj) {
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.

    const translatedObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        const valueForKey = obj[key];
        if (typeof valueForKey === "string" || valueForKey instanceof String) {
            translatedObj[key] = await translateText(valueForKey);
        } else {
            translatedObj[key] = await deepTranslateObject(valueForKey);
        }
    }

    return translatedObj;
}

async function translateText(text) {
    let result = "";
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    translations.forEach((translation) => {
        result = translation.replace(/"/g, "'");
        console.log(`${result} => (${target}) ${translation}`);
    });

    return result;
}

function writeJSONToFile(jsonObj) {
    // convert JSON object to string
    const data = JSON.stringify(jsonObj, null, 4);

    // write JSON string to a file
    fs.writeFile(`${target}.json`, data, (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
}
