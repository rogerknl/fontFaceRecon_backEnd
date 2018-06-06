'use strict';

const puppeteer = require(__dirname + '/../services/puppet.js');

module.exports.getStyle = async (ctx, next) => {
  ctx.body = await puppeteer.puppetRequest(ctx.request.query.url,"options","options2");
};