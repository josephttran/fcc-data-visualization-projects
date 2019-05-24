(async function() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

  try {
    const res = await fetch(url);
    const data = await res.json();
    displayHeatMap(data);
  } catch(err) {
    console.log(err);
  }
})()

function displayHeatMap(data) {
  console.log(data);
  const heatMap = d3.select('#heat-map');
  const mapWidth = 600;
  const mapHeight = 320;
  const axisPadding = {
    top: 10,
    left: 60,
    right: 10,
    bottom: 80,
  };  
  const titleBgHeight = 80;
  const titleName = 'Monthly Global Land-Surface Temperature';
  const minMaxYear = getMinMaxYear(data);
  const description = `${minMaxYear[0]} - ${minMaxYear[1]}: base temperature ${data['baseTemperature']} ℃`;

  const svg = heatMap.append('svg')
      .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

  const axis = getHeatMapAxis(data['monthlyVariance'], mapWidth, mapHeight, axisPadding, titleBgHeight);

  displayHeading(svg, titleBgHeight, titleName, description);
  displayAxis(svg, mapHeight, axis, axisPadding);
}

function displayHeading(svg, titleBgHeight, titleName, description) {
  const titleFontSize = titleBgHeight / 4;
  // Title
  svg.append('text')
      .text(titleName)
      .attr('id', 'title')
      .attr('x', '50%')
      .attr('y', titleBgHeight / 3)
      .style('text-anchor', 'middle')
      .style('font-size', titleFontSize);
      
  // Description
  svg.append('text')
      .text(description)
      .attr('id', 'description')
      .attr('x', '50%')
      .attr('y', titleBgHeight * 2 / 3)
      .style('text-anchor', 'middle')
      .style('font-size', titleFontSize - 4);
}
    
function getMinMaxYear(data) {
  return d3.extent(data['monthlyVariance'].map(obj => obj['year']));
}

function getHeatMapAxis(dataObjArr, svgWidth, svgHeight, axisPadding, titleBgHeight) {
  // X-axis
  const xDomain = d3.extent(dataObjArr.map(obj => obj['year']));
  const xRange = [axisPadding.left , svgWidth - axisPadding.right];
  const xScale = d3.scaleLinear(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).tickFormat(year => year);
  // Y-axis
  const yDomain = [new Date('January 1, 2000'), new Date('December 31, 2000')];
  const yRange = [svgHeight - axisPadding.bottom, titleBgHeight + axisPadding.top];
  const yScale = d3.scaleTime(yDomain, yRange);
  const timeFormat = d3.timeFormat('%B')
  const yAxis = d3.axisLeft(yScale).tickFormat(d => timeFormat(d));

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

function displayAxis(svg, svgHeight, axis, axisPadding) {
  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${svgHeight - axisPadding.bottom})`)
      .call(axis.xAxis);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${axisPadding.left}, 0)`)
      .call(axis.yAxis);
}