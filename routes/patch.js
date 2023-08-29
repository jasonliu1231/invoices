let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Patch = require("../controller/patch.js");

router.get("/company", async function (req, res, next) {
    const db = new DB();
    const client = await db.connectpgdb();
    try {
    } catch (error) {
        res.status(404).send(error);
    } finally {
        client.release();
    }
});

module.exports = router;
