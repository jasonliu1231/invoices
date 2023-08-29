let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Delete = require("../controller/delete.js");

router.get("/customer/:id", async function (req, res, next) {
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.customerdelete) {
            throw '權限不足！'
        }
        const deletedata = new Delete();
        await deletedata.customer(client, id);
        res.send();
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/product/:id", async function (req, res, next) {
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.productsdelete) {
            throw '權限不足！'
        }
        const deletedata = new Delete();
        await deletedata.product(client, id);
        res.send();
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
