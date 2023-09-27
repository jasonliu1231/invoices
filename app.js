require("dotenv").config(); // 環境變數
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const indexRouter = require("./routes/index");
const getRouter = require("./routes/get");
const putRouter = require("./routes/put");
const postRouter = require("./routes/post");
const deleteRouter = require("./routes/delete");
const patchRouter = require("./routes/patch");
const printRouter = require("./routes/print");

const app = express();
const port = 3000;
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*"); // 允許從所有來源發送請求，也可以指定特定的來源
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); // 允許的 HTTP 方法
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    ); // 允許的請求標頭
    next();
});

// Swagger配置選項
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "電子發票 API",
            version: "1.0"
        }
    },
    apis: ["swagger/*.yaml"] // 要包含在Swagger文檔中的API文件的路徑
};

const specs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/get", getRouter);
app.use("/put", putRouter);
app.use("/post", postRouter);
app.use("/delete", deleteRouter);
app.use("/patch", patchRouter);
app.use("/print", printRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

app.listen(port, () => {
    console.log("http://localhost:3000");
});

module.exports = app;
