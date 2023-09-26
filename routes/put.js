let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");
const Put = require("../controller/put.js");
const Post = require("../controller/post.js");
const Common = require("../controller/common.js");

router.post("/company", async function (req, res, next) {
    const userid = req.headers["userid"];
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.companyupdate) {
            throw "權限不足";
        }
        // 檢查有無公司資料
        const get = new Get();
        result = await get.company(client);
        if (result.length != 0) {
            const put = new Put();
            await put.company(client, body);
        } else {
            const post = new Post();
            await post.company(client, body);
        }
        res.status(200).send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        client.release();
    }
});

router.post("/customer/:id", async function (req, res, next) {
    const userid = req.headers["userid"];
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.customerupdate) {
            throw "權限不足";
        }
        result = await common.checkid(client, "customer", id);
        if (!result) {
            throw "id 不存在，請再次確認是否正確！";
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
    const userid = req.headers["userid"];
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.productsupdate) {
            throw "權限不足";
        }
        result = await common.checkid(client, "product", id);
        if (!result) {
            throw "id 不存在，請再次確認是否正確！";
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

router.post("/user/:id", async function (req, res, next) {
    const userid = req.headers["userid"];
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        let justMyself = false;
        if (!result.usersupdate && userid != id) {
            throw "權限不足";
        } else if (!result.usersupdate && userid === id) {
            justMyself = true
        }
        result = await common.checkid(client, "users", id);
        if (!result) {
            throw "id 不存在，請再次確認是否正確！";
        }
        const put = new Put();
        if (justMyself) {
            await put.user(client, body, id);
        } else {
            await put.user(client, body, id);
            await put.permis(client, body, id);
        }
        res.send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        client.release();
    }
});

module.exports = router;
