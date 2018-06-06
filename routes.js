'use strict';

const fetchCondtroller = require('./controllers/fetch.controller.js');

const router = require('koa-router')();

router.get('/getStyles/:from', fetchCondtroller.get);


module.exports = router;
