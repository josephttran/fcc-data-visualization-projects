(async function() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  try {
    const res = await fetch(url);
    const dataObjArr =  await res.json();
    console.log(dataObjArr);    
    displayScatterplot(dataObjArr);
  } catch(err) {
    console.log(err)
  }
})();

function displayScatterplot(dataObjArr) {
  const scatterplotContainer = d3.select('#scatterplot-container');
  const containerWidth = 600;
  const containerHeight = 350;
  const titleBgHeight = 50;
  const axisPadding = {
    top: 20,
    left: 50,
    right: 100,
    bottom: 40,
  }
  const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0)

  const svg = scatterplotContainer.append('svg')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);

  // Object with values function
  const axis = getScatterplotScales(dataObjArr, containerWidth, containerHeight, axisPadding, titleBgHeight)
  // Axis Translation coordinates
  const translates = {
    xAxis: { 
      x: 0, 
      y: containerHeight - axisPadding.bottom },
    yAxis: { 
      x: axisPadding.left, 
      y: 0},
  };

  displayAxis(svg, axis, translates);
  displayDot(svg, axis, dataObjArr);
  displayTooltip(svg, tooltip);
}

function getScatterplotScales(dataObjArr, svgWidth, svgHeight, axisPadding, titleBgHeight) {
  // X-axis
  const xMin = d3.min(dataObjArr, obj => obj['Year'] );
  const xMax = d3.max(dataObjArr, obj => obj['Year'] );
  const xDomain = [xMin - 1, xMax + 1];
  const xRange = [axisPadding.left, svgWidth - axisPadding.right];
  const xScale = d3.scaleLinear(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).tickFormat(year => year)
  // Y-axis
  const arr = dataObjArr.map(obj => obj['Time'])
  const yRange = [svgHeight - axisPadding.bottom, axisPadding.top + titleBgHeight];
  const yScale = d3.scalePoint(arr, yRange);
  const yAxis = d3.axisLeft(yScale).tickArguments([d3.timeSecond.every(15)])

  const axis = {
    scales: {
      x: xScale,
      y: yScale,
    },
    xAxis: xAxis,
    yAxis: yAxis,
  };

  return axis;
}

function displayAxis(svg, axis, translates) {
  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${translates.xAxis.x}, ${translates.xAxis.y})`)
      .call(axis.xAxis);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${translates.yAxis.x}, ${translates.yAxis.y})`)
      .call(axis.yAxis);
}

function displayDot(svg, axis, dataObjArr) {
  svg.selectAll('.dot')
      .data(dataObjArr)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', obj => obj['Year'])
      .attr('data-yvalue', obj => obj['Time'])
      .attr('cx', obj => axis.scales.x(obj['Year']))
      .attr('cy', obj => axis.scales.y(obj['Time']))
      .attr('r', 5)
      .style('fill', 'blue');
}

function displayTooltip(svg, tooltip) {
  svg.selectAll('.dot')
      .on('mouseover', function(obj) {
        const tooltipWidth = 'auto';
        let tooltipHeight = 170;

        if (obj['Doping'] === '') {
          tooltipHeight = 148;
        }

        const left = d3.event.pageX + 'px';
        const top  = d3.event.pageY - tooltipHeight + 'px';
        
        const htmlText = ` ${obj['Name']}: ${obj['Nationality']} </br> 
            ${obj['Time']} </br>
            </br>
            Year: ${obj['Year']} </br> 
            ${obj['Doping']}
        `;

        tooltip.html(htmlText)
            .style('width', tooltipWidth)
            .style('left', left)
            .style('top', top)
            .attr('data-year', obj['Year'])
            .transition()
            .duration(500)
            .style('opacity', 0.9)
      })
      .on('mouseout', obj => {
          tooltip.style('opacity', 0)
              .transition()
              .duration(100)
      })
}