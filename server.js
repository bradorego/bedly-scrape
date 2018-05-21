const express = require('express');
const app = express();
const compression = require('compression');
const puppeteer = require('puppeteer');
const json2csvParser = require('json2csv').parse;
const fs = require('fs');

let jsonOutput = [];
async function scrapeBedly(url) {
  const browser = await puppeteer.launch();
  const homePage = await browser.newPage();
  console.log(`puppet start. url: ${url}`);
  await homePage.goto(url);
  let links = await homePage.evaluate(() => {
    const links = Array.from(document.querySelectorAll('.bookButton a'));
    return links.map((link) => {
      return link.href;
    });
  });
  for(let i = 0; i < links.length; i++) {
    if (jsonOutput.find((item) => item.url === links[i])) {
      console.log(`duplicate url found: ${links[i]}. skipping`);
      continue; /// there will be duplicate URLs; don't repeat
    }
    const page = await browser.newPage();
    console.log(`opening page ${links[i]}`);
    await page.goto(links[i]);
    let rentalInfo = await page.evaluate(() => {
      let $intro = document.querySelector('.room__intro');
      let area = $intro.children[0].children[0].innerText;
      let street = $intro.children[0].children[1].innerText;
      let cost = document.querySelector('.request-booking__header .title').innerText;
      let $amenities = document.querySelector('.room__amenities');
      let $descriptionPs = document.querySelectorAll('.room__description')[1].querySelectorAll('p');
      let description = Array.from($descriptionPs).reduce((acc, curr) => {return acc += curr.innerText}, '');
      let moveIn = document.querySelector('.grid__cell--is-moveIn input').value;

      let bedCount = 0;
      let bathCount = 0;
      let floorNumber = 0;
      let centralAir = false;
      let rooftop = false;
      let backyard = false;
      let dishwasher = false;

      let amLists = $amenities.querySelectorAll('ul'); // get each list
        // amLists[1] /// "the unit"
        // amLists[2] /// "utilities"
        // amLists[3] /// "essentials & extras"
      let theUnit =  Array.from(amLists[1].querySelectorAll('p')).map((p) => {return p.innerText.toLowerCase();});
      theUnit.forEach((item) => {
        if (item.includes('bathroom')) {
          bathCount = parseFloat(item); /// 1.5 is an option
        } else if (item.includes('bedroom')) {
          bedCount = parseInt(item, 10);
        } else if (item.includes('floor')) {
          floorNum = parseInt(item, 10);
        } else if (item.includes('air')) {
          centralAir = true;
        } else if (item.includes('dishwasher')) {
          dishwasher = true;
        }
      });
      let essentialsAndExtras = Array.from(amLists[3].querySelectorAll('p')).map((p) => {return p.innerText.toLowerCase();});
      essentialsAndExtras.forEach((item) => {
        if (item.includes('roof')) {
          rooftop = true;
        } else if (item.includes('back yard')) {
          backyard = true;
        }
      });

      return {
        url: window.location.href,
        area: area,
        street: street,
        cost: cost,
        moveIn: moveIn,
        description: description,
        bed: bedCount,
        bath: bathCount,
        floor: floorNumber,
        centralAir: centralAir,
        rooftop: rooftop,
        backyard: backyard,
        dishwasher: dishwasher
      };
    });
    jsonOutput.push(rentalInfo);
    console.log(`closing page ${links[i]}`);
    await page.close();
  };
  await homePage.close();
  await browser.close();

  let csv = json2csvParser(jsonOutput, {
    fields: ['url', 'area', 'street', 'cost', 'moveIn','description', 'bed', 'bath', 'floor', 'centralAir', 'rooftop', 'backyard','dishwasher']
  });
  fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
  });
}
async function doAll() {
  //may
  // await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-05-21&max_price=3000');
  // await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-05-24&max_price=3000');
  // await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-05-27&max_price=3000');
  // await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-05-30&max_price=3000');
  //june
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-01&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-04&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-07&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-10&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-13&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-16&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-19&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-22&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-25&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-27&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-30&max_price=3000');
  ///july
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-03&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-06&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-09&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-12&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-15&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-18&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-21&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-24&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-27&max_price=3000');
  await scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-07-30&max_price=3000');
}
doAll();

app.use(compression());
app.use(express.static('static'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res, next) => {
  scrapeBedly('https://bedly.com/s/New-York--NY--New-York--United-States?start_date=2018-06-01&max_price=3000');
});

app.set('port', process.env.PORT || 3000);
//
