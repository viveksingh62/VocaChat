const axios = require("axios");

async function translateText(text, targetLang,sourceLang) {
  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
       langpair: `${sourceLang}|${targetLang}` 

        }
      }
    );

    return response.data.responseData.translatedText;

  } catch (error) {
    console.log("MyMemory Error:", error.message);
    return null;
  }
}

module.exports = translateText;
