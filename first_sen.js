var fs = require('fs');
var gracefulFs = require('graceful-fs');
var tokenizer = require('sbd');
var inputFile = './wiki_00.txt';

gracefulFs.gracefulify(fs);
module.exports = function(callback){

	fs.readFile(inputFile, function(err, data){
		if(err){
			console.log(err);
		}

		//console.log(data);
		var not_title = new RegExp(/(.*?)\n\n/, "g");
		var empty_line = new RegExp(/^\s*$/, "gm");
		data = data.toString();
		data = data.replace(not_title, "");
		data = data.replace(empty_line, "");
		data = data.split("<\/doc>");
		
		var obj = [];

		let abbreviations = ["c","ca","e.g","et al","etc","i.e","p.a","Dr","Gen","Hon","Mr","Mrs","Ms","Prof","Rev","Sr","Jr","St","Assn","Ave","Dept","est","fig","inc","mt","no","oz","sq","st","vs"];

		let options = {
		    "newline_boundaries" : false,
		    "html_boundaries"    : false,
		    "sanitize"           : false,
		    "allowed_tags"       : false,
		    "abbreviations"      : abbreviations
		};

		for(var i = 0; i<data.length-1; i++){
			tmp = data[i];
			id = tmp.match(new RegExp(/"[0-9]*"/));
			id[0] = id[0].replace(/"/g, "");
			obj.push({id: id[0]});
			data[i] = data[i].replace(new RegExp("<doc (.*?)>", 'g'), "");
			obj[i].first_sentence = tokenizer.sentences(data[i],options)[0];
		}
		callback(obj)
	});
}