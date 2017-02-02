var fs = require('fs');
var gracefulFs = require('graceful-fs');
var tokenizer = require('sbd');
var inputFile = './wiki_00_new.txt';

gracefulFs.gracefulify(fs);
module.exports = function(callback){

	fs.readFile(inputFile, function(err, data){
		if(err){
			console.log(err);
		}

		var not_title = new RegExp(/(.*?)\n\n/, "g");
		var empty_line = new RegExp(/^\s*$/, "gm");
		data = data.toString();
		data = data.replace(not_title, "");
		data = data.replace(empty_line, "");
		data = data.split("<\/doc>");
		
		var obj = [];
		var se = [];

		href = new RegExp(/<a href=(.*?)>(.*?)<\/a>/, "g");
		href_start = new RegExp(/<a href=(.*?)>/, "ig");
		href_end = new RegExp(/<\/a>/, "ig");

		for(var i = 0; i<data.length-1; i++){
			tmp = data[i];
			se_all = [];
			se = [];
			id = tmp.match(new RegExp(/"[0-9]*"/));
			id[0] = id[0].replace(/"/g, "");
			//obj.push({id: id[0]});
			se_all = tmp.match(href);
			if(se_all === null){
				obj.push({id: id[0], se: []})
			}else{
				for(var j = 0; j<se_all.length; j++){
					se_all[j] = se_all[j].replace(href_start, "");
					se_all[j] = se_all[j].replace(href_end, "");
					se_all[j] = se_all[j].replace(/\(/g, "\\(");
					se_all[j] = se_all[j].replace(/\)/g, "\\)");
					se_all[j] = se_all[j].replace(/\+/g, "\\+");
					se_all[j] = se_all[j].replace(/\//g, "\\/");
					se_all[j] = se_all[j].replace(/\*|\[|\?/g, "");
					if(se_all[j].charAt(0)===se_all[j].charAt(0).toUpperCase()){
						se.push(se_all[j]);
					}
				}
				se.sort(function(a,b){
					return b.length-a.length;
				});
				obj.push({id: id[0], se: se});
			}
		}
		callback(obj);
	});
}