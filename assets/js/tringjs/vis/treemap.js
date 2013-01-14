TRINGJS.Treemap = function(wrapper, data, width, height, color_scale)
{
    this.wrapper = wrapper;
    this.w = width;
    this.h = height;

    this.xrange = d3.scale.linear().range([0, this.w]);
    this.yrange = d3.scale.linear().range([0, this.h]);
    this.color = color_scale;
    
    this.__set_data(data);
    this.root = this.node = this.data;

    this.treemap = d3.layout.treemap()
        .round(false)
        .size([this.w, this.h])
        .sticky(true);
}

TRINGJS.Treemap.prototype = {
    constructor : TRINGJS.TreeMap,

    build : function() {

        this.treemap.value( 
            function(d) {
                return d.reading;
            }
        )

        var svg = d3.select(this.wrapper)
            .attr("class", "chart")
            .style("width", this.w + "px")
            .style("height", this.h + "px")
                .append("svg:svg")
                    .attr("width", this.w)
                    .attr("height", this.h)
                        .append("svg:g")
                            .attr("transform", "translate(.5,.5)");

        var nodes = this.__find_nodes();

        var node = this.node, root = this.root, w = this.w, h = this.h, x = this.xrange, y = this.yrange;

        var cell = svg.selectAll("g")
            .data(nodes)
            .enter().append("svg:g")
            .attr("class", "cell")
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
            .on("click", function(d) { return zoom(node == d.parent ? root : d.parent, w, h, x, y, node); });

        var color = this.color;
        cell.append("svg:rect")
            .attr("width", function(d) { return d.dx - 1; })
            .attr("height", function(d) { return d.dy - 1; })
            .style("fill", function(d) {
                return color(d.reading); 
            });

        function zoom(d, w, h, x, y, node) {
            console.log("CALL ZOOM")
            var kx = w / d.dx, ky = h / d.dy;
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

            var t = svg.selectAll("g.cell").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

            t.select("rect")
                .attr("width", function(d) { return kx * d.dx - 1; })
                .attr("height", function(d) { return ky * d.dy - 1; })

            t.select("text")
                .attr("x", function(d) { return kx * d.dx / 2; })
                .attr("y", function(d) { return ky * d.dy / 2; })
                .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

            node = d;
            d3.event.stopPropagation();
        }
    },

    __set_data : function(data)
    {
        // The following line remaps the data key to a children. 
        // I don't know why; d3's treemap node filter function expects the data to be stored in a key named 'children'
        data.children = data.data;
        this.data = data;
    },

    __find_nodes : function()
    {
        // Copy the data then pass in the copy to the treemap for calculation.
        // The copy prevents the global DOM from being modified so that it's available for other visualisations to format.
        return this.treemap.nodes(JSON.parse(JSON.stringify(this.data)))
            .filter(function(d) {
                return !d.children;
            })
    },
}