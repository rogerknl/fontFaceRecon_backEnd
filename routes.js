'use strict';

const fetchController = require('./controllers/fetch.controller.js');

const router = require('koa-router')();

router.get('/getStyles/', fetchController.getStyle);


module.exports = router;
