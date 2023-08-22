let express = require("express");
let router = express.Router();
const DB = require("../conndb.js");
const Get = require("../get.js");

router.post("/signin", async function (req, res, next) {
    /**
     * @swagger
     * /users/signin:
     *   post:
     *     summary: 返回登入資訊
     *     responses:
     *       200:
     *         description: 成功響應
     *         content:
     *           application/json:
     *             example:
     *               name:
     *               userid:
     *               sellerid:
     *               unum:
     *               sellername:
     *       500:
     *         description: 登入錯誤
     *         content:
     *           text:
     *             example: "帳號密碼錯誤或是該用戶停用中！！"
     */
    const req_body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const result = await get.signin(client, req_body);
        if (result.length == 0) {
            throw "帳號密碼錯誤或是該用戶停用中！！";
        } else {
            const data = result[0];
            req.session.name = data.name; // 使用者名稱
            req.session.userid = data.userid; // 使用者編號
            req.session.sellerid = data.sellerid; // 所屬公司
            req.session.unum = data.unum; // 公司統一編號
            req.session.sellername = data.sellername; // 公司名稱
            res.send(data);
        }
    } catch (err) {
        res.status(500).send(err);
    } finally {
        if (client) {
            client.release();
        }
    }
});

// LOGOUT
router.get("/logout", async (req, res) => {
    /**
     * @swagger
     * /users/logout:
     *   post:
     *     summary: 登出
     *     responses:
     *       200:
     *         description: 成功響應
     */
    req.session.destroy(() => {
        console.log("session destroyed");
    });
    res.render("index");
});

module.exports = router;
