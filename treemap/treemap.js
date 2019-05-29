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

  const svg = treemap.append('svg')
      .attr('viewBox', `0 0 ${mapWidth} ${mapHeight}`);

}
