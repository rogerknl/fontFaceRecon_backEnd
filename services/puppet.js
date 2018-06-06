'use stricts';
const puppeteer = require('puppeteer');

module.exports.puppetRequest = async (url,...args) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.setViewport({
    width: 800,
    height: 600
  })
  const styles = await page.evaluate((test) => {
    const getComputetOf = (str) => {
      const result = [];
      const qr = document.querySelectorAll(str);
      for (let i = 0; i < qr.length; i++) {
        result.push(qr[i].className);
        //result.push(JSON.parse(JSON.stringify(getComputedStyle(qr[i]).getPropertyValue('font'))));
        const obj = JSON.parse(JSON.stringify(getComputedStyle(qr[i])));
        result.push({
          'font': obj['font'],
          'textDecoration': obj['textDecoration']
        });
      }
      return result;
    }
    return {
      body: getComputetOf('body'),
      p: getComputetOf('p'),
      h1: getComputetOf('h1'),
      h2: getComputetOf('h2'),
      h3: getComputetOf('h3'),
      h4: getComputetOf('h4'),
      h5: getComputetOf('h5'),
      h6: getComputetOf('h6'),
      a: getComputetOf('a'),
      b: getComputetOf('b'),
      span: getComputetOf('span')
    };
  },args);

  browser.close();


  return styles;
};