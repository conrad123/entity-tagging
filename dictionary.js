var fs = require('fs');
var gracefulFs = require('graceful-fs');
var inputFile = './output_data/notable_seeds.txt';
var outputFile = './output_data/dictionary.txt';

gracefulFs.gracefulify(fs);

fs.readFile(inputFile, function(err, data){
	var obj = JSON.parse(data.toString());
	var dictionary = new Object();

	for(var i = 0; i<obj.length; i++){
		if(obj[i].notable in dictionary){
			dictionary[obj[i].notable] = dictionary[obj[i].notable].concat(obj[i].seeds);
		}else{
			dictionary[obj[i].notable] = obj[i].seeds;
		}
	}

	var sorted_dictionary = new Object();

	for(var notable in dictionary){
		seeds2count = new Object();
		for(i = 0; i<dictionary[notable].length; i++){
			if(dictionary[notable][i] in seeds2count){
				seeds2count[dictionary[notable][i]]++;
			}else{
				seeds2count[dictionary[notable][i]] = 1;
			}
		}

		sorted = [];
		sorted_dictionary[notable] = [];

		for(var seed in seeds2count){
			sorted.push([seed, seeds2count[seed]]);
		}

		sorted.sort(function (a,b){
			return b[1]-a[1];
		});

		for(var i = 0; i<sorted.length; i++){
			sorted_dictionary[notable].push(sorted[i][0]);

		}
	}

	delete sorted_dictionary["-"];
	//console.log(sorted_dictionary);
	fs.writeFile('./output_data/sorted_dictionary_test.txt', JSON.stringify(sorted_dictionary));
})