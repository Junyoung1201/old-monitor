export async function createSHA256(message, key) {
    // 키와 메시지를 Uint8Array로 변환
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);
    
    // CryptoKey 객체 생성
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    
    // HMAC 서명 생성
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    
    // ArrayBuffer를 16진수 문자열로 변환
    const hashArray = Array.from(new Uint8Array(signature));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

export async function copyText(text) {
    return navigator.clipboard.writeText(text)
}