import axios from 'axios';
import * as cheerio from 'cheerio';


async function ProccesIsUp(url) {
    try {
      await axios.get(url);
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          return false
        } 
      }
    }
  }

export default async function handler(req, res) {
  const onPage = []

  try {
    const response = await axios.get(
      "https://www.ucs.br/site/pos-graduacao/formacao-stricto-sensu/processo-seletivo-programa-de-pos-graduacao-stricto-sensu/"
    );

    const rawHtml = response.data;
    const $ = cheerio.load(rawHtml);

    const secondUl = $('ul').eq(1);

    secondUl.find('a').filter((i, el) => {
      const aHtml = $.html(el); 
      return !rawHtml.includes(`<!--${aHtml}-->`); 
    }).each((i, a) => {
      const text = $(a).text().trim();  
      const href =  "https://ucs.br" + $(a).attr('href');   
      if(ProccesIsUp(href)){
        onPage.push({
          name: text,
          link: href,
          active: true
        })
      }else{
        onPage.push({
            name: text,
            link: href,
            active: false
          })
      }
    });
  } catch (error) {
    console.error('Erro ao fazer a requisição:', error.message);
    res.status(500).json({ error: 'Erro ao fazer a requisição' });
  }

  res.status(200).json({ data: onPage });

}
