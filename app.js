require("dotenv").config(); // 環境變數
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const indexRouter = require('./routes/index');
const getRouter = require('./routes/get');
const putRouter = require('./routes/put');
const postRouter = require('./routes/post');
const deleteRouter = require('./routes/delete');
const patchRouter = require('./routes/patch');

const app = express();
const port = 3000;

app.use(
  session({
      secret: "invoice app", //secret的值建议使用随机字符串
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 60 * 60 * 1000 } // 过期时间（毫秒）
  })
);

// Swagger配置選項
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '電子發票 API',
      version: '1.0',
    },
  },
  apis: ['swagger/*.yaml'], // 要包含在Swagger文檔中的API文件的路徑
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/get', getRouter);
app.use('/put', putRouter);
app.use('/post', postRouter);
app.use('/delete', deleteRouter);
app.use('/patch', patchRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log('http://localhost:3000')
})

module.exports = app;
