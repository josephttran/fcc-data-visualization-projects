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
  const titleName = 'Doping Cases in Professional Cycling';
  const titleBgHeight = 50;
  const axisPadding = {
    top: 20,
    left: 50,
    right: 120,
    bottom: 40,
  }
  const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

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
  
  const colors = {
    allegationColor: 'blue',
    noAllegationColor: 'cyan',
  };

  displayTitle(svg, titleName, titleBgHeight);
  displayAxis(svg, axis, translates);
  displayDot(svg, axis, dataObjArr, colors);
  displayTooltip(svg, tooltip);
  displayLegend(svg, axisPadding, colors);
}

function getScatterplotScales(dataObjArr, svgWidth, svgHeight, axisPadding, titleBgHeight) {
  // X-axis
  const xMin = d3.min(dataObjArr, obj => obj['Year'] );
  const xMax = d3.max(dataObjArr, obj => obj['Year'] );
  const xDomain = [xMin - 1, xMax + 1];
  const xRange = [axisPadding.left, svgWidth - axisPadding.right];
  const xScale = d3.scaleLinear(xDomain, xRange);
  const xAxis = d3.axisBottom(xScale).tickFormat(year => year);
  // Y-axis
  const [yMin, yMax] = d3.extent(dataObjArr.map(obj => obj['Time']));
  const yDomain = [new Date('2019-01-01T00:' + yMin), new Date('2019-01-01T00:' + yMax)];
  const yRange = [svgHeight - axisPadding.bottom, axisPadding.top + titleBgHeight];
  const yScale = d3.scaleTime(yDomain, yRange);
  const timeFormat = d3.timeFormat('%M:%S');
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

function displayTitle(svg, titleName, titleBgHeight) {
  svg.append('text')
      .text(titleName)
      .attr('id', 'title')
      .attr('text-anchor', 'middle')
      .attr('x', '50%')
      .attr('y', titleBgHeight / 2 + 10);
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

function displayDot(svg, axis, dataObjArr, colors) {
  svg.selectAll('.dot')
      .data(dataObjArr)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('data-xvalue', obj => obj['Year'])
      .attr('data-yvalue', obj => new Date('2019-01-01T00:' + obj['Time']))
      .attr('cx', obj => axis.scales.x(obj['Year']))
      .attr('cy', obj => axis.scales.y(new Date('2019-01-01T00:' + obj['Time'])))
      .attr('r', 5)
      .style('fill', obj => {
        let dotColor;
        if (obj['Doping'] === '') {
          dotColor = colors.noAllegationColor;
        } else {
          dotColor = colors.allegationColor;
        }
        return dotColor;
      })
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
            .style('opacity', 0.9)
            .transition()
            .duration(500);
      })
      .on('mouseout', obj => {
          tooltip.style('opacity', 0)
              .transition()
              .duration(100);
      })
}

function displayLegend(svg, axisPadding, colors) {
  const squareLength = 10;
  const gap = 8; 
  const legendX = svg.attr('viewBox').split(' ')[2] - axisPadding.right;
  const legendY = svg.attr('viewBox').split(' ')[3] / 2;
  const legendTextX = legendX + squareLength + 5;
  const legendTextY = legendY + squareLength;
  
  const g = svg.append('g')
      .attr('id', 'legend');

  g.append('rect')
      .attr('class', 'legend-rect')
      .attr('x', legendX)
      .attr('y', legendY)
      .style('fill', colors.allegationColor);

  g.append('text').text('Doping Allegation')
      .attr('class', 'legend-text')
      .attr('x', legendTextX)
      .attr('y', legendTextY);
      
  g.append('rect')
      .attr('class', 'legend-rect')
      .attr('x', legendX)
      .attr('y', legendY + squareLength + gap)
      .style('fill', colors.noAllegationColor);

  g.append('text').text('No Allegation')
      .attr('class', 'legend-text')
      .attr('x', legendTextX)
      .attr('y', legendTextY + squareLength + gap);
}