// see: https://www.thonky.com/qr-code-tutorial/error-correction-table
// TODO: Fill out to version 40.
const codewordSizeByCorrectionLevel = {
    "L": {
        1: 19,
        2: 34,
        3: 55,
        4: 80,
        5: 108,
        6: 136,
        7: 156,
    },
    "M": {
        1: 16,
        2: 28,
        3: 44,
        4: 64,
        5: 86,
        6: 108,
        7: 124,
    },
    "Q": {
        1: 13,
        2: 22,
        3: 34,
        4: 48,
        5: 62,
        6: 76,
        7: 88,
    },
    "H": {
        1: 9,
        2: 16,
        3: 26,
        4: 36,
        5: 46,
        6: 60,
        7: 66,
    },
};

export default codewordSizeByCorrectionLevel;
