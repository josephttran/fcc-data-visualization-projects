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
  
  const containerWidth = 600;
  const containerHeight = 300;

  const svg = d3.select('#chart-container')  
      .append('svg')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
      
  const title = dataObject.name
  displayTitle(svg, title);

  const data = dataObject.data;
  displayAxis(svg, data);
}

function displayTitle(svg, dataTitle) {
  console.log(dataTitle);

  const titleFontSize = 'calc(12px + 2vmin)';
  const titlePadding = 20
  const titleBackgroundHeight = 50;
  
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

function displayAxis(svg, data) {
  const viewBox = svg.attr('viewBox');
  const width = viewBox.split(' ')[2];
  const height = viewBox.split(' ')[3]

  const topPadding = 20;
  const bottomPadding = 40;
  const leftPadding = 50;
  const rightPadding = 40;
  
  // X-axis
  const xMin = d3.min(data, arr => { return d3.min(arr, d => arr[0]) });
  const xMax = d3.max(data, arr => { return d3.max(arr, d => arr[0]) });
  const xDomain = [new Date(xMin), new Date(xMax)];
  const xRange = [0, width - leftPadding - rightPadding];
  const xScale = d3.scaleTime(xDomain, xRange);

  svg.append('g')
      .attr('id', 'x-axis')
      .attr('class', 'tick')
      .attr('transform', `translate(${leftPadding}, ${height - bottomPadding})`)
      .call(d3.axisBottom(xScale));

  // Y-axis
  const titleHeight = parseInt(d3.select('#title-bg').attr('height'));
  const yMin = d3.min(data, arr => { return d3.min(arr, d => arr[1]) });
  const yMax = d3.max(data, arr => { return d3.max(arr, d => arr[1]) });
  const yDomain = [yMin, yMax];
  const yRange = [height - bottomPadding, titleHeight + topPadding];
  const yScale = d3.scaleLinear(yDomain, yRange);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('class', 'tick')
      .attr('transform', `translate(${leftPadding}, 0)`)
      .call(d3.axisLeft(yScale))
}
