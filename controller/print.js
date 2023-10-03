const PDFDocument = require("pdfkit");
const bwipjs = require("bwip-js");
const Qrcode = require("./qrcode.js");
const qrcode = new Qrcode();

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

// QRcode 字串
function getCodestr(invoiceMain, invoiceDetails, seller) {
    // 這邊是照 QRCodeINV 文件列出的參數
    const InvoiceNumber = invoiceMain.inum,
        InvoiceDate = invoiceMain.date,
        InvoiceTime = invoiceMain.time,
        RandomNumber = invoiceMain.randomnumber,
        SalesAmount = invoiceMain.salesamount,
        TaxAmount = invoiceMain.taxamount,
        TotalAmount = invoiceMain.totalamount,
        BuyerIdentifier = invoiceMain.buyerunum,
        RepresentIdentifier = "00000000", // 該欄位暫時用不到放入 8 個零
        SellerIdentifier = seller.unum,
        BusinessIdentifier = invoiceMain.sellerid,
        ProductArrays = invoiceDetails;

    let barcodestr = "",
        qrcodestr = "",
        productstr = "**";

    // QRcode
    // 發票字軌號碼 (10):記錄發票完整10碼字軌號碼。
    qrcodestr = InvoiceNumber;
    // 發票開立日期 (7):記錄發票3碼民國年份2碼月份2碼日期共7碼。
    // 用 js 性質字串可以減數字，月日固定後四碼所以都是零。應該也不用轉字串，會自動轉換。
    qrcodestr += (InvoiceDate - 19110000).toString();
    // 隨機碼 (4):記錄發票4碼隨機碼。
    qrcodestr += RandomNumber;
    // 銷售額 (8):記錄發票未稅總金額總計 8 碼，將金額轉換以十六進位方式記載。 若買受人為非營業人且銷售系統無法順利將稅項分離計算，則以 00000000 記載， 不足8碼左補0。
    qrcodestr += Number(SalesAmount).toString("16").padStart(8, "0");
    // 總計額 (8):記錄發票含稅總金額總計 8 碼，將金額轉換以十六進位方式記載， 不足8碼左補0。
    qrcodestr += Number(TotalAmount).toString("16").padStart(8, "0");
    // 買方統一編號 (8):記錄發票買受人統一編號，若買受人為一般消費者則以 00000000 記載。
    qrcodestr += BuyerIdentifier == null ? "00000000" : BuyerIdentifier;
    // 賣方統一編號 (8):記錄發票賣方統一編號。
    qrcodestr += SellerIdentifier;
    // 加密驗證資訊 (24):將發票字軌號碼10碼及隨機碼4碼以字串方式合併後使用 AES 加密並採用 Base64 編碼轉換。
    qrcodestr += qrcode.qrcodeEncryptor(InvoiceNumber + RandomNumber);
    // 營業人自行使用區 (10碼)
    qrcodestr += ":**********";
    // 二維條碼記載完整品目筆數，為了不要讓QRcode掃不出來，只顯示一筆
    let record_count = 1;
    qrcodestr += `:${record_count}`;
    // 該張發票交易品目總筆數，這邊要記錄該次交易的總比數
    let total_count = ProductArrays.length;
    qrcodestr += `:${total_count}`;
    // 中文編碼參數 (1 碼) ，0 = Big5, 1 = UTF-8, 2 = Base64
    qrcodestr += ":1:";

    // 商品名係（品名:數量:單價），雖然我們只有紀錄一筆但是還是用回圈以防以後要修改成多筆
    for (let i = 0; i < record_count; i++) {
        productstr += `${ProductArrays[i].productname.toString("UTF-8")}`;
        productstr += `:${ProductArrays[i].quantity}`;
        productstr += `:${ProductArrays[i].unitprice}`;
    }

    // Barcode
    // 發票年期別 (5):記錄發票字軌所屬民國年份(3碼)及期別之雙數月份(2碼)
    const [y, m] = dateStringToPeriod(InvoiceDate);
    barcodestr = y + m;
    // 發票字軌號碼 (10):記錄發票完整10碼字軌號碼。
    barcodestr += InvoiceNumber;
    // 隨機碼 (4):記錄發票4碼隨機碼。
    barcodestr += RandomNumber;
    return [barcodestr, qrcodestr, productstr];
}

class Print {
    async invoice(res, printInfo) {
        // 創建 PDF 文檔
        let invoice_width = 162,
            invoice_height = 190;
        const doc = new PDFDocument({
            size: [invoice_width, invoice_height]
        });

        // 取得條碼字串
        const codestr = getCodestr(
            printInfo.invoiceMain,
            printInfo.invoiceDetails,
            printInfo.seller
        );

        doc.font(`./fontfamily/msyh.ttf`); // 要找中文字型不然會亂碼

        doc.fontSize(20);
        doc.fillOpacity(0.3);
        doc.text("非正式發票", 0, 80, {
            height: invoice_height,
            width: invoice_width,
            align: "center",
            valign: "center"
        });

        // 發票標頭
        doc.fillOpacity(1);
        doc.fontSize(12);
        if (printInfo.seller.printtype == 1) {
            doc.text(`${printInfo.seller.name}`, 0, 0, {
                width: invoice_width,
                align: "center"
            });
        } else if (printInfo.seller.printtype == 2) {
            doc.image(printInfo.seller.invoicetitleimage, 10, 0, {
                fit: [invoice_width - 20, 30],
                align: "center",
                valign: "center"
            });
        } else if (printInfo.seller.printtype == 3) {
            doc.text(`${printInfo.seller.customname}`, 0, 0, {
                width: invoice_width,
                align: "center"
            });
        }

        // 電子發票證明聯，如果資料庫記錄有列印過就增加補印
        const printed = printInfo.invoiceMain.isprint ? "補印" : "";

        doc.fontSize(14);
        doc.text(`電子發票證明聯 ${printed}`, 0, 30, {
            width: invoice_width,
            align: "center"
        });

        // 發票所屬月份
        const [year, month] = dateStringToPeriod(printInfo.invoiceMain.date);
        doc.fontSize(18);
        doc.text(
            `${year}年${
                month - 1 < 10 ? "0" + (month - 1).toString() : month - 1
            }-${month}月`,
            0,
            48,
            {
                width: invoice_width,
                align: "center",
                margin: 0
            }
        );

        // 發票字軌
        doc.text(`${printInfo.invoiceMain.inum}`, 0, 66, {
            width: invoice_width,
            align: "center"
        });

        doc.fontSize(8);
        // 交易日期，時間，格式
        let w = invoice_width / 3;
        doc.text(dateStringToDate(printInfo.invoiceMain.date), 15, 84, {
            height: 10,
            width: w,
            align: "left"
        });
        doc.text(`${printInfo.invoiceMain.time}`, w, 84, {
            height: 10,
            width: w,
            align: "center"
        });
        // 發票的格式 B2B 需要用到格式
        if (printInfo.invoiceMain.buyerunum) {
            doc.text(`格式:25`, 2 * w, 84, {
                height: 10,
                width: w,
                align: "left"
            });
        }

        // 隨機碼，總額（含稅）
        w = invoice_width / 2;
        doc.text(`隨機碼:${printInfo.invoiceMain.randomnumber}`, 15, 94, {
            height: 10,
            width: w,
            align: "left"
        });
        doc.text(`總計:${printInfo.invoiceMain.totalamount}`, w, 94, {
            height: 10,
            width: w,
            align: "left"
        });

        // 營業人統編
        doc.text(`賣方:${printInfo.seller.unum}`, 15, 104, {
            height: 10,
            width: w,
            align: "left"
        });
        // 買方沒統編就不顯示
        if (printInfo.invoiceMain.buyerunum) {
            doc.text(`買方:${printInfo.invoiceMain.buyerunum}`, w, 104, {
                height: 10,
                width: w,
                align: "left"
            });
        }

        // codestr = [一維條碼, 二維條碼左邊, 二維條碼右邊]
        // 一維條碼
        await Barcode_img(codestr[0]).then((barcode) => {
            doc.image(barcode, 15, 116, {
                width: invoice_width - 30,
                height: 12,
                align: "center"
            });
        });

        // 二維條碼
        await QRCode_img(codestr[1]).then((qrcode) => {
            doc.image(qrcode, 25, 131, {
                height: 50,
                width: 50
            });
        });
        await QRCode_img(codestr[2]).then((qrcode) => {
            doc.image(qrcode, 89, 131, {
                height: 50,
                width: 50
            });
        });

        doc.text(`換貨憑電子發票證明聯正本辦理`, 0, 181, {
            height: 10,
            width: invoice_width,
            align: "center"
        });
        // 结束 PDF 流
        doc.end();
        // 将 PDF 回傳
        doc.pipe(res);
    }

