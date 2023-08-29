let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Post = require("../controller/post.js");

router.post("/customer", async function (req, res, next) {
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.customercreate) {
            throw '權限不足！'
        }
        const post = new Post();
        await post.customer(client, body);
        res.send();
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.post("/product", async function (req, res, next) {
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.productscreate) {
            throw '權限不足！'
        }
        const post = new Post();
        await post.product(client, body);
        res.send();
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
