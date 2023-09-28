const PDFDocument = require("pdfkit");
const fs = require("fs");
const bwipjs = require("bwip-js");
const crypto = require("./qrcode.js");

// yyyymmdd轉yyyy/mm/dd
function dateStringToDate(ds) {
    const year = ds.substring(0, 4);
    const month = ds.substring(4, 6);
    const day = ds.substring(6, 8);
    return year + "-" + month + "-" + day;
}

// yyyymmdd轉期別
function dateStringToPeriod(ds) {
    const year = Number(ds.substring(0, 4)) - 1911;
    const month = ds.substring(4, 6);
    let period = "";
    switch (month) {
        case "01":
        case "02":
            period = "02";
            break;
        case "03":
        case "04":
            period = "04";
            break;
        case "05":
        case "06":
            period = "06";
            break;
        case "07":
        case "08":
            period = "08";
            break;
        case "09":
        case "10":
            period = "10";
            break;
        case "11":
        case "12":
            period = "12";
            break;
        default:
            break;
    }
    return [year, period];
}

// 一維碼圖片
function Barcode_img(text) {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer(
            {
                bcid: "code39",
                text,
                scale: 3,
                includetext: false
            },
            (err, png) => {
                if (err) reject(err);
                else resolve(png);
            }
        );
    });
}

// 二維碼圖片
function QRCode_img(text) {
    return new Promise((resolve, reject) => {
        bwipjs.toBuffer(
            {
                bcid: "qrcode",
                text,
                scale: 3,
                includetext: false
            },
            (err, png) => {
                if (err) reject(err);
                else resolve(png);
            }
        );
    });
}

class Print {
    async invoice(res) {
        const todey = new Date();
        // 创建 PDF 文档
        const doc = new PDFDocument();

        // 将 PDF 流式输出到响应中
        doc.pipe(res);

        // 在 PDF 中添加内容
        doc.fontSize(16).text(todey.getTime(), 50, 50);

        // 结束 PDF 流
        doc.end();
        
    }
}

module.exports = Print;
