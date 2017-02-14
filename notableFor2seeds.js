var fs = require('fs');
var graceful = require('graceful-fs');
var outputFile = ('./output_data/notable_seeds.txt')
var obj = [];

graceful.gracefulify(fs);
fs.readFile("./output_data/id_title_seed4.txt", function(err_ins, data_ins){
		if(err_ins){
			console.log(err_ins);
		}
		fs.readFile("mapping.tsv", function(err_m, data_m){
			if(err_m){
				console.log(err_m);
			}

			var obj_ins = JSON.parse(data_ins.toString());
			var obj_m = data_m.toString().split('\n');
			var map = new Object();

			for(var i=0; i<obj_m.length; i++) {
				var tmp = obj_m[i].split('\t');
				map[tmp[0]] = tmp[1];
			}

			for(var i = 0; i<obj_ins.length; i++){
				var title = obj_ins[i].title;
				obj.push({notable: map[title], seeds: obj_ins[i].seeds});				
			}

			fs.writeFile(outputFile, JSON.stringify(obj));
		});
	})