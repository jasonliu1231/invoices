let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Delete = require("../controller/delete.js");
const Common = require("../controller/common.js");

router.get("/customer/:id", async function (req, res, next) {
    const userid = req.headers['userid'];
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.customerdelete) {
            throw "權限不足";
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
    const userid = req.headers['userid'];
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.productsdelete) {
            throw "權限不足";
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

router.get("/user/:id", async function (req, res, next) {
    const userid = req.headers['userid'];
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.usersdelete) {
            throw "權限不足";
        }
        const deletedata = new Delete();
        await deletedata.user(client, id);
        res.send();
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
