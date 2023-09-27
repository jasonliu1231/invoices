let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");
const Common = require("../controller/common.js");
const PDFDocument = require("pdfkit");
const fs = require("fs");

router.get("/generatepdf", (req, res) => {
    // 设置响应头，指定内容类型为 PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="example.pdf"');

    const todey = new Date();
    // 创建 PDF 文档
    const doc = new PDFDocument();

    // 将 PDF 流式输出到响应中
    doc.pipe(res);

    // 在 PDF 中添加内容
    doc.fontSize(16).text(todey.getTime(), 50, 50);

    // 结束 PDF 流
    doc.end();
});


module.exports = router;