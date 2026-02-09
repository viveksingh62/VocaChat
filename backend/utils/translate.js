const axios = require("axios");

async function translateText(text, targetLang,sourceLang) {
  try {
   const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: `${sourceLang}|${targetLang}`,
             de: "easyvivek3@example.com", 
        },
        timeout: 5000 // Add timeout
      }
    );
        const translated = response.data.responseData.translatedText;
    if (!translated || translated === "INVALID LANGUAGE PAIR") {
      console.log("Invalid language pair:", sourceLang, "->", targetLang);
      return text;
    }


    return response.data.responseData.translatedText;

  } catch (error) {
    console.log("MyMemory Error:", error.message);
    return null;
  }
}

module.exports = translateText;
