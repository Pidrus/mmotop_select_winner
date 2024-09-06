const parser = require('jsdom')

const needWinners = 3;
const serverId = 38062;

async function main() {
  let allReviews = [];

  const mainUrl = 'https://wow.mmotop.ru';
  let currentUrl = `/servers/${serverId}/reviews`;
  let resp = await fetch(mainUrl + currentUrl);
  resp = await resp.text();

  let domPars = new parser.JSDOM(resp);

  let pagination = domPars.window.document.getElementsByClassName('pagination')[0].getElementsByTagName('li');

  let lastPageUrl = pagination[pagination.length-1].getElementsByTagName('a')[0].href;
  
  let lastPageNumber = parseInt(lastPageUrl.split('=')[1]);

  for(let i = 1; i < lastPageNumber+1; i++) {
    if(i == 1) {
      currentUrl = `/servers/${serverId}/reviews`;
    } else {
      currentUrl = `/servers/${serverId}/reviews?page=${i}`;
    }

    let resp = await fetch(mainUrl + currentUrl);
    resp = await resp.text();
    let domPars = new parser.JSDOM(resp);
    
    let reviews = domPars.window.document.getElementsByClassName('reviews-unit');
    for(let r = 0; r < reviews.length; r++) {
      let review = {
        name: reviews[r].getElementsByClassName('message-block')[0].getElementsByClassName('name')[0].textContent,
        date: reviews[r].getElementsByClassName('message-block')[0].getElementsByClassName('date')[0].textContent.replaceAll('\n', '').replaceAll('    ', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', ''),
      };

      allReviews.push(review);
    }
  }

  console.log(`Загружено ${allReviews.length} отзывов`);

  let winnerIdx = new Map();
  
  while(winnerIdx.size < needWinners) {
    winnerIdx.set(getRandomInt(allReviews.length), true);
  }

  let place = 1;
  for (const [key, value] of winnerIdx) {
    console.log(`${place} МЕСТО: ${allReviews[key].name} | ${allReviews[key].date} | ${key}`);
    place++;
  }

}

main();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}