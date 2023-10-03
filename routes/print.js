let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");
const Patch = require("../controller/patch.js");
const Print = require("../controller/print.js");

router.get("/invoicePDF/:id", async (req, res) => {
    const id = req.params.id;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="example.pdf"');
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const printInfo = await get.printInvoiceInfo(client, id);
        const print = new Print();
        print.invoice(res, printInfo);
        const patch = new Patch();
        patch.invoicePrint(client, id);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/invoiceAndStatementPDF/:id", async (req, res) => {
    const id = req.params.id;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="example.pdf"');
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const printInfo = await get.printInvoiceInfo(client, id);
        const print = new Print();
        print.invoiceAndStatement(res, printInfo);
        const patch = new Patch();
        patch.invoicePrint(client, id);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/statementPDF/:id", async (req, res) => {
    const id = req.params.id;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="example.pdf"');
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const printInfo = await get.printInvoiceInfo(client, id);
        const print = new Print();
        print.statement(res, printInfo);
        const patch = new Patch();
        patch.invoicePrint(client, id);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/cnote/:id", async (req, res) => {
    const id = req.params.id;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="example.pdf"');
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const printInfo = await get.printCnoteInfo(client, id);
        const print = new Print();
        print.cnote(res, printInfo);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
