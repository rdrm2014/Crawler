/**
 * Created by ricardomendes on 12/05/15.
 */
var config = require('../package.json');
var request = require('request');
var cheerio = require('cheerio');
/*
 * GET home page.
 */
exports.index = function(req, res){
    var code = req.query.code;
	//7622210401090
	url = 'http://www.continente.pt/pt-pt/public/Pages/searchresults.aspx?k=' + code;

	request(url, function(error, response, html){
		if(!error){
			var $ = cheerio.load(html);

			var price, title, image;
			var json = { title : "", price : "", image:""};

			$('.productTitle').filter(function(){
		        var data = $(this);
		        title = data.children().first().text();

		        json.title = title;
	        })

	        $('.pricePerUnit').filter(function(){
	        	var data = $(this);
	        	price = data.text();

	        	json.price = price;
	        })	  
            
            $('.ecsf_QuerySuggestions img').filter(function(){
	        	var data = $(this);
	        	image = data.first().data("original");
                
	        	json.image = image;
	        })	  
		}

		console.log(json);
        res.render('index', { config: config, data: json });
	})
};

/*
 * GET about page.
 */
exports.about = function(req, res){
    res.render('about', { config: config });
};