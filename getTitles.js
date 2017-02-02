var fs = require("fs");
var unique = require("array-unique");
var gracefulFs = require('graceful-fs');
var pe_alias = './output_data/pe_alias.txt';
var pe = './output_data/pe.txt';
var isa = require('./isa');
var id_secondary = require('./id_secondary');

gracefulFs.gracefulify(fs);

module.exports = function(callback) {

	fs.readFile(pe_alias, function(err, data_pe_alias) {
    	if(err) {
        	console.log(err);
    	}
    	fs.readFile(pe, function(err, data_pe){
    		if(err){
    			console.log(err);
    		}
    		var obj_pe_alias = JSON.parse(data_pe_alias.toString());
    		var obj_pe = JSON.parse(data_pe.toString());
    		
    		for(var i = 0; i<obj_pe_alias.length; i++){
    			for(var j = 0; j<obj_pe.length; j++){
    				if(obj_pe_alias[i].id === obj_pe[j].id){
    					obj_pe[j].pe[0] = obj_pe[j].pe[0].replace(/ \((.*?)\)/, "");
    					obj_pe[j].pe = unique(obj_pe[j].pe.concat(obj_pe_alias[i].pe));
                        obj_pe[j].pe.sort(function(a,b) {
                            return b.length-a.length;
                        });
    				}
    			}
    		}
    		isa(function(id2seeds){
    			for(var i = 0; i<obj_pe.length; i++){
    				for(var j = 0; j<id2seeds.length; j++){
    					if( id2seeds[j].id === obj_pe[i].id){
    						obj_pe[i].seeds = id2seeds[j].seeds;
    					}
    				}
    			}
    			
    		});
            id_secondary(function(id2se){
                for(var i = 0; i<obj_pe.length; i++){
                    for(var j = 0; j<id2se.length; j++){
                        if(id2se[j].id === obj_pe[i].id){
                            obj_pe[i].se = id2se[j].se;
                        }
                    }
                }
                callback(obj_pe);
                //fs.writeFile("./output_data/articoli_out.txt", JSON.stringify(obj_pe));
            });
    	});	
	});	
}