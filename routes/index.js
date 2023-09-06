let express = require("express");
let router = express.Router();
const DB = require("../controller/conndb.js");
const Get = require("../controller/get.js");

router.get("/", function (req, res, next) {
    res.render("index", { title: "index" });
});

router.get(
    [
        "/company",
        "/customer",
        "/products",
        "/cnote",
        "/voidinvoice",
        "/voidcnote",
        "/b2cinvoice",
        "/search",
        // "/user",
        "/mediafile",
        "/updateinvoice",
        "/invoiceadmin",
        "/searchInvoiceCount"
    ],
    async (req, res) => {
        // if (!!req.session.user) {
        //     const template = req.path.slice(1);
        //     res.render(template, { title: template, session: req.session });
        // } else {
        //     res.render("index", { title: "index" });
        // }
        const template = req.path.slice(1);
        res.render(template, { title: template, session: req.session });
    }
);

router.get("/user", async () => {
    res.render("user", { title: template, session: req.session });
})

router.post("/login", async function (req, res, next) {
    const body = req.body;
    const db = new DB();
    const client = await db.connectpgdb();
    try {
        const get = new Get();
        const result = await get.login(client, body);
        if (result.length === 0) {
            throw "帳號密碼錯誤或是該用戶停用中！！";
        } else {
            const data = result[0];
            req.session.unum = data.unum;
            req.session.user = {
                id: data.id, // 使用者id
                name: data.name // 使用者名稱
            };
            req.session.permis = {
                companyupdate: data.companyupdate,
                customercreate: data.customercreate,
                customerupdate: data.customerupdate,
                customerread: data.customerread,
                customerdelete: data.customerdelete,
                productscreate: data.productscreate,
                productsupdate: data.productsupdate,
                productsread: data.productsread,
                productsdelete: data.productsdelete,
                invoicecreate: data.invoicecreate,
                invoiceupdate: data.invoiceupdate,
                invoiceread: data.invoiceread,
                invoicedelete: data.invoicedelete,
                userscreate: data.userscreate,
                usersupdate: data.usersupdate,
                usersread: data.usersread,
                usersdelete: data.usersdelete
            };
        }
        res.send();
    } catch (err) {
        res.status(404).send(err);
    } finally {
        if (client) {
            client.release();
        }
    }
});

router.get("/logout", async (req, res) => {
    req.session.destroy(() => {
        console.log("session destroyed");
        res.render("index", { title: "index" });
    });
});

module.exports = router;
