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

  const navList = 'Nav PlaceHolder'
  const titleName = 'Title Name Placeholder';
  const description = 'Description Placeholder';
  const titleBgHeight = 128;
  
  const tileContainerWidth = 1600;
  const tileContainerHeight = 900;
  const tileContainerPaddingTop = 20;
  const tileContainerTranslate = {
    x: 0,
    y: titleBgHeight + tileContainerPaddingTop,
  };
  const fontSize = 14;

  const svg = treemap.append('svg')
      .attr('viewBox', `0 0 ${tileContainerWidth} ${tileContainerHeight + titleBgHeight}`);
  
  displayHeading(svg, titleBgHeight, navList, titleName, description);
  displayTreemapTiles(svg, tileContainerTranslate, tileContainerWidth, tileContainerHeight, videoGameData, fontSize);
}

function displayHeading(svg, titleBgHeight, navList, titleName, description) {
  const titleFontSize = titleBgHeight / 4;
  const headerGroup = svg.append('g').attr('id', 'header-group');

  headerGroup.append('text')
      .text(navList)
      .attr('id', 'nav-list')
      .attr('x', '50%')
      .attr('y', titleBgHeight / 4)
      .style('text-anchor', 'middle')
      .style('font-size', titleFontSize / 2);

  headerGroup.append('text')
      .text(titleName)
      .attr('id', 'title')
      .attr('x', '50%')
      .attr('y', titleBgHeight * 3 / 4)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('font-size', titleFontSize);
      
  headerGroup.append('text')
      .text(description)
      .attr('id', 'description')
      .attr('x', '50%')
      .attr('y', titleBgHeight)
      .style('text-anchor', 'middle')
      .style('font-size', titleFontSize / 2);
}
/* 
 * Data in JSON format can be pass directly to d3.hierarachy
 * Root node needed to compute hierarchial layout
 * Must call root.sum before invoking d3.treemap
 */
function displayTreemapTiles(svg, tileContainerTranslate, tileContainerWidth, tileContainerHeight, data, fontSize) {
  const tileContainer = svg.append('g')
      .attr('id', 'tile-container')
      .attr('transform', `translate(${tileContainerTranslate.x}, ${tileContainerTranslate.y})`);

  const root = d3.hierarchy(data, d => d['children']);
  const treemap = d3.treemap()
      .size([tileContainerWidth, tileContainerHeight]);

  const nodes = treemap(root
          .sum(d => d.value)
          .sort((a, b) => b.value - a.value)
      )
      .leaves();

  const tiles = tileContainer.selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('transform', d => `translate(${d.x0}, ${d.y0})`)

  tiles.append('rect')
      .attr('class', 'tile')
      .attr('data-name', d => d.data.name)
      .attr('data-category', d => d.data.category)
      .attr('data-value', d => d.data.value)
      .attr('width', d => d.x1 - d.x0)
      .attr('height', d => d.y1 - d.y0)
      .style('fill', 'cyan')
      .style('stroke', 'white')

  tiles.append('text')
      .attr('class', 'tile-text')
      .style('font-size', fontSize);

  d3.selectAll('.tile-text')
      .each(function(d) {
        const itemName = d.data.name;
        const nameArr = itemName.split(' ')
        const textNode = d3.select(this);

        for (let i = 0; i < nameArr.length; i++) {
          textNode.append('tspan')
              .text(nameArr[i])
              .attr('x', 0)
              .attr('dx', 5)
              .attr('dy', fontSize + 2);
              
          while (nameArr[i + 1] && nameArr[i + 1].length < 4) {
            i++;
            textNode.append('tspan')
                .text(nameArr[i])
                .attr('dx', 4);
          }
        }
      });
}
