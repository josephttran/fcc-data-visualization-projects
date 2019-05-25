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
  const svg = choroplethMap.append('svg')
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
      .style('font-size', titleFontSize / 3);
}