var w = window.innerWidth;
var h = 400;
var nScale;

var rowConverter = function(d){
  return{
    state: d.state,
    frequency: parseInt(d.frequency)
  };
};

if (w <= 400){
    nScale = 400;
} else {
    nScale = 550;
}

var projection = d3.geo.mercator()
                  .center([ 132, -28 ])
                   .translate([ w/2.2, h/2 ])
                   .scale(nScale);

var path = d3.geo.path()
            .projection(projection)

d3.json('https://raw.githubusercontent.com/calebtriscari/tmn-aria/main/aust.json', function(json){

  var svg = d3.select('body')
              .append('svg')
              .attr('width', w)
              .attr('height', h)
              .attr('fill','white');

  svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr("stroke", "dimgray")
      .attr('d', path);

    var b = path.bounds(json);
    console.log(b);
    var s = 0.95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h);
    console.log(s);
    var t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];
    console.log(t);

    projection.scale(s).translate(t);

  d3.csv('chloro.csv', rowConverter, function(data){
      console.log(data);
    var rScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d){
                    return d.frequency;
                })])
				.rangeRound([237,0]);

	var gScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d){
                    return d.frequency;
                })])
				.rangeRound([248,109]);

	var bScale = d3.scale.linear()
                .domain([0, d3.max(data, function(d){
                    return d.frequency;
                })])
				.rangeRound([233,44]);

    svg.selectAll('path')
        .data(data)
        .style('fill', function(d){
            return 'rgb('+rScale(d.frequency)+','+gScale(d.frequency)+','+bScale(d.frequency)+')';
        })
        .on("mouseover", function(d) {
    		var xPosition = d3.event.pageX;
    		var yPosition = d3.event.pageY;

            d3.select("#description")
                .html("<p>"+d.state+" ("+d.frequency+")<p>");

    		d3.select("#tooltip")
    		    .style('width', 'auto')
    			.style('left', function(d){
					if (xPosition > w/2) {
						 return 'auto';
					} else {
						 return xPosition + "px";}
					})
				.style('right', function(d){
					 if (xPosition > w/2) {
						 return innerWidth - xPosition + "px";
					} else {
						 return 'auto';}
					})
    			.style("top", yPosition + "px");

    		d3.select("#tooltip").classed("hidden", false);
                })

    	   .on("mouseout", function() {
    			d3.select("#tooltip").classed("hidden", true);
    	   });

  });

});
