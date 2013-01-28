/**
 * initTreemap - Init's a treemap to be displayed inside an html element.
 * @param {object} ai_data - the AI object that is retrieved from the AI scripts. See ai.js.
 * @param {string} div - the div/html element that the treemap is drawn in. Size of the treemap is controlled via css
 */
function initTreemap(ai_data, div)
{
    data = { name: 'root', children:[] };
    for(var propertyName in ai_data.data) {
        if(ai_data.data[propertyName] == 0) {
            continue;
        }
        data.children.push({
            name : propertyName,
            value : ai_data.data[propertyName],
            spread : (ai_data.data[propertyName] * ai_data.kw)
        });
    };

    var config = {
        wrapper : div,
        w: $(div).width(), 
        h: $(div).height(), 
        color : function() { return "#FDFDFD"; },
        key : 'value'
    };

    return new Treemap(data, config);
}

/**
 * Treemap - Treemap class.
 * @param {object} data - a formatted object with a name and children array containing values
 * @param {object} config - an object specifying the config data required for the treemap.
 */

Treemap = function (data, config) {
    _this = this;
    
    _this.root = _this.node = _this.data = data;
    _this.config = config;

    _this.xrange = d3.scale.linear().range([0, _this.config.w]);
    _this.yrange = d3.scale.linear().range([0, _this.config.h]);

    _this.layout = _this.setup_layout();
    _this.svg = _this.setup_svg();
    _this.draw();

};

Treemap.prototype = {
    constructor : Treemap,

    /**
     * setup_layout - sets up the d3 layout.
     */
    setup_layout : function() {
        return d3.layout.treemap()
            .round(true)
            .size([_this.config.w, _this.config.h])
            .sticky(true)
            .value(_this.__layout_value);
    },

    /**
     * setup_svg - sets up the svg element
     */
    setup_svg : function() {
        return d3.select(_this.config.wrapper)
            .attr("class", "chart")
                .append("svg:svg")
                    .append("svg:g")
                        .attr("transform", "translate(0.5,0.5)");
    },

    /**
     * draw - draws the treemap
     */
    draw : function() {
        var nodes = _this.__find_nodes();
        
        var cells = _this.svg.selectAll("g")
            .data(nodes)
            .enter().append("svg:g")
                .attr("class", function(d) { return d.name + " cell"; })
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
                // .on("click", function(d) { return _this.__on_click_handler(d); });

        _this.__draw_rect(cells);
        _this.__draw_images(cells);
    },

    destroy : function() {
        d3.select("svg").remove();
    },

    /**
     * Internal functions below
     */
    __draw_rect : function(svg_elem) {
        svg_elem.append("svg:rect")
            .attr("width", function(d) { return d.dx - 2; })
            .attr("height", function(d) { return d.dy - 2.5; })
            .style("fill", function(d) { return _this.config.color(d[_this.config.key]); })
            .style("stroke-width", 0.1)
            .style("stroke", "#000000" );
    },

    __draw_images : function(svg_elem) {
        svg_elem.append("svg:image")
            .attr("width", function(d) { return d.dx-2;})
            .attr("height", function(d) { return d.dy-2.5;})
            .attr("xlink:href", function(d) { return "http://placekitten.com/"+Math.floor(d.dx-2)+"/"+Math.floor(d.dy-2.5); });
    },

    __find_nodes : function() {
        return _this.layout.nodes(_this.root)
            .filter(function(d) { return !d.children; });
    },

    __layout_value : function(data) {
        return data[_this.config.key]
    },

    // __on_click_handler : function(d) {
    //     switch( _this.node ) 
    //     {
    //         case d.parent:
    //             // return _this.zoom(_this.root);
    //             break;
    //         case _this.root: //Zoom in.
    //             return _this.zoom(d.parent);
    //             break;
    //     }
    // },

    // zoom : function(d) {
    //     var kx = _this.config.w / d.dx, ky = _this.config.h / d.dy;
    //         _this.xrange.domain([d.x, d.x + d.dx]);
    //         _this.yrange.domain([d.y, d.y + d.dy]);

    //     var t = _this.svg.selectAll("g.cell").transition()
    //         .duration(750)
    //         .attr("transform", function(d) { return "translate(" + _this.xrange(d.x) + "," + _this.yrange(d.y) + ")"; })

    //     t.select("rect")
    //         .attr("width", function(d) { return kx * d.dx - 2; })
    //         .attr("height", function(d) { return ky * d.dy - 2.5; })

    //     // t.select("image")
    //     //     .attr("width", function(d) { return kx * d.dx - 2; })
    //     //     .attr("height", function(d) { return ky * d.dy - 2.5; })
    //     //     .attr("xlink:href", function(d) { return "http://placekitten.com/"+Math.floor(kx * d.dx - 2)+"/"+Math.floor(ky * d.dy - 2.5); });

    //     _this.node = d;
    //     d3.event.stopPropagation();
    // },
};