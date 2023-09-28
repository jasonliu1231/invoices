const crypto = require("crypto");

const QRCodeAesEncodeKey = Buffer.from(process.env.QRCODE_AES_KEY, "hex");
const EINVOICE_IV = Buffer.from("Dt8lyToo17X/XkXaQvihuA==", "base64");
const ALGORITHM = "aes-128-cbc";

class Qrcode {
    async qrcodeEncryptor(str) {
        const cipher = crypto.createCipheriv(
            ALGORITHM,
            QRCodeAesEncodeKey,
            EINVOICE_IV
        );
        const encodedDataBuf = Buffer.concat([
            cipher.update(str),
            cipher.final()
        ]);
        return Buffer.from(encodedDataBuf).toString("base64").padEnd(0x18);
    }

    async qrcodeDecryptor(encryptStrWith64) {
        const encryptdata = Buffer.from(encryptStrWith64, "base64");
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            QRCodeAesEncodeKey,
            EINVOICE_IV
        );
        const decodedBuf = Buffer.concat([
            decipher.update(encryptdata),
            decipher.final()
        ]);
        return Buffer.from(decodedBuf).toString();
    }
}

module.exports = Qrcode;
