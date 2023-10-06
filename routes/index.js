let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Index = require("../controller/index.js");

router.get("/", function (req, res, next) {
    res.render("index", { title: "index" });
});

router.get(
    [
        "/company/:token",
        "/customer/:token",
        "/products/:token",
        "/user/:token",
        "/track/:token",
        "/b2cinvoice/:token",
        "/cnote/:token",
        "/voidinvoice/:token",
        "/voidcnote/:token",
        "/printpdf/:token",
        "/xmlsample/:token",
        "/searchinvoice/:token",
        "/searchconte/:token",
    ],
    async (req, res) => {
        const token = req.params.token;
        const db = new DB();
        const client = await db.connectpgdb();
        try {
            const index = new Index();
            const result = await index.session(client, token);
            if (result) {
                const template = req.path.split("/")[1];
                res.render(template, { title: template });
            } else {
                res.render("index", { title: "index" });
            }
        } catch (error) {
            res.status(404).send(error);
        } finally {
            client.release();
        }
    }
);

router.get("/login/:token", async function (req, res, next) {
    const token = req.params.token;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const index = new Index();
        const result = await index.session(client, token);
        if (result) {
            res.status(200).send();
        } else {
            res.status(500).send();
        }
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

router.post("/login", async function (req, res, next) {
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const index = new Index();
        const result = await index.login(client, body);
        res.send(result);
    } catch (err) {
        res.status(404).send(err);
    } finally {
        if (client) {
            client.release();
        }
    }
});

router.get("/logout/:token", async (req, res) => {
    const token = req.params.token;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const index = new Index();
        await index.logout(client, token);
        res.render("index", { title: "index" });
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
