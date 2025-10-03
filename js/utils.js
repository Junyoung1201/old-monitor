export async function createSHA256(message, key) {

    // 키, 메시지 -> Uint8Array로 변환
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    
    // array buffer를 16진수 문자열로 변환
    const hashArray = Array.from(new Uint8Array(sig));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

export async function copyText(text) {
    return navigator.clipboard.writeText(text)
}