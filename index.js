'use strict';
const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const cors = require('kcors');
require('dotenv').config();

const errorHandler = require(__dirname+'/middlewares/error-handler');
const router = require(__dirname+'/routes.js');

app
.use(logger())
.use(cors())
.use(bodyParser())
.use(errorHandler)
.use(router.routes())
.use(router.allowedMethods())


const port = process.env.PORT || 3000;
app.listen(port,()=>{
  // eslint-disable-next-line
  console.log('Listening to %s', port);
});