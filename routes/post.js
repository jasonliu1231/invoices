let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Post = require("../controller/post.js");
const Common = require("../controller/common.js");

router.post("/customer/:userid", async function (req, res, next) {
    const userid = req.params.userid;
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.customercreate) {
            throw "權限不足";
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

router.post("/product/:userid", async function (req, res, next) {
    const userid = req.params.userid;
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.productscreate) {
            throw "權限不足";
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

router.post("/user/:userid", async function (req, res, next) {
    const userid = req.params.userid;
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.userscreate) {
            throw "權限不足";
        }
        const post = new Post();
        await post.user(client, body);
        res.send();
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
