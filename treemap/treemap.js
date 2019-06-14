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
  // Container
  const treemap = d3.select('#treemap');
  /* Treemap heading
   * headingTextList navList index relate to titleDescriptionData index and treemapDataList index
   */
  const treemapDataSet = {
    navList: ['Video Game Data', 'Movies Data', 'Kickstarter Data'],
    titleDescriptionData: [
      {
        titleName: 'Video Game Sales',
        description: 'Top 100 Sold Grouped by Platform',
      },
      {
        titleName: 'Movies Sales',
        description: 'Top 100 Gross Movies Grouped by Genre',
      },
      {
        titleName: 'Kickstarter Pledges',
        description: 'Top 100 Grouped by Category',
      }
    ],
    treemapDataList: [
      videoGameData, 
      moviesData,
      pledgesData,
    ]
  };
  const titleBgHeight = 128;
  // Treemap
  const tileContainerWidth = 1600;
  const tileContainerHeight = 900;
  const tileContainerPaddingTop = 20;
  const tileContainerTranslate = {
    x: 0,
    y: titleBgHeight + tileContainerPaddingTop,
  };
  const fontSize = 14;
  // Color scale
  const colors = d3.schemeAccent.concat(d3.schemeSet3);
  const colorScale = d3.scaleOrdinal(colors);
  // Legend
  const legendHeight = 300;
  const treemapWidth =  parseInt(d3.select('#treemap').style('width'));
  const legendPaddingTop = 50;
  const textLength = 200;
  const legendTranslate = {
    x: treemapWidth / 2 - textLength,
    y: titleBgHeight + tileContainerPaddingTop + tileContainerHeight + legendPaddingTop,
  };
  // Tooltip
  const tooltip = d3.select('body').append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);
  // SVG
  const svg = treemap.append('svg')
      .attr('viewBox', `0 0 ${tileContainerWidth} ${tileContainerHeight + titleBgHeight + legendHeight}`);

  displayHeading(svg, titleBgHeight, treemapDataSet);
  displayTreemapTiles(svg, tileContainerTranslate, tileContainerWidth, tileContainerHeight, fontSize, treemapDataSet.treemapDataList[0], colorScale);
  displayLegend(svg, legendTranslate, legendPaddingTop, legendHeight, textLength, treemapDataSet.treemapDataList[0], colorScale);
  displayTooltip(svg, tooltip);
  // Update on click
  handleNavClick(treemapDataSet.navList, treemapDataSet.treemapDataList, colorScale,
    tileContainerTranslate, tileContainerWidth, tileContainerHeight, fontSize, 
    legendTranslate, legendPaddingTop, legendHeight, textLength,
    tooltip
  );
}

function displayHeading(svg, titleBgHeight, headingTextList) {
  const headingGroup = svg.append('g')
      .attr('id', 'heading-group')
      .datum(headingTextList.titleDescriptionData);

  const svgWidth = parseInt(d3.select('svg').attr('viewBox').split(' ')[2]);
  const titleFontSize = titleBgHeight / 4;
  const navFontSize = titleFontSize / 2;
  const navFontWidth = navFontSize - 5;
  const descriptionFontSize = navFontSize;
  const numChar = headingTextList.navList
      .map(ele => ele.length)
      .reduce((acc, curVal) => acc + curVal);

  const headingPosition = {
    navList: {
      x: svgWidth / 2 - (numChar * navFontWidth / 2),
      y: titleBgHeight / 4,
    },
    titleName: {
      x: svgWidth / 2,
      y: titleBgHeight * 3 / 4,
    },
    description: {
      x: svgWidth / 2,
      y: titleBgHeight,
    },
  };

  displayNavLink(headingGroup, headingPosition.navList, headingTextList.navList, navFontSize, navFontWidth);
  displayTitleDescription(headingGroup, headingPosition, headingTextList.titleDescriptionData, titleFontSize, descriptionFontSize);
}

/* Navigation in Heading */ 
function displayNavLink(headingGroup, navPosition, navList, navFontSize, navFontWidth) {
  const nav = headingGroup.append('g')
      .attr('id', 'nav')
      .attr('transform', `translate(${navPosition.x}, ${navPosition.y})`);

  // Display nav item
  let navX = 0;  
  navList.forEach((navTextItem, i) => {
    nav.append('text')
        .text(navTextItem)
        .attr('class', 'nav-list')
        .attr('name', navTextItem)
        .attr('letter-spacing', 1)
        .attr('x', navX)
        .style('text-anchor', 'left')
        .style('font-size', navFontSize)
        .style('fill', 'blue');

    navX += navTextItem.length * navFontWidth;

    if (i !== navList.length - 1) {
      nav.append('text')
          .text(' | ')
          .attr('x', navX)
          .style('font-size', navFontSize);
      
      navX += 3 * navFontWidth; 
    }
  });
}

/* Title and description in heading */ 
function displayTitleDescription(headingGroup, headingPosition, titleDescriptionText, titleFontSize, descriptionFontSize) {
  const titleDescription = headingGroup.append('g')
      .datum(titleDescriptionText);

  titleDescription.append('g')
      .append('text')
      .text(d => d[0].titleName)
      .attr('id', 'title')
      .attr('transform', `translate(${headingPosition.titleName.x}, ${headingPosition.titleName.y})`)
      .style('text-anchor', 'middle')
      .style('font-weight', 'bold')
      .style('font-size', titleFontSize);

  titleDescription.append('g')
      .append('text')
      .text(d => d[0].description)
      .attr('id', 'description')
      .attr('transform', `translate(${headingPosition.description.x}, ${headingPosition.description.y})`)
      .style('text-anchor', 'middle')
      .style('font-size', descriptionFontSize);
}

/* 
 * Data in JSON format can be pass directly to d3.hierarachy
 * Root node needed to compute hierarchial layout
 * Must call root.sum before invoking d3.treemap
 */
function displayTreemapTiles(svg, tileContainerTranslate, tileContainerWidth, tileContainerHeight, fontSize, data, colorScale) {
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
      .leaves()
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
      .style('fill', d => colorScale(d.data.category))
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

function displayLegend(svg, legendTranslate, legendPaddingTop, legendHeight, textLength, data, colorScale) {
  const numberOfColors = data.children.length;
  console.log(numberOfColors)
  const column = 3;
  const row = numberOfColors / column;

  const boxMargin = 10;
  const boxHeight = (legendHeight - legendPaddingTop) / (row + boxMargin / 2);
  const boxWidth = boxHeight;
  
  const legend = svg.append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${legendTranslate.x}, ${legendTranslate.y})`);
  
  let y = 0;
  let index = 0;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < column; j++) {
      if (index === numberOfColors) {
        break;
      }
      legend.append('rect')
          .attr('x', j * textLength)
          .attr('y', y)
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .style('fill', colorScale(data.children[index].name));

      legend.append('text')
          .attr('dx', j * textLength + boxWidth + boxMargin)
          .attr('dy', y + boxHeight)
          .text(data.children[index].name)
          .style('font-size', boxHeight);
    
    index++;
    }

    y += boxHeight + boxMargin;
  }
}

function displayTooltip(svg, tooltip) {
  svg.selectAll('.tile')
  .on('mousemove', function(d) {
    const tooltipLeftMarginPadding = parseInt(tooltip.style('padding')) + parseInt(tooltip.style('margin'));
    const tooltipTopBottomMarginPadding = (parseInt(tooltip.style('padding')) * 2) 
        + (parseInt(tooltip.style('margin')) * 2);

    const tooltipHeight = parseInt(tooltip.style('height')) + tooltipTopBottomMarginPadding;
    const tooltipWidth = parseInt(tooltip.style('width')) / 2 + tooltipLeftMarginPadding;
    
    const left = d3.event.pageX - tooltipWidth  + 'px';
    const top = d3.event.pageY - tooltipHeight + 'px';

    const htmlText = `Name: ${d.data.name}</br>
        Category: ${d.data.category}</br>
        Value: ${d.data.value}
    `;

    tooltip.html(htmlText)
        .attr('data-value', d.data.value)
        .style('opacity', 0.9)
        .style('left', left)
        .style('top', top)
        .transition()
        .duration(500)
  })
  .on('mouseout', function() {
    tooltip.style('opacity', 0)
    .transition()
    .duration(200)
  });
}

/* Handle nav item on click */
function handleNavClick(navList, treemapDataList, colorScale,
                        tileContainerTranslate, tileContainerWidth, tileContainerHeight, fontSize, 
                        legendTranslate, legendPaddingTop, legendHeight, textLength,
                        tooltip) {
  const svg = d3.select('svg');

  svg.selectAll('.nav-list')
    .on('click', function(d) {
      const navTextName = d3.select(this).attr('name');
      const index = navList.indexOf(navTextName);
      const titleDescription = d3.select('#heading-group').data()[0][index]
      const newTitle = titleDescription.titleName;
      const newDescription = titleDescription.description; 
      // Update title
      d3.select('#title')
      .text(d => newTitle);
      
      // Update description
      d3.select('#description')
      .text(d => newDescription);
      
      // Update treemap
      d3.select('#tile-container').remove();
      displayTreemapTiles(svg, tileContainerTranslate, tileContainerWidth, tileContainerHeight, fontSize, treemapDataList[index], colorScale);
      
      // Update Legend
      d3.select('#legend').remove();
      displayLegend(svg, legendTranslate, legendPaddingTop, legendHeight, textLength, treemapDataList[index], colorScale);
      
      // Update tooltip
      displayTooltip(svg, tooltip);
    });
}