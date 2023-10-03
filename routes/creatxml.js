let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");
const Creatxml = require("../controller/creatxml.js");

router.get("/:type/:id", async (req, res) => {
    const type = req.params.type;
    const id = req.params.id;
    res.setHeader("Content-Type", "application/xml");

    const db = new DB();
    const client = await db.connectpgdb();
    try {
        let XML;
        if (type === "C0401") {
            const get = new Get();
            const C0401Info = await get.C0401Info(client, id);
            const creatxml = new Creatxml();
            XML = await creatxml.C0401(C0401Info);
        } else if (type === "D0401") {
            const get = new Get();
            const D0401Info = await get.D0401Info(client, id);
            const creatxml = new Creatxml();
            XML = await creatxml.D0401(D0401Info);
        } else if (type === "C0501") {
            const get = new Get();
            const C0501Info = await get.C0501Info(client, id);
            const creatxml = new Creatxml();
            XML = await creatxml.C0501(C0501Info);
        } else if (type === "D0501") {
            const get = new Get();
            const D0501Info = await get.D0501Info(client, id);
            const creatxml = new Creatxml();
            XML = await creatxml.D0501(D0401Info);
        } else if (type === "E0402") {
            const get = new Get();
            const D0401Info = await get.D0401Info(client, id);
            const creatxml = new Creatxml();
            XML = await creatxml.D0401(D0401Info);
        }

        res.send(XML);
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
