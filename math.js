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