    async invoiceAndStatement(res, printInfo) {
        // 創建 PDF 文檔
        let invoice_width = 162,
            invoice_height = 190,
            details_height = 145 + 20 * printInfo.invoiceDetails.length;

        if (printInfo.invoiceMain.buyerunum) {
            invoice_height += details_height;
        }
        const doc = new PDFDocument({
            size: [invoice_width, invoice_height]
        });

        // 取得條碼字串
        const codestr = getCodestr(
            printInfo.invoiceMain,
            printInfo.invoiceDetails,
            printInfo.seller
        );
        // console.log(codestr);
        doc.font(`./fontfamily/msyh.ttf`); // 要找中文字型不然會亂碼

        doc.fontSize(20);
        doc.fillOpacity(0.3);
        doc.text("非正式發票", 0, 80, {
            height: invoice_height,
            width: invoice_width,
            align: "center",
            valign: "center"
        });

        // 發票標頭
        doc.fillOpacity(1);
        doc.fontSize(12);
        if (printInfo.seller.printtype == 1) {
            doc.text(`${printInfo.seller.name}`, 0, 0, {
                width: invoice_width,
                align: "center"
            });
        } else if (printInfo.seller.printtype == 2) {
            doc.image(printInfo.seller.invoicetitleimage, 10, 0, {
                fit: [invoice_width - 20, 30],
                align: "center",
                valign: "center"
            });
        } else if (printInfo.seller.printtype == 3) {
            doc.text(`${printInfo.seller.customname}`, 0, 0, {
                width: invoice_width,
                align: "center"
            });
        }

        // 電子發票證明聯，如果資料庫記錄有列印過就增加補印
        const printed = printInfo.invoiceMain.printmark === "Y" ? "補印" : "";

        doc.fontSize(14);
        doc.text(`電子發票證明聯 ${printed}`, 0, 30, {
            width: invoice_width,
            align: "center"
        });

        // 發票所屬月份
        const [year, month] = dateStringToPeriod(printInfo.invoiceMain.date);
        doc.fontSize(18);
        doc.text(
            `${year}年${
                month - 1 < 10 ? "0" + (month - 1).toString() : month - 1
            }-${month}月`,
            0,
            48,
            {
                width: invoice_width,
                align: "center",
                margin: 0
            }
        );

        // 發票字軌
        doc.text(`${printInfo.invoiceMain.inum}`, 0, 66, {
            width: invoice_width,
            align: "center"
        });

        doc.fontSize(8);
        // 交易日期，時間，格式
        let w = invoice_width / 3;
        doc.text(dateStringToDate(printInfo.invoiceMain.date), 15, 84, {
            height: 10,
            width: w,
            align: "left"
        });
        doc.text(`${printInfo.invoiceMain.time}`, w, 84, {
            height: 10,
            width: w,
            align: "center"
        });
        // 發票的格式 B2B 需要用到格式
        if (printInfo.invoiceMain.buyerunum) {
            doc.text(`格式:25`, 2 * w, 84, {
                height: 10,
                width: w,
                align: "left"
            });
        }

        // 隨機碼，總額（含稅）
        w = invoice_width / 2;
        doc.text(`隨機碼:${printInfo.invoiceMain.randomnumber}`, 15, 94, {
            height: 10,
            width: w,
            align: "left"
        });
        doc.text(`總計:${printInfo.invoiceMain.totalamount}`, w, 94, {
            height: 10,
            width: w,
            align: "left"
        });

        // 營業人統編
        doc.text(`賣方:${printInfo.seller.unum}`, 15, 104, {
            height: 10,
            width: w,
            align: "left"
        });
        // 買方沒統編就不顯示
        if (printInfo.invoiceMain.buyerunum) {
            doc.text(`買方:${printInfo.invoiceMain.buyerunum}`, w, 104, {
                height: 10,
                width: w,
                align: "left"
            });
        }

        // codestr = [一維條碼, 二維條碼左邊, 二維條碼右邊]
        // 一維條碼
        await Barcode_img(codestr[0]).then((barcode) => {
            doc.image(barcode, 15, 116, {
                width: invoice_width - 30,
                height: 12,
                align: "center"
            });
        });

        // 二維條碼
        await QRCode_img(codestr[1]).then((qrcode) => {
            doc.image(qrcode, 25, 131, {
                height: 50,
                width: 50
            });
        });
        await QRCode_img(codestr[2]).then((qrcode) => {
            doc.image(qrcode, 89, 131, {
                height: 50,
                width: 50
            });
        });

        doc.text(`換貨憑電子發票證明聯正本辦理`, 0, 181, {
            height: 10,
            width: invoice_width,
            align: "center"
        });

        // 明細分割

        // 如果是 B2B 要印出發票明細不能裁切
        let details_index = 0;
        if (printInfo.invoiceMain.buyerunum) {
            details_index = 191;
            doc.text(
                `----------------------------------------`,
                0,
                details_index,
                {
                    height: 1,
                    width: invoice_width,
                    align: "center"
                }
            );
        } else {
            doc.addPage({
                size: [invoice_width, details_height]
            });
        }
        details_index += 10;

        // 標頭
        doc.fontSize(12).text(`帳單明細`, 0, details_index, {
            height: 20,
            width: invoice_width,
            align: "center"
        });
        details_index += 20;

        doc.fontSize(8);
        // 日期，時間
        doc.text(
            dateStringToDate(printInfo.invoiceMain.date),
            15,
            details_index,
            {
                height: 10,
                width: 50
            }
        );
        doc.text(`${printInfo.invoiceMain.time}`, 65, details_index, {
            height: 10,
            width: 50
        });
        details_index += 20;

        // 商品明細
        for (let i = 0; i < printInfo.invoiceDetails.length; i++) {
            const productItem = printInfo.invoiceDetails[i];
            doc.text(`${productItem.productname}`, 15, details_index, {
                height: 10,
                width: invoice_width
            });
            details_index += 10;

            doc.text(`${Number(productItem.quantity)}`, 35, details_index, {
                height: 10,
                width: 30
            });
            doc.text(`X${Number(productItem.unitprice)}`, 65, details_index, {
                height: 10,
                width: 50
            });
            doc.text(`${Number(productItem.amount)} TX`, 115, details_index, {
                height: 10,
                width: 50
            });
            // 加總計算
            details_index += 10;
        }
        details_index += 30;
        // 總計
        doc.text(`銷售額(應稅):`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "left"
        });
        doc.text(`$${printInfo.invoiceMain.salesamount}`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "right"
        });
        details_index += 10;

        doc.text(`稅額:`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "left"
        });
        doc.text(`$${printInfo.invoiceMain.taxamount}`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "right"
        });
        details_index += 10;

        doc.text(
            `合計:${printInfo.invoiceDetails.length}筆`,
            15,
            details_index,
            {
                height: 10,
                width: invoice_width - 30,
                align: "left"
            }
        );
        doc.text(
            `總金額:$${printInfo.invoiceMain.totalamount}`,
            15,
            details_index,
            {
                height: 10,
                width: invoice_width - 30,
                align: "right"
            }
        );
        details_index += 20;
        if (printInfo.invoiceMain.mainremark) {
            doc.text(`${printInfo.invoiceMain.mainremark}`, 15, details_index, {
                height: 10,
                width: invoice_width - 30,
                align: "left"
            });
            details_index += 20;
        }

        // 结束 PDF 流
        doc.end();
        // 将 PDF 回傳
        doc.pipe(res);
    }

    async statement(res, printInfo) {
        // 創建 PDF 文檔
        let invoice_width = 162,
            details_height = 145 + 20 * printInfo.invoiceDetails.length,
            details_index = 10;
        const doc = new PDFDocument({
            // 發票長寬，之後可能 b2b 會有其他形式的發票可以直接寫‘A4'這種國際標準紙張格式。
            size: [invoice_width, details_height]
        });

        doc.font(`./fontfamily/msyh.ttf`); // 要找中文字型不然會亂碼
        details_index += 10;

        // 標頭
        doc.fontSize(12).text(`帳單明細`, 0, details_index, {
            height: 20,
            width: invoice_width,
            align: "center"
        });
        details_index += 20;

        doc.fontSize(8);
        // 日期，時間
        doc.text(
            dateStringToDate(printInfo.invoiceMain.date),
            15,
            details_index,
            {
                height: 10,
                width: 50
            }
        );
        doc.text(`${printInfo.invoiceMain.time}`, 65, details_index, {
            height: 10,
            width: 50
        });
        details_index += 20;

        // 商品明細
        for (let i = 0; i < printInfo.invoiceDetails.length; i++) {
            const productItem = printInfo.invoiceDetails[i];
            doc.text(`${productItem.productname}`, 15, details_index, {
                height: 10,
                width: invoice_width
            });
            details_index += 10;

            doc.text(`${Number(productItem.quantity)}`, 35, details_index, {
                height: 10,
                width: 30
            });
            doc.text(`X${Number(productItem.unitprice)}`, 65, details_index, {
                height: 10,
                width: 50
            });
            doc.text(`${Number(productItem.amount)} TX`, 115, details_index, {
                height: 10,
                width: 50
            });
            // 加總計算
            details_index += 10;
        }
        details_index += 30;
        // 總計
        doc.text(`銷售額(應稅):`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "left"
        });
        doc.text(`$${printInfo.invoiceMain.salesamount}`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "right"
        });
        details_index += 10;

        doc.text(`稅額:`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "left"
        });
        doc.text(`$${printInfo.invoiceMain.taxamount}`, 15, details_index, {
            height: 10,
            width: invoice_width - 30,
            align: "right"
        });
        details_index += 10;

        doc.text(
            `合計:${printInfo.invoiceDetails.length}筆`,
            15,
            details_index,
            {
                height: 10,
                width: invoice_width - 30,
                align: "left"
            }
        );
        doc.text(
            `總金額:$${printInfo.invoiceMain.totalamount}`,
            15,
            details_index,
            {
                height: 10,
                width: invoice_width - 30,
                align: "right"
            }
        );
        details_index += 20;
        if (printInfo.invoiceMain.mainremark) {
            doc.text(`${printInfo.invoiceMain.mainremark}`, 15, details_index, {
                height: 10,
                width: invoice_width - 30,
                align: "left"
            });
            details_index += 20;
        }

        // 结束 PDF 流
        doc.end();
        // 将 PDF 回傳
        doc.pipe(res);
    }

    async cnote(res, printInfo) {
        const cnote_width = 162,
            cnote_height = 400 + 20 * printInfo.cnoteDetails.length;
        let cnote_index = 35;
        const doc = new PDFDocument({
            size: [cnote_width, cnote_height]
        });
        doc.font(`./fontfamily/msyh.ttf`); // 要找中文字型不然會亂碼

        doc.fontSize(12);
        // 發票標頭
        if (printInfo.seller.printtype == 1) {
            doc.text(`${printInfo.seller.name}`, 0, cnote_index, {
                width: cnote_width,
                align: "center"
            });
        } else if (printInfo.seller.printtype == 2) {
            doc.image(printInfo.seller.invoicetitleimage, 10, cnote_index, {
                fit: [cnote_width - 20, 20],
                align: "center",
                valign: "center"
            });
        } else if (printInfo.seller.printtype == 3) {
            doc.text(`${printInfo.seller.customname}`, 0, cnote_index, {
                width: cnote_width,
                align: "center"
            });
        }
        cnote_index += 20;

        // 證明聯
        let text = `營業人銷貨退出、進貨退出或折讓證明聯`,
            th = doc.heightOfString(text, { width: cnote_width - 30 });
        doc.text(text, 15, cnote_index, {
            width: cnote_width - 30,
            align: "center"
        });
        cnote_index += th + 10;

        doc.fontSize(8);
        // 折讓單日期
        doc.text(dateStringToDate(printInfo.cnoteMain.cdate), 0, cnote_index, {
            width: cnote_width,
            height: 10,
            align: "center"
        });
        cnote_index += 20;

        // 賣方統編
        doc.text(`賣方統編：${printInfo.seller.unum}`, 15, cnote_index, {
            width: cnote_width,
            height: 10
        });
        cnote_index += 15;

        // 賣方名稱
        text = `賣方名稱：${printInfo.seller.name}`;
        th = doc.heightOfString(text, { width: cnote_width - 30 });
        doc.text(text, 15, cnote_index, {
            width: cnote_width - 30,
            height: 10
        });
        cnote_index += 15;

        // 發票開立日期
        doc.text(dateStringToDate(printInfo.cnoteMain.idate), 15, cnote_index, {
            width: cnote_width,
            height: 10
        });
        cnote_index += 15;

        // 發票字軌
        doc.text(`發票號碼：${printInfo.cnoteMain.inum}`, 15, cnote_index, {
            width: cnote_width,
            height: 10
        });
        cnote_index += 15;

        // 買方統編
        doc.text(
            `買方統編：${printInfo.cnoteMain.buyerunum}`,
            15,
            cnote_index,
            {
                width: cnote_width,
                height: 10
            }
        );
        cnote_index += 15;

        // 買方名稱
        doc.text(
            `買方名稱：${printInfo.cnoteMain.buyername}`,
            15,
            cnote_index,
            {
                width: cnote_width,
                height: 10
            }
        );
        cnote_index += 10;

        doc.text(`----------------------------------------`, 0, cnote_index, {
            height: 1,
            width: cnote_width,
            align: "center"
        });
        cnote_index += 10;

        // 明細標頭
        text = `營業人銷貨退出、進貨退出明細`;
        th = doc.heightOfString(text, { width: cnote_width - 30 });
        doc.fontSize(12).text(text, 15, cnote_index, {
            width: cnote_width - 30,
            align: "center"
        });
        cnote_index += th + 20;

        doc.fontSize(8);
        doc.text(`----------------------------------------`, 0, cnote_index, {
            height: 1,
            width: cnote_width,
            align: "center"
        });
        cnote_index += 10;

        // 退貨商品明細
        for (let i = 0; i < printInfo.cnoteDetails.length; i++) {
            const info = printInfo.cnoteDetails[i];
            doc.text(`${info.productname}`, 15, cnote_index, {
                height: 10,
                width: cnote_width
            });
            cnote_index += 10;

            doc.text(`${info.quantity}`, 35, cnote_index, {
                height: 10,
                width: 30
            });
            doc.text(`X${info.unitprice}`, 65, cnote_index, {
                height: 10,
                width: 50
            });
            doc.text(`$${info.amount}`, 115, cnote_index, {
                height: 10,
                width: 50
            });
            // 加總計算
            cnote_index += 10;
        }

        doc.text(`----------------------------------------`, 0, cnote_index, {
            height: 1,
            width: cnote_width,
            align: "center"
        });
        cnote_index += 10;

        doc.text(`金額(不含稅之進貨額):`, 15, cnote_index, {
            height: 10,
            width: cnote_width - 30,
            align: "left"
        });
        doc.text(`$${printInfo.cnoteMain.saleamount}`, 15, cnote_index, {
            height: 10,
            width: cnote_width - 30,
            align: "right"
        });
        cnote_index += 10;

        doc.text(`營業稅額:`, 15, cnote_index, {
            height: 10,
            width: cnote_width - 30,
            align: "left"
        });
        doc.text(`$${printInfo.cnoteMain.taxamount}`, 15, cnote_index, {
            height: 10,
            width: cnote_width - 30,
            align: "right"
        });
        cnote_index += 10;

        doc.text(`合計:${printInfo.cnoteDetails.length}筆`, 15, cnote_index, {
            height: 10,
            width: cnote_width - 30,
            align: "left"
        });
        doc.text(
            `總金額:$${printInfo.cnoteMain.totalamount}`,
            15,
            cnote_index,
            {
                height: 10,
                width: cnote_width - 30,
                align: "right"
            }
        );
        cnote_index += 20;

        doc.text(`簽收人：`, 15, cnote_index, {
            height: 10,
            width: cnote_width - 30,
            align: "left"
        });
        cnote_index += 20;

        // 结束 PDF 流
        doc.end();
        // 将 PDF 回傳
        doc.pipe(res);
    }
}

module.exports = Print;
