let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Put = require("../controller/put.js");
const Post = require("../controller/post.js");

router.post("/company", async function (req, res, next) {
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.companyupdate) {
            throw "權限不足！";
        }
        if (!!req.session.unum) {
            const put = new Put();
            await put.company(client, body);
        } else {
            const post = new Post();
            await post.company(client, body);
            req.session.unum = body.unum;
        }
        res.send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        client.release();
    }
});

router.post("/customer/:id", async function (req, res, next) {
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.customerupdate) {
            throw "權限不足！";
        }
        const put = new Put();
        await put.customer(client, body, id);
        res.send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        client.release();
    }
});

router.post("/product/:id", async function (req, res, next) {
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.productsupdate) {
            throw "權限不足！";
        }
        const put = new Put();
        await put.product(client, body, id);
        res.send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        client.release();
    }
});

module.exports = router;
