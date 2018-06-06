'use stricts';
const puppeteer = require('puppeteer');

module.exports.puppetRequest = async (url, ...args) => {
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
        let uniq = true;
        const obj = JSON.parse(JSON.stringify(getComputedStyle(qr[i])));
        for (let j = 0; (j < result.length) && (uniq); j++) {
          if (
            result[j].class === qr[i].className &&
            result[j].font === obj.font &&
            result[j].textDecoration === obj.textDecoration
          ) uniq = false;
        }
        if (uniq) {
          result.push({
            'class': qr[i].className,
            'font': obj['font'],
            'textDecoration': obj['textDecoration']
          });
        }
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
  }, args);

  browser.close();


  return styles;
};