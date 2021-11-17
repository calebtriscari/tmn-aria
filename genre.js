
var rowConverter = function(d){
  return{
    genre: d.Genre,
    freq: parseInt(d.Frequency)
  };
};

function initSelf() {
  var dataset;
  d3.csv('genre.csv', rowConverter, function(data){
    dataset = data;

    var w = window.innerWidth;
    var h = window.innerHeight;
    var pieW;

    if (window.innerWidth >= 2 * window.innerHeight){
            pieW = window.innerHeight;
        } else {
            pieW = window.innerWidth/1.75;
        }

      var r = 8;

    var pie = d3.pie()
                .sort(null)
                .value(function(d){
                return d.freq; });

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
                    console.log(colour(i))

                  d3.select("#description")
                        .text(d.data.genre)
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
          .attr("cx", pieW + 30 + "px")
          .attr("cy", function(d,i){
              return h*0.05 + i*25; }) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", r)
          .style("fill", function(d, i){
              return colour(i); })

      var labels = svg.selectAll('labels')
          .data(data)
          .enter()
          .append('text')
          .attr('transform', function(d, i){
              return 'translate('+ (pieW + 50) +', '+(h*0.05 + i*25 + (r/2))+')';})
          .text(function(d){
              return d.genre;})
          .attr('fill', 'black')
          .attr('font-size','12px');

  });
}

function initInitSelf() {
  const selfFrame = window.frameElement;
  if (selfFrame.clientWidth < 600)
    selfFrame.setAttribute("height", selfFrame.clientWidth / 2);

  initSelf();
}

const topDoc = window.top.document;
if (topDoc.readyState == "loading")
  topDoc.addEventListener("DOMContentLoaded", initInitSelf);
else
  initInitSelf();
  
