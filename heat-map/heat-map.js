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

const months = {
  1: 'January',
  2: 'Febuary',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

function displayHeatMap(data) {
  console.log(data);
  const heatMap = d3.select('#heat-map');
  const mapWidth = 600;
  const mapHeight = 320;
  const axisPadding = {
    top: 10,
    left: 60,
    right: 60,
    bottom: 80,
  };
  const titleBgHeight = 80;
  const titleName = 'Monthly Global Land-Surface Temperature';
  const minMaxYear = getMinMaxYear(data);
  const description = `${minMaxYear[0]} - ${minMaxYear[1]}: base temperature ${data['baseTemperature']} ℃`;
  const cellHeight = (mapHeight - titleBgHeight - axisPadding.bottom - axisPadding.top) / 12;
  const cellWidth = (mapWidth - axisPadding.left - axisPadding.right) / (minMaxYear[1] - minMaxYear[0]);
  const cell = {
    width: cellWidth,
    height: cellHeight,
  };
  const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

  const svg = heatMap.append('svg')
      .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

  const axis = getHeatMapAxis(data['monthlyVariance'], mapWidth, mapHeight, axisPadding, titleBgHeight);

  displayHeading(svg, titleBgHeight, titleName, description);
  displayAxis(svg, mapHeight, axis, axisPadding);
  displayCell(svg, data, axis, cell);
  displayTooltip(svg, tooltip);
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

function displayCell(svg, data, axis, cell) {
  const baseTemp = data['baseTemperature'];

  svg.selectAll('.cell')
      .data(data['monthlyVariance'])
      .enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('data-month', obj => obj['month'])
      .attr('data-year', obj => obj['year'])
      .attr('data-temp', obj => baseTemp + obj['variance'])
      .attr('x', obj => axis.scales.x(obj['year']))
      .attr('y', obj => axis.scales.y(new Date(`${months[obj['month']]} 1, 2000`)) - cell.height)
      .attr('width', cell.width)
      .attr('height', cell.height)
      .style('fill', 'lightblue');
}

function displayTooltip(svg, tooltip) {
  svg.selectAll('.cell')
      .on('mouseover', function(data) {
        const tooltipLeftMarginPadding = parseInt(tooltip.style('padding')) + parseInt(tooltip.style('margin'));
        const tooltipTopBottomMarginPadding = (parseInt(tooltip.style('padding')) * 2) 
            + (parseInt(tooltip.style('margin')) * 2);

        const tooltipHeight = parseInt(tooltip.style('height')) + tooltipTopBottomMarginPadding;
        const tooltipWidth = parseInt(tooltip.style('width')) / 2 + tooltipLeftMarginPadding;
        
        const left = d3.event.pageX - tooltipWidth  + 'px';
        const top = d3.event.pageY - tooltipHeight + 'px';
        // Get temperature and round to one decimal place
        let temperature = parseFloat(d3.select(this).attr('data-temp')).toFixed(1);
        let variance = data['variance'].toFixed(1);
        
        if (variance > 0) {
          variance = '+' + variance;
        }

        const htmlText = `${months[data['month']]} ${data['year']}</br></br>
            Temperature: ${temperature}℃ </br>
            Variance &nbsp;&nbsp;&nbsp : ${variance}℃
        `;

        tooltip.html(htmlText)
            .attr('data-year', data['year'])
            .style('opacity', 0.9)
            .style('left', left)
            .style('top', top)
            .transition()
            .duration(500)
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0)
        .transition()
        .duration(200)
      });
}