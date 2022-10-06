import CryptoJS from 'crypto-js'

export function encrypt(data: string, pass: string, iterations = 4500) {
    const keySize = 256
    const salt = CryptoJS.lib.WordArray.random(128 / 8)
    const key = CryptoJS.PBKDF2(pass, salt, {
        iterations,
        keySize: keySize / 4,
    })
    const iv = CryptoJS.lib.WordArray.random(128 / 8)
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    })
    return salt.toString() + iv.toString() + encrypted.toString()
}

export function decrypt(data: string, pass: string, iterations = 4500): string {
    const keySize = 256
    const salt = CryptoJS.enc.Hex.parse(data.substr(0, 32))
    const iv = CryptoJS.enc.Hex.parse(data.substr(32, 32))
    const encrypted = data.substring(64)
    const key = CryptoJS.PBKDF2(pass, salt, {
        iterations,
        keySize: keySize / 4,
    })
    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}
