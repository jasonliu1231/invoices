let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");
const Common = require("../controller/common.js");

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
    const userid = req.headers["userid"];
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.customerread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.allCustomer(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/customer/:from", async function (req, res, next) {
    const userid = req.headers["userid"];
    const from = req.params.from;
    const condition = req.query.condition;
    const db = new DB();
    const client = await db.connectpgdb();
    let result;
    try {
        // 檢查權限
        const common = new Common();
        result = await common.permis(client, userid);
        if (!result.customerread) {
            throw "權限不足";
        }
        const get = new Get();
        if (from === "setting") {
            result = await get.customerFromSetting(client, condition);
        } else if (from === "invoice") {
            result = await get.customerFromInvoice(client, condition);
        }
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/product", async function (req, res, next) {
    const userid = req.headers["userid"];
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.productsread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.allproducts(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/product/:id", async function (req, res, next) {
    const userid = req.headers["userid"];
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.productsread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.product(client, id);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/searchproduct", async function (req, res, next) {
    const userid = req.headers["userid"];
    const condition = req.query.condition;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.productsread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.searchProduct(client, condition);
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
    const userid = req.headers["userid"];
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.usersread && userid != id) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.user(client, id);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/track", async function (req, res, next) {
    const userid = req.headers["userid"];
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.invoiceread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.track(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/invoiceLastDate", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        result = await get.invoiceLastDate(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/invoice", async function (req, res, next) {
    const userid = req.headers["userid"];
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.invoiceread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.invoiceForDate(client);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/invoice/:inum", async function (req, res, next) {
    const userid = req.headers["userid"];
    const inum = req.params.inum;
    const type = req.query.type;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.invoiceread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.invoiceForInum(client, inum, type);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/cnotenumber", async function (req, res, next) {
    const today = req.query.today
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        result = await get.cnotenumber(client, today);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.get("/cnote/:cnum", async function (req, res, next) {
    const userid = req.headers["userid"];
    const cnum = req.params.cnum;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.invoiceread) {
            throw "權限不足";
        }
        const get = new Get();
        result = await get.cnoteForInum(client, cnum);
        res.send(result);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
