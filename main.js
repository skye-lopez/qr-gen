// FIXME: TESTING VALUES 
const TEST_STRING = "https://www.google.com";
// --------------------

/**
    * Given the raw string to encode determines the type of encoding that needs to be done. e.g. Numeric, Alphanumeric, Byte, Kanji, ECI 
    * @param {string} string - The string to encode 
    * @return {number} unsigned int to represent the encoding type 
*/
function determineEncodingType(string) {
    const numericRegex = /^\d*$/;
    const alphanumericRegex = /^[\dA-Z $%*+\-./:]*$/;
    const latinRegex = /^[\x00-\xff]*$/;
    const kanjiRegex = /^[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]*$/u;

    if (numericRegex.test(string)) return 0b0001;
    if (alphanumericRegex.test(string)) return 0b0010;
    if (latinRegex.test(string)) return 0b0100;
    if (kanjiRegex.test(string)) return 0b1000;
    return 0b0111;
}


