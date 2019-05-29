(async function() {
  const countyUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json';
  const educationUrl = 'https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json';
  
  try {
    const countyData = await requestData(countyUrl);
    const educationData = await requestData(educationUrl);
    displayChoroplethMap(countyData, educationData);
  } catch(err) {
    console.log(err);
  }
})()

async function requestData(url) {
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch(err) {
    console.log(err);
  }
}

function displayChoroplethMap(countyData, educationData) {
  console.log(countyData);
  console.log(educationData);
  const choroplethMap = d3.select('#choropleth-map');
  const mapWidth = 1200;
  const mapHeight = 640;
  const titleBgHeight = 200;
  const titleName = 'United States Educational Attainment';
  const description = `Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)`;
  const paddingLeft = 200;
  const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

  const svg = choroplethMap.append('svg')
      .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);
  
  const counties = countyData['objects']['counties'];
  const countiesGeoJson = topojson.feature(countyData, counties);
  const colorScale = d3.scaleSequential(d3.interpolateGreens)

  displayHeading(svg, titleBgHeight, titleName, description);
  displayCounties(svg, countiesGeoJson, paddingLeft);
  addEducationDataToCounties(svg, educationData);
  fillCounties(svg, colorScale);
  displayTooltip(svg, tooltip);
  displayLegend(svg, mapHeight, paddingLeft, colorScale);
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
      .style('font-size', titleFontSize / 3);
}

function displayCounties(svg, countiesGeoJson, paddingLeft) {
  const descriptionY = parseInt(d3.select('#description').attr('y'));
  const projection = geoProjectionScale(0.8, paddingLeft, descriptionY)
  const path = d3.geoPath().projection(projection);

  svg.append('g').selectAll('path')
      .data(countiesGeoJson.features)
      .enter()
      .append('path')
      .attr('class', 'county')
      .attr('d', path)
}

function geoProjectionScale(scaleFactor, translateX, translateY) {
  return d3.geoTransform({
    point: function(x, y) {
      this.stream.point(x * scaleFactor + translateX, y * scaleFactor + translateY);
    }
  });
}

function addEducationDataToCounties(svg, educationData) {
  svg.selectAll('.county')
      .each(function(d) {
        const objIndex = educationData.map(obj => obj['fips']).indexOf(d['id']);
        
        d3.select(this)
            .datum(educationData[objIndex])
            .attr('data-fips', educationData[objIndex]['fips'])
            .attr('data-education', educationData[objIndex]['bachelorsOrHigher'])
      });
}

function fillCounties(svg, colorScale) {
  svg.selectAll('.county')
      .style('fill', obj => {
        const educationRate = obj['bachelorsOrHigher'];
        return colorScale(educationRate/100)
      })
}

function displayTooltip(svg, tooltip) {
  svg.selectAll('.county')
      .on('mouseover', function(obj) {
        const tooltipLeftMarginPadding = parseInt(tooltip.style('padding')) + parseInt(tooltip.style('margin'));
        const tooltipTopBottomMarginPadding = (parseInt(tooltip.style('padding')) * 2) 
            + (parseInt(tooltip.style('margin')) * 2);

        const tooltipHeight = parseInt(tooltip.style('height')) + tooltipTopBottomMarginPadding;
        const tooltipWidth = parseInt(tooltip.style('width')) / 2 + tooltipLeftMarginPadding;

        const left = d3.event.pageX - tooltipWidth  + 'px';
        const top = d3.event.pageY - tooltipHeight + 'px';

        const htmlText = `${obj['area_name']}, ${obj['state']}</br>
          ${obj['bachelorsOrHigher']}%
        `;       

        tooltip.html(htmlText)
            .attr('data-education', obj['bachelorsOrHigher'])
            .style('opacity', 1)
            .style('top', top)
            .style('left', left)
            .transition()
            .duration(200);
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0)
            .transition()
            .duration(200);
      })
}

function displayLegend(svg, svgHeight, paddingLeft, colorScale) {
  const legendX = paddingLeft / 4;
  const legendY = svgHeight * 3 / 4;
  
  const numOfBox = 9;
  const boxHeight = 30;
  const boxWidth = boxHeight + 4;
  const tickLine = boxWidth + 5;
  
  const numOfTick = numOfBox - 1;
  const legendTickValues = [];
  const tickStart = 3;
  const tickStep = 9;
  let tick = tickStart;

  for (let i = 0; i < numOfTick; i++) {
    legendTickValues.push(tick);
    tick += tickStep;
  }
  
  const legendRange = [legendY, legendY - boxHeight * numOfBox];
  const legendScale = d3.scaleBand(legendTickValues, legendRange)
      .paddingInner(1)
      .paddingOuter(1);

  const legendAxis = d3.axisRight(legendScale)
      .tickSize(tickLine)
      .tickPadding(10)
      .tickFormat(d => d + '%');

  const legend = svg.append('svg')
      .attr('id', 'legend');
  // Legend boxes with scaling color
  let colorNum;
  for (let i = 0; i < numOfBox; i++) {
    colorNum = legendTickValues[i] / 100;

    if (i + 1 === numOfBox) {
      // Box above last tick mark      
      colorNum = 1;
    }

    legend.append('rect')
        .attr('x', legendX)
        .attr('y', legendY - (i * boxHeight) - boxHeight)
        .attr('height', boxHeight)
        .attr('width', boxWidth)
        .style('fill', colorScale(colorNum));
  }

  // Tick marks
  legend.append('g')
      .call(legendAxis)
      .attr('transform', `translate(${legendX}, 0)`)
      .attr('font-size', 16);
}