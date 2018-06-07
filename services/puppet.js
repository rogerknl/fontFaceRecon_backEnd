'use stricts';
const puppeteer = require('puppeteer');

module.exports.puppetRequest = async (url, ...args) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if ( url.slice(0,7) !== "http://" && url.slice(0,8) !== "https://") url = "https://" + url;
  await page.goto(url);
  await page.setViewport({
    width: 800,
    height: 600
  })
  const img = await page.screenshot({type: 'jpeg'});
  //await new Promise (resolve =>{setTimeout(resolve,2000)});
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
            'fontFamily': obj['fontFamily'],
            'color': obj['color'],
            'font': obj['font'],
            'textDecoration': obj['textDecoration']
          });
        }
      }
      return result;
    }
    return [
      {body: getComputetOf('body')},
      {div: getComputetOf('div')},
      {p: getComputetOf('p')},
      {h1: getComputetOf('h1')},
      {h2: getComputetOf('h2')},
      {h3: getComputetOf('h3')},
      {h4: getComputetOf('h4')},
      {h5: getComputetOf('h5')},
      {h6: getComputetOf('h6')},
      {a: getComputetOf('a')},
      // {b: getComputetOf('b')},
      {span: getComputetOf('span')}
    ];
  }, args);
  browser.close();
  return {img: img.toString('base64'),styles: styles};
};