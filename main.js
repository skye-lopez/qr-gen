import sizesByCorrectionLevel from "./sizetables.js"
// FIXME: TESTING VALUES 
const TEST_STRING = "https://www.google.com";
const ERROR_LEVEL = "M";
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


/**
    * Determines the min level to build based on the requested error correction level and string size.
    * @param {string} string - The data to be encoded 
    * @param {errorCorrectionLevel} - The correction level requested 
    * @return {number} the level to encode 
*/
function determineMinVersionByErrorRate(string, errorCorrectionLevel) {
    const len = string.length;
    const sizes = sizesByCorrectionLevel[errorCorrectionLevel];
    for (const [level, max] of Object.entries(sizes)) {
        if (len <= max) return level;
    }
}


/**
    * gets the length of bits by the encoding type and version requested for the given data 
    * @param {number} encodingType - the uint that represents the encoding type of the data. 
    * @param {number} version - the version of generation to use (between 1-9)
    * @return {}
*/
function getBitsLength(encodingType, version) {
    /** A representation of the bit lengths by version for a certain encoding type. arr[0]=Versions 1-9, arr[1]=Versions 10-26, arr[2]=Versions 27-40 */
    const bitLengthByEncodingAndVersion = {
        0b0001: [10, 12, 14],
        0b0010: [9, 11, 13],
        0b0100: [8, 16, 16],
        0b1000: [8, 10, 12],
    };
    const versionIdx = version > 26 ? 2 : version > 9 ? 1 : 0;
    return bitLengthByEncodingAndVersion[encodingType][versionIdx];
}
