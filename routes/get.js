let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");

router.get("/company", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const result = await get.company(client);
        res.send(result[0]);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/customer", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.customerread) {
            throw '權限不足！'
        }
        const get = new Get();
        const result = await get.allCustomer(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/customer/:from", async function (req, res, next) {
    const from = req.params.from;
    const condition = req.query.condition;
    const db = new DB();
    const client = await db.connectpgdb();
    let result;
    try {
        if (!req.session.permis.customerread) {
            throw '權限不足！'
        }
        const get = new Get();
        if (from === "setting") {
            result = await get.customerFromSetting(client, condition);
        }
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/product", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.productsread) {
            throw '權限不足！'
        }
        const get = new Get();
        const result = await get.allproducts(client);
        res.send(result);
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
        if (!req.session.permis.productsread) {
            throw '權限不足！'
        }
        const get = new Get();
        let result = await get.product(client, id);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/user", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.usersread) {
            throw '權限不足！'
        }
        const get = new Get();
        const result = await get.alluser(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/user/:id", async function (req, res, next) {
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.usersread) {
            throw '權限不足！'
        }
        const get = new Get();
        let result = await get.user(client, id);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
