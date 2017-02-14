var articoli = './output_data/wiki_00_sections.txt';
//var articoli_keywords = './output_data/articoli_out.txt';
var id_title_seeds_pe_se_notable = './output_data/id_title_seeds_pe_se_notable.txt';
var sorted_dictionary = './output_data/sorted_dictionary.txt';
var fs = require("fs");
var gracefulFs = require('graceful-fs');
//var getTitles = require('./getTitles');

gracefulFs.gracefulify(fs);

//getTitles(function(keywords) {
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

		fs.readFile(id_title_seeds_pe_se_notable, function(err_itspsn, data_itspsn){
			if(err_itspsn){
				console.log(err_itspsn);
			}

			fs.readFile(sorted_dictionary, function(err_dictionary, data_dictionary){
				if(err_dictionary){
					console.log(err_dictionary);
				}
			
				var keywords = JSON.parse(data_itspsn.toString());
				var dictionary = JSON.parse(data_dictionary.toString());
				var not_title = new RegExp("(.*?)\n\n", "g");
				var empty_line = new RegExp("^\s*$", "gm");
				var doc_tag = new RegExp("<doc (.*?)>", "g");
				data_articoli = data_articoli.toString();
				data_articoli = data_articoli.replace(not_title, "");
				data_articoli = data_articoli.replace(empty_line, "");
				data_articoli = data_articoli.replace(doc_tag, "");
				data_articoli = data_articoli.split("<\/doc>");
				data_articoli.pop();

				for(var i=0; i<data_articoli.length; i++) {
					var article_split = data_articoli[i].split(/=======.*?=======/ig);
					var abstract = article_split[0];
					article_split.splice(0,1);
					data_articoli[i] = {abstract: abstract, body: article_split.join("")};
				}

				//console.log(keywords.length);
				
				for(var i=0; i<keywords.length; i++){
					var id = keywords[i].id;
					var title = keywords[i].title;
					var se = keywords[i].se;
					var pe = keywords[i].pe;
					var seeds = keywords[i].seeds;
					var notable = keywords[i].notable;
					var dictionary_article = [];
					var k = 5;
					if(typeof dictionary[notable] !== 'undefined'){
						dictionary_article = dictionary[notable];
					}
					if(dictionary_article.length >= k){
						dictionary_article.splice(k, dictionary_article.length-k);
					}
					dictionary_article.sort(function(a, b){ 
						return b.length-a.length});
					var regex = '';
					var pe_count = 0;
					var se_count = 0;
					var seeds_count = 0;
					var dictionary_count = 0;

					//console.log(dictionary_article);

					for(var j=0; j<pe.length; j++) {
						regex = new RegExp(pe[j]+'[ .,;:"]', "ig");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|PE] ");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|PE] ");
					}
					for(var j=0; j<se.length; j++) {
						regex = new RegExp(se[j]+'[ .,;:"]', "g");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SE] ");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SE] ");
					}
					for(var j=0; j<seeds.length; j++) {
						regex = new RegExp("the "+seeds[j]+'[ .,;:"]', "ig");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|SEED] ");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|SEED] ");
					}

					for(var j=0; j<dictionary_article.length; j++) {
						regex = new RegExp("the "+dictionary_article[j]+'[ .,;:"]', "ig");
						if(seeds.indexOf(dictionary_article[j]) == -1){
							data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+j+"|DICT] ");
							data_articoli[i].body = data_articoli[i].body.replace(regex, "["+j+"|DICT] ");
						}
					}
					
					for(var j=0; j<pe.length; j++) {
						regex = new RegExp("\\["+j+"\\|PE\\]", "ig");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+pe[j]+"|PE]");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "["+pe[j]+"|PE]");
					}
					for(var j=0; j<seeds.length; j++) {
						regex = new RegExp("\\["+j+"\\|SEED\\]", "ig");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "[the "+seeds[j]+"|SEED]");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "[the "+seeds[j]+"|SEED]");
					}
					for(var j=0; j<se.length; j++) {
						regex = new RegExp("\\["+j+"\\|SE\\]", "g");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "["+se[j]+"|SE]");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "["+se[j]+"|SE]");
					}

					for(var j=0; j<dictionary_article.length; j++) {
						regex = new RegExp("\\["+j+"\\|DICT\\]", "g");
						data_articoli[i].abstract = data_articoli[i].abstract.replace(regex, "[the "+dictionary_article[j]+"|DICT]");
						data_articoli[i].body = data_articoli[i].body.replace(regex, "[the "+dictionary_article[j]+"|DICT]");
					}
					

					var matches_abstract = [];
					var matches_body = [];
					matches_abstract = data_articoli[i].abstract.match(/\|PE]/ig);
					matches_body = data_articoli[i].body.match(/\|PE]/ig);
					if(matches_abstract !== null) {
						pe_count = matches_abstract.length;
					}
					if(matches_body !== null) {
						pe_count += matches_body.length;
					}
					matches_abstract = data_articoli[i].abstract.match(/\|SE]/ig);
					matches_body = data_articoli[i].body.match(/\|SE]/ig);
					if(matches_abstract !== null) {
						se_count = matches_abstract.length;
					}
					if(matches_body !== null) {
						se_count += matches_body.length;
					}
					matches_abstract = data_articoli[i].abstract.match(/\|SEED]/ig);
					matches_body = data_articoli[i].body.match(/\|SEED]/ig);
					if(matches_abstract !== null) {
						seeds_count = matches_abstract.length;
					}
					if(matches_body !== null) {
						seeds_count += matches_body.length;
					}

					matches_abstract = data_articoli[i].abstract.match(/\|DICT]/ig);
					matches_body = data_articoli[i].body.match(/\|DICT]/ig);
					if(matches_abstract !== null) {
						dictionary_count = matches_abstract.length;
					}
					if(matches_body !== null) {
						dictionary_count += matches_body.length;
					}
					
					fs.appendFile('./output_data/page_tagging_out.txt', '=== '+title+' ==='+'\r\n'+notable+'\r\n'+'PE: '+pe+' ---> '+pe_count+'\r\nSE: '+se_count+'\r\nSEEDS: '+seeds+' ---> '+seeds_count+'\r\n'+'DICT: '+dictionary_article+' ---> '+dictionary_count+'\r\n'+'---------------------\n'+'Abstract:'+data_articoli[i].abstract+'Body:'+data_articoli[i].body+'\r\n', function(err) {
							if(err) {
								console.log(err);
							}
					})
				}
			})
		})
	});
//})