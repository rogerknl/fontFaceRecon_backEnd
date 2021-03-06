'use stricts';
const puppeteer = require('puppeteer');
const cache = require('./cache.js');

const puppet = {}

//
puppet.getStyles = async ( page, ...tags ) => {
  //Call the function evaluate to be able to use DOM, tag selectors are in parameters
  return await page.evaluate( ( tags ) => {

    const getComputetOf = ( str ) => {
      //init vars selecting all elements with the selector given
      const result = [];
      const qr = document.querySelectorAll( str );

      //Extract computed styles JSON pars/string required
      for ( let i = 0; i < qr.length; i++ ) {
        let uniq = true, colorUniq = true;
        const obj = JSON.parse( JSON.stringify( getComputedStyle( qr[i] ) ) );

        //check if element is already in the array and mark uniq as false if exists in it
        for ( let j = 0; ( j < result.length ) && ( uniq ); j++) {
          if (
            result[j].font === obj.font &&
            result[j].textDecoration === obj['textDecorationLine']+" "+obj['textDecorationStyle']
          ) {
            uniq = false;
            for (let k = 0; ( k < result[j].color.length ) && ( colorUniq ); k++) {
              if ( result[j].color[k] === obj.color ) colorUniq = false;
            }
            if ( colorUniq ) {
              result[j].color.push( obj.color );
            }
          }
        }

        //only push it in the array if it does not exist in it
        if ( uniq ) {
          result.push({
            'fontFamily': obj['fontFamily'],
            'color': [obj['color']],
            'font': obj['font'],
            'textDecoration': obj['textDecorationLine']+" "+obj['textDecorationStyle']
          });
        }
      }
      return result;
    }
    //return styles for each tag selector
    return tags.map((el)=>{
      const obj = {};
      obj[el]=getComputetOf(el);
      return obj;
    });
  }, tags);
}

puppet.puppetRequest = async ( url ) => {
  //check if http or https is present and add if not
  url = url.toLowerCase();
  if ( url.slice(0,7) !== "http://" && url.slice(0,8) !== "https://") url = "https://" + url;

  //check if url is cached
  const cached = await cache.getCache(url);
  if (cached) return cached.data;


  //init chromium and go to the url
  const browser = await puppeteer.launch( {args: ['--no-sandbox', '--lang=es-ES,es','--disable-search-geolocation-disclosure']});
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 720
  })
  await page.goto(url);

  //take a screenshot of target site JPEG
  //--> chek if a delay is needed __ await new Promise (resolve =>{setTimeout(resolve,2000)});
  const img = await page.screenshot({type: 'jpeg'});

  //get all desired styles and create object to be sended to de front-end

  const styles = await puppet.getStyles(page,'body','h1','h2','h3','h4','h5','h6','p','a','span');
  const ret = JSON.stringify({img: img.toString('base64'),styles: styles});

  //close browser, set object to the cache and send it to front-end
  browser.close();
  cache.setCache(url,ret)
  return ret;
};

module.exports = puppet;
