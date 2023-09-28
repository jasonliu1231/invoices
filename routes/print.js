let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");
const Common = require("../controller/common.js");
const Print = require("../controller/print.js");


router.get("/invoicepdf", async (req, res) => {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="example.pdf"');
    const print = new Print()
    await print.invoice(res);
});


module.exports = router;