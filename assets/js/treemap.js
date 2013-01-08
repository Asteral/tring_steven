TreeMap = function(json, elem_id)
{
	this.json = json;
	this.elem_id = elem_id;

	this.jdata = [];
	for (var i = this.json.data.length - 1; i >= 0; i--) {
		this.jdata.push({
			"id" : "power",
			"label" : this.json.data[i].time,
			"value" : this.json.data[i].reading,
		});
	};
}

TreeMap.prototype = {
	constructor : TreeMap,

	build: function() {
	$('div#'+this.elem_id).treemap(
		this.jdata, 
		{
			nodeClass: function(node, box){
	        	if(node.value <= 0.4){
	        		return 'minor';
	        	}
	        	return 'major';
    	},
	});
	}
}