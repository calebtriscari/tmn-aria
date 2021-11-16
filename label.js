var rowConverter = function(d){
  return{
    rel: d.Release,
    freq: parseInt(d.Frequency),
    html: d.HTML
  };
};

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

var dataset;
d3.csv('label.csv', rowConverter, function(data){
  dataset = data;

  var w = window.innerWidth;
  var h = window.innerHeight;
  var pieW; 
    
    if (window.innerWidth >= 2 * window.innerHeight){
          pieW = window.innerHeight;
      } else {
          pieW = window.innerWidth/2.5;
      }

    var r = 8;

  var pie = d3.pie()
              .sort(null)
              .value(function(d){
              return d.freq; })

  var outerRadius = pieW / 2;
  var innerRadius = pieW / 6;
  var colour = d3.scaleOrdinal(d3.schemeCategory10);

  var arc = d3.arc()
              .innerRadius(innerRadius)
              .outerRadius(outerRadius);

  var svg = d3.select('body')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

  var arcs = svg.selectAll('g.arc')
                .data(pie(dataset))
                .enter()
                .append('g')
                .attr('class','arc')
                .attr('transform','translate('+outerRadius+', '+outerRadius+')')
                .on("mouseover", function (d, i) {
                  var xPosition = d3.event.pageX
                  var yPosition = d3.event.pageY
                    d3.select("#description")
                      .html('<p>'+d.data.html+'</p>')
                      .style('color', colour(i))
                
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

                .on('mouseout', function(){
                  d3.select("#tooltip").classed("hidden", true);
                });

  arcs.append('path')
      .attr('fill', function(d, i){
        return colour(i); })
      .attr('d', arc)
      .on('mouseover', function(){
        d3.select(this)
        .style('opacity', 0.5);
      })
      .on('mouseout', function(){
        d3.select(this)
        .style('opacity', 1);
      });

  arcs.append('text')
      .attr('transform', function(d){
        return 'translate(' + arc.centroid(d) + ')'; })
      .attr('text-anchor', 'middle')
      .text(function(d){
        return d.data.freq; })
      .attr('fill', 'white')
      .attr('font-size','20px');

   var legend = svg.selectAll("legend")
   .data(data)
   .enter()
   .append("circle")
     .attr("cx", pieW + 25 + "px")
     .attr("cy", function(d,i){
       return h*0.05 + i*40; }) // 100 is where the first dot appears. 25 is the distance between dots
     .attr("r", r)
     .style("fill", function(d, i){
       return colour(i); })

    var labels = svg.selectAll('labels')
        .data(data)
        .enter()
        .append('text')
        .attr('x', (pieW + 45))
        .attr('y', function(d,i){
            return (h*0.05 + i*40 + (r/2));
        })
        // .attr('transform', function(d, i){
        //     return 'translate('+ (pieW + 50) +', '+(h*0.05 + i*25 + (r/2))+')';})
        .text(function(d){
            return d.rel;})
        .call(wrap, 210)
        .style('fill', 'black')
        .style('font-size','12px');
       
       
       
});