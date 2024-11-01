import sizesByCorrectionLevel from "./sizetables.js"
import { getLogAndExpTables, multiply, divide } from "./math.js";
// FIXME: TESTING VALUES 
const TEST_STRING = "https://www.qrcode.com/";
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
    * @return {number[]} a touple: [version, max] - version= the version of encoding, max = the size of the block. 
*/
function determineMinVersionByErrorRate(string, errorCorrectionLevel) {
    const len = string.length;
    const sizes = sizesByCorrectionLevel[errorCorrectionLevel];
    for (const [version, max] of Object.entries(sizes)) {
        if (len <= max) return [version, max];
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

/**
    * converts the given string to a Uint8Array of bytes encoded in the correct format by the provided verison.
    * @param {string} string - The data to encode 
    * @param {number} bitLength - The bitlength for the version by encoding type. 
    * @param {number} dataSize - the amount of data to encode, also determined by the version and error rate 
    * @return {Uint8Array[]} Uint8Array of the converted data 
*/
function convertStringToBytes(string, bitLength, dataSize) {
    const data = new Uint8Array(dataSize);
    const rightShift = (4 + bitLength) & 7;
    const leftShift = (8 - rightShift);
    const andMask = (1 << rightShift) - 1;
    const dataIndexStart = bitLength > 12 ? 2 : 1;
    const len = string.length;

    data[0] = 64 + (len >> (bitLength - 4));
    if (bitLength > 12) {
        data[1] = (len >> rightShift) && 255;
    }
    data[dataIndexStart] = (len & andMask) << leftShift;

    for (let i = 0; i < len; i++) {
        const byte = string.charCodeAt(i);
        data[i + dataIndexStart] |= byte >> rightShift;
        data[i + dataIndexStart + 1] = (byte & andMask) << leftShift;
    }

    const remainder = dataSize - len - dataIndexStart - 1;
    for (let i = 0; i < remainder; i++) {
        const byte = i & 1 ? 17 : 236;
        data[i + len + 2] = byte;
    }

    return data;
}
