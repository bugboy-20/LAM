

function fnv1aHash(str: string): number {
    let hash = 0x811c9dc5; // FNV offset basis
    for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = (hash * 0x01000193) >>> 0; // FNV prime
    }
    return hash >>> 0; // Return as unsigned 32-bit integer
}

const hash = (str: string) => fnv1aHash(str).toString(16);

export default hash;

