var rowConverter = function(d){
  return{
    category: d.Category,
    frequency: parseInt(d.Frequency)
  };
};

var dataset;
d3.csv('gender.csv', rowConverter, function(data){
  dataset = data;
  console.log(dataset);


  var padding = 20;
  var w = window.innerWidth;
  var h = window.innerHeight - 20;
  var colours = ['crimson', 'mediumblue'];

  var xScale = d3.scaleBand()
                .domain(['Female-fronted', 'Not female-fronted'])
                .rangeRound([padding, w - padding]);

  var yScale = d3.scaleLinear()
                  .domain([0, d3.max(dataset, function(d){
                    return d.frequency;
                  })])
                  .range([padding, h - padding])

  var svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  var xAxis = d3.axisBottom(xScale);

  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('width', (w / dataset.length) / 1.5)
    .attr('height',function(d){
      return yScale(d.frequency);
    })
    .attr('x', function(d,i){
        return (w * 0.5 * i) + (w * 0.25) - (((w / dataset.length) / 1.5) / 2) + (padding * (1 * -i));
      //return xScale(d.category) + padding // * 1.5;
    })
    .attr('y', function(d) {
   		return h - yScale(d.frequency) - padding;
		})
    .attr('fill', function(d, i){
      return colours[i];
    })

  svg.selectAll('text')
    .data(dataset)
    .enter()
    .append('text')
    .text(function(d){
      return d.frequency;
    })
    .attr('x', function(d,i){
      return (w * 0.5 * i) + (w * 0.25) + (padding * (1 * -i)); //- (((w / dataset.length) / 1.5) / 2);
    })
    .attr('y', function(d){
      return h - yScale(d.frequency) + 20 - padding;
    })
    .attr('fill', 'white')
    .attr('font-size', '18px')
    .attr('text-anchor', 'middle')

  svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .call(xAxis)
});
