var parseDate = d3.timeParse('%Y');

var rowConverter = function(d){
  return{
    songwriters: parseInt(d.Songwriters),
    producers: parseInt(d.NoProducers),
    year: parseDate(d.Year),
    album: d.Title,
    artist: d.Artist
  };
};

var dataset;
d3.csv('aoty.csv', rowConverter, function(data){
  dataset = data;
  console.log(dataset);

  var w = window.innerWidth;
  var h = 300;
  var padding = 20;
  var barPadding = 1;
  var options = ['songwriters','producers'];

  var songScale = d3.scaleLinear()
                      .domain([d3.min(dataset, function(d){
                        return d.songwriters;
                      }), d3.max(dataset, function(d){
                        return d.songwriters;
                      })])
                      .range([80,255]);

  var prodScale = d3.scaleLinear()
                      .domain([d3.min(dataset, function(d){
                        return d.producers;
                      }), d3.max(dataset, function(d){
                        return d.producers;
                      })])
                      .range([100,255]);

  var xScale = d3.scaleTime()
                  .domain([d3.min(dataset, function(d){
                    return d.year;
                  }), d3.max(dataset, function(d){
                    return d.year;
                  })])
                  .rangeRound([0, w-padding]);

  var yScale = d3.scaleLinear()
							.domain([0, d3.max(dataset, function(d){
                return d.songwriters;
              })])
							.range([0, h-padding]);

  var xAxis = d3.axisBottom(xScale);

  d3.select('#option-menu')
    .selectAll('myOptions')
    .data(options)
    .enter()
    .append('option')
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; })

  var svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function(d,i){
      return xScale(d.year);
    })
    .attr('y', function(d) {
   		return h - yScale(d.songwriters) - padding;
		})
    .attr('width', w / dataset.length - barPadding)
    .attr('height',function(d){
      return yScale(d.songwriters);
    })
    .attr('fill', function(d){
      return 'rgb('+Math.round(songScale(d.songwriters))+',0,0)';
    })
    .on("mouseover", function(d) {
					var xPosition = parseFloat(d3.select(this).attr("x")) + (w / dataset.length - barPadding) / 2;
					var yPosition = parseFloat(d3.select(this).attr("y")) / 2 + h / 2;

					d3.select("#tooltip")
						.style('left', function(d){
						    if (xPosition > w/2) {
						    return xPosition-200 +"px";
						} else {
						    return xPosition + "px";}
						})
						.style("top", yPosition + "px")
            .select("#description")
            .html('<p>Album: '+d.album+'<br>Artist: '+d.artist+'</p>')

					d3.select("#tooltip").classed("hidden", false);

			   })

	   .on("mouseout", function() {
			d3.select("#tooltip").classed("hidden", true);
	   })

  svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d){
      return d.songwriters;
    })
    .attr('x', function(d,i){
      return xScale(d.year) + (w / dataset.length - barPadding) / 2;
    })
    .attr('y', function(d){
      return h - yScale(d.songwriters) + 12 - padding;
    })
    .attr('fill', 'white')
    .attr('font-size', '12px')
    .attr('text-anchor', 'middle')

  svg.append('g')
      .call(xAxis)
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + (h-padding) + ')')

  var update = function(selectedGroup) {
      yScale.domain([0, d3.max(dataset, function(d){
        return d[selectedGroup];
      })]);
      svg.selectAll('rect')
        .data(dataset)
        .transition()
        .delay(function(d,i){
          return i * 15;
        })
        .duration(500)
        .attr('y', function(d) {
       		return h - yScale(d[selectedGroup]) - padding;
    		})
        .attr('height',function(d){
          return yScale(d[selectedGroup]);
        })
        .attr('fill', function(d){
          if (selectedGroup == 'producers') {
          return 'rgb(0,'+Math.round(prodScale(d[selectedGroup]))+',0)';
        } else {
          return 'rgb('+Math.round(songScale(d[selectedGroup]))+',0,0)';
        }
        })

      svg.selectAll('text')
        .data(dataset)
        .transition()
        .delay(function(d,i){
          return i * 15;
        })
        .duration(500)
        .text(function(d){
          return d[selectedGroup];
        })
        .attr('x', function(d,i){
          return xScale(d.year) + (w / dataset.length - barPadding) / 2;
        })
        .attr('y', function(d){
          return h - yScale(d[selectedGroup]) + 12- padding;
    })
  }

  d3.select("#option-menu").on("change", function(d) {
    var selectedOption = d3.select(this).property("value")
    update(selectedOption)
  })

});
