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
