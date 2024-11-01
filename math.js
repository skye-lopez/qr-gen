// NOTE: This math was not done by me! This was mainly sourced through various online resources.
export function getLogAndExpTables() {
    const logTable = new Uint8Array(256);
    const expTable = new Uint8Array(256);

    for (let exp = 1, v = 1; exp < 256; exp++) {
        v = v > 127 ? ((v << 1) ^ 285) : v << 1;
        logTable[v] = exp % 255;
        expTable[e % 255] = v;
    }

    return [logTable, expTable];
}

export function multiply(a, b, expTable, logTable) {
    return a && b ? expTable[(logTable[a] + logTable[b]) % 255] : 0;
}

export function divide(a, b, expTable, logTable) {
    return expTable[(logTable[a] + logTable[b] * 254) % 255];
}

export function polyCoeffs(poly1, poly2, logTable, expTable) {
    const coeffs = new Uint8Array(poly1.length + poly2.length - 1);
    for (let i = 0; i < coeffs.length; i++) {
        let coeff = 0;
        for (let p1Idx = 0; p1Idx <= i; p1Idx++) {
            const p2Idx = i - p1Idx;
            coeff ^= multiply(poly1[p1Idx], poly2[p2Idx], expTable, logTable);
        }
        coeffs[i] = coeff;
    }
    return coeffs;
}

export function polyRest(dividend, divisor, logTable, expTable) {
    const qLength = dividend.length - divisor.length + 1;
    let rest = new Uint8Array(dividend);
    for (let c = 0; c < qLength; c++) {
        if (rest[0]) {
            const factor = divide(rest[0], divisor[0], expTable, logTable);
            const subtr = new Uint8Array(rest.length);
            subtr.set(polyCoeffs(divisor, [factor], logTable, expTable), 0);
            rest = rest.map((v, idx) => v ^ subtr[idx]).slice(1);
        } else {
            rest = rest.slice(1);
        }
    }
    return rest;
}
