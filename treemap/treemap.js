(async function() {
  const kickStarterPledgesUrl = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json';
  const movieSalesUrl = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json'; 
  const videoGameSales = 'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json';

  try {
    const pledgesData = await requestData(kickStarterPledgesUrl);
    const moviesData = await requestData(movieSalesUrl);
    const videoGameData = await requestData(videoGameSales);
    displayTreemap(pledgesData, moviesData, videoGameData);
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

function displayTreemap(pledgesData, moviesData, videoGameData) {
  console.log(pledgesData);
  console.log(moviesData);
  console.log(videoGameData);
  const treemap = d3.select('#treemap');
  const mapWidth = 1200;
  const mapHeight = 640;
  const navList = 'Nav PlaceHolder'
  const titleName = 'Title Name Placeholder';
  const description = 'Description Placeholder';
  const titleBgHeight = 128;

  const svg = treemap.append('svg')
      .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

  displayHeading(svg, titleBgHeight, navList, titleName, description);
}

function displayHeading(svg, titleBgHeight, navList, titleName, description) {
  const titleFontSize = titleBgHeight / 4;

  svg.append('text')
      .text(navList)
      .attr('id', 'nav-list')
      .attr('x', '50%')
      .attr('y', titleBgHeight / 4)
      .style('text-anchor', 'middle')
      .style('font-size', titleFontSize / 2);

  svg.append('text')
      .text(titleName)
      .attr('id', 'title')
      .attr('x', '50%')
      .attr('y', titleBgHeight * 3 / 4)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('font-size', titleFontSize);
      
  svg.append('text')
      .text(description)
      .attr('id', 'description')
      .attr('x', '50%')
      .attr('y', titleBgHeight)
      .style('text-anchor', 'middle')
      .style('font-size', titleFontSize / 2);
}