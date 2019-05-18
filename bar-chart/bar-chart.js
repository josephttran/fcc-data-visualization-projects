(async function main() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

  try {
    const response = await fetch(url)
    if (response.status === 200) {
      const dataObject = await response.json();
      displayChart(dataObject);
    }
  } catch (err) {
    alert('There was a problem with the request.');
    console.log(err);
  }
})()

function displayChart(dataObject) {
  console.log(dataObject);

  const axisPadding = {
    top: 20,
    left: 50,
    right: 40,
    bottom: 40,
  }
  const dataLen = dataObject.data.length;
  const barWidth = 2;
  const barRightMargin = 1;
  const containerWidth = (dataLen * (barWidth + barRightMargin)) + axisPadding.left + axisPadding.right;
  const titleBackgroundHeight = 50;
  const containerHeight = dataLen + titleBackgroundHeight + axisPadding.top + axisPadding.bottom;

  const tooltip = d3.select('#chart-container')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);
      
  const svg = d3.select('#chart-container')
      .append('svg')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);
      
  const title = dataObject.name;
  const data = dataObject.data;

  displayTitle(svg, title, titleBackgroundHeight);
  displayAxis(svg, data, axisPadding);
  displayBar(svg, data, barWidth, barRightMargin, axisPadding);
  displayToolTip(svg, tooltip);
}

function displayTitle(svg, dataTitle, titleBackgroundHeight) {
  const titleFontSize = 'calc(12px + 2vmin)';
  const titlePadding = 20
  
  // Chart title background
  svg.append('rect')
      .attr('id', 'title-bg')
      .attr('width', '100%')
      .attr('height', titleBackgroundHeight)
      .attr('fill', '#a0ffef')
  
  // Chart title 
  svg.append('text')
      .text(dataTitle)
      .attr('id', 'title')
      .attr('fill', '#205899')
      .attr('x', '50%')
      .attr('text-anchor', 'middle')
      .attr('y', titleBackgroundHeight / 2 + titlePadding / 2)
      .attr('font-size', titleFontSize);
}

function displayAxis(svg, data, padding) {
  const viewBox = svg.attr('viewBox');
  const width = viewBox.split(' ')[2] - padding.left - padding.right;
  const height = viewBox.split(' ')[3];
  
  // X-axis
  const xMin = d3.min(data, arr => { return d3.min(arr, d => arr[0]) });
  const xMax = d3.max(data, arr => { return d3.max(arr, d => arr[0]) });
  const xDomain = [new Date(xMin), new Date(xMax)];
  const xRange = [0, width];
  const xScale = d3.scaleTime(xDomain, xRange);

  svg.append('g')
      .attr('id', 'x-axis')
      .attr('class', 'tick')
      .attr('transform', `translate(${padding.left}, ${height - padding.bottom})`)
      .call(d3.axisBottom(xScale));

  // Y-axis
  const titleHeight = parseInt(d3.select('#title-bg').attr('height'));
  const yMin = d3.min(data, arr => { return d3.min(arr, d => arr[1]) });
  const yMax = d3.max(data, arr => { return d3.max(arr, d => arr[1]) });
  const yDomain = [0, yMax];
  const yRange = [height - padding.bottom, titleHeight + padding.top];
  const yScale = d3.scaleLinear(yDomain, yRange);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('class', 'tick')
      .attr('transform', `translate(${padding.left}, 0)`)
      .call(d3.axisLeft(yScale));
}

// Bar
function displayBar(svg, data, barWidth, barRightMargin, padding) {
  const regex = /[0-9]+/g;
  const barStartX = parseInt(d3.select('#y-axis').attr('transform').match(regex)[0]);
  const barStartY = parseInt(d3.select('#x-axis').attr('transform').match(regex)[1]);

  const yMax = d3.max(data, arr => { return d3.max(arr, d => arr[1]) });
  const height = parseInt(svg.attr('viewBox').split(' ')[3]);
  const titleBgHeight = parseInt(d3.select('#title-bg').attr('height'))
  const yAxisLength = height - titleBgHeight - padding.top - padding.bottom;

  const yBarScale = yMax / yAxisLength;
  const barSpace = barWidth + barRightMargin;
  
  svg.selectAll('.bar').data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('x', (d, i) => barStartX + barWidth + (i * barSpace))
      .attr('y', (d, i) => barStartY - (d[1] / yBarScale))
      .attr('width', barWidth)
      .attr('height', (d, i) => d[1] / yBarScale);

}

// Tooltip for bar
function displayToolTip(svg, tooltip) {
  svg.selectAll('.bar')
      .on('mouseover', d => {
        const yearMonthDay = d[0].split('-');
        const year = yearMonthDay[0];
        const month = yearMonthDay[1];
        let quarter;

        if (month > 0 && month <= 3) {
          quarter = 'Q1';
        } 
        if (month > 3 && month <= 6) {
          quarter = 'Q2';
        } 
        if (month > 6 && month <= 9) {
          quarter = 'Q3';
        } 
        if (month > 9 && month <= 12) {
          quarter = 'Q4';
        } 
      
        const toolText = `${year} ${quarter} </br> $${d[1]} Billion`;
        
        tooltip.html(toolText)
            .attr('data-date', d[0])
            .style('opacity', 0.8)
            .style('top', d3.event.pageY - 80 + 'px')
            .style('left', d3.event.pageX - 100 +'px')
            .transition()
            .duration(500)
      })
      .on('mouseout', d => {
        tooltip.style('opacity', 0)
            .transition()
            .duration(100)
      });
}