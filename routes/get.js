let express = require("express");
let router = express.Router();
const db = require("../conndb.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

module.exports = router;