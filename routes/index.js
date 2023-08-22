let express = require("express");
let router = express.Router();

router.get("/", function (req, res, next) {
    res.render("index", { title: "index" });
});

router.get(
    [
        "/company",
        "/customer",
        "/cnote",
        "/voidinvoice",
        "/voidcnote",
        "/b2cinvoice",
        "/search",
        "/user",
        "/mediafile",
        "/updateinvoice",
        "/invoiceadmin",
        "/searchInvoiceCount"
    ],
    async (req, res) => {
        if (req.session.sellerid) {
            const template = req.path.slice(1); // remove leading slash
            if (
                template == "b2cinvoice" ||
                template == "search" ||
                template == "updateinvoice" ||
                template == "customer"
            ) {
                res.render(template, {
                    id: req.session.unum,
                    sellername: req.session.sellername,
                    sellertel: req.session.sellertel
                });
            } else {
                res.render(template, { title: template });
            }
        } else {
            res.render("signin");
        }
    }
);

module.exports = router;
