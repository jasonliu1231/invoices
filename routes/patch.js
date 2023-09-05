let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Patch = require("../controller/patch.js");

router.post("/user/:id", async function (req, res, next) {
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        if (!req.session.permis.usersupdate) {
            throw "權限不足！";
        }
        const patch = new Patch();
        await patch.user(client, body, id);
        res.send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        client.release();
    }
});

module.exports = router;
