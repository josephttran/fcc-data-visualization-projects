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
  const minMaxYear = getMinMaxYear(data);
  const titleBgHeight = 80;
  const titleName = 'Monthly Global Land-Surface Temperature'
  const description = `${minMaxYear[0]} - ${minMaxYear[1]}: base temperature ${data['baseTemperature']} ℃`;

  const svg = heatMap.append('svg')
      .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

  displayHeading(svg, titleBgHeight, titleName, description);

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
