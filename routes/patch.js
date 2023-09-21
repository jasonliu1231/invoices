let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Patch = require("../controller/patch.js");
const Common = require("../controller/common.js");

router.post("/user/:id", async function (req, res, next) {
    const userid = req.headers['userid'];
    const body = req.body;
    const id = req.params.id;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        // 檢查權限
        const common = new Common();
        let result = await common.permis(client, userid);
        if (!result.usersupdate) {
            throw "權限不足";
        }
        result = await common.checkid(client, 'users', id);
        if (!result) {
            throw "id 不存在，請再次確認是否正確！";
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
