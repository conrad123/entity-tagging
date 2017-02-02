var articoli = './wiki_00.txt';
var articoli_keywords = './output_data/articoli_out.txt';
var fs = require("fs");
var gracefulFs = require('graceful-fs');
var getTitles = require('./getTitles');

gracefulFs.gracefulify(fs);

getTitles(function(keywords) {
/*
fs.readFile(articoli_keywords, function(err_keywords, data_keywords) {
	if(err_keywords) {
		console.log(err_keywords);
	}
*/
	fs.readFile(articoli,function(err_articoli, data_articoli) {
		if(err_articoli) {
			console.log(err_articoli);
		}

		var not_title = new RegExp("(.*?)\n\n", "g");
		var empty_line = new RegExp("^\s*$", "gm");
		var doc_tag = new RegExp("<doc (.*?)>", "g");
		data_articoli = data_articoli.toString();
		data_articoli = data_articoli.replace(not_title, "");
		data_articoli = data_articoli.replace(empty_line, "");
		data_articoli = data_articoli.replace(doc_tag, "");
		data_articoli = data_articoli.split("<\/doc>");
		data_articoli.pop();

		for(var i=0; i<keywords.length; i++){
			var se = keywords[i].se;
			var pe = keywords[i].pe;
			var seeds = keywords[i].seeds;
			var regex = '';
			var pe_count = 0;
			var se_count = 0;
			var seeds_count = 0;
			for(var j=0; j<pe.length; j++) {
				regex = new RegExp(pe[j]+'[ .,;:"]', "ig");
				data_articoli[i] = data_articoli[i].replace(regex, "["+j+"|PE] ");
			}
			for(var j=0; j<se.length; j++) {
				regex = new RegExp(se[j]+'[ .,;:"]', "g");
				data_articoli[i] = data_articoli[i].replace(regex, "["+j+"|SE] ");
			}
			for(var j=0; j<seeds.length; j++) {
				regex = new RegExp("the "+seeds[j]+'[ .,;:"]', "ig");
				data_articoli[i] = data_articoli[i].replace(regex, "["+j+"|SEED] ");	
			}

			
			for(var j=0; j<pe.length; j++) {
				regex = new RegExp("\\["+j+"\\|PE\\]", "ig");
				data_articoli[i] = data_articoli[i].replace(regex, "["+pe[j]+"|PE]");
			}
			for(var j=0; j<seeds.length; j++) {
				regex = new RegExp("\\["+j+"\\|SEED\\]", "ig");
				data_articoli[i] = data_articoli[i].replace(regex, "[the "+seeds[j]+"|SEED]");
			}
			for(var j=0; j<se.length; j++) {
				regex = new RegExp("\\["+j+"\\|SE\\]", "g");
				data_articoli[i] = data_articoli[i].replace(regex, "["+se[j]+"|SE]");
			}
			

			var matches = [];
			matches = data_articoli[i].match(/\|PE]/ig);
			if(matches !== null) {
				pe_count = matches.length;
			}
			matches = data_articoli[i].match(/\|SE]/g);
			if(matches !== null) {
				se_count = matches.length;
			}
			matches = data_articoli[i].match(/\|SEED]/ig);
			if(matches !== null) {
				seeds_count = matches.length;
			}
			fs.appendFile('./output_data/page_tagging_out.txt', 'ID: '+keywords[i].id+'\r\n'+'PE: '+pe_count+'\r\nSE: '+se_count+'\r\nSEEDS: '+seeds_count+'\r\n'+'---------------------'+data_articoli[i]+'\r\n', function(err) {
					if(err) {
						console.log(err);
					}
			})
		}
	});
})