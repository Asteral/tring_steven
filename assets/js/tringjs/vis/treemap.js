TRINGJS.Treemap = function(insert_elem, data, format_function)
{
    //Format json data according to configuration function
    var fdata = data.map(format_function)
    //Build treemap
    this.build(insert_elem, fdata)
}

TRINGJS.Treemap.prototype = {
    constructor : TRINGJS.TreeMap,

    build : function(insert_elem, data) {
        $(insert_elem).treemap(
            data, 
            {
                nodeClass: function(node, box) 
                {
                    if(node.value <= 0.50) {
                        return 'small'
                    } else if(node.value > 0.50 && node.value <= 0.75) {
                        return 'medium'
                    } else if(node.value > 0.75) {
                        return 'large'
                    }
                },
            }
        )
    },
}