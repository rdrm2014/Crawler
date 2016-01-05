/**
 * Created by ricardomendes on 21/12/15.
 */
// Exemplo:
// node testeCrawler.js -c 7622210401090
var request = require('request');
var cheerio = require('cheerio');
var code;

if (process.argv.indexOf("-c") != -1) {
    code = process.argv[process.argv.indexOf("-c") + 1];
}
//7622210401090
url = 'http://www.continente.pt/pt-pt/public/Pages/searchresults.aspx?k=' + code;
request(url, function (error, response, html) {
    if (error) {
        return;
    }
    var $ = cheerio.load(html);

    var price, title, image;
    var json = {title: "", price: "", image: ""};

    $('.title .ecsf_QuerySuggestions').filter(function () {
        var data = $(this);
        title = data.text();
        json.title = title;
    });

    $('.priceFirstRow').filter(function () {
        var data = $(this);
        console.log(data);
        price = data.text();

        json.price = price;
    });

    $('.ecsf_QuerySuggestions img').filter(function () {
        var data = $(this);
        image = data.first().data("original");

        json.image = image;
    });

    console.log(json);
});