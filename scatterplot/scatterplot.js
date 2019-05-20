(async function() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  try {
    const res = await fetch(url);
    const dataObjArr =  await res.json();
    console.log(dataObjArr);    
    displayScatterplot(dataObjArr);
  } catch(err) {
    console.log(err)
  }
})();

function displayScatterplot(dataObjArr) {
  const scatterplotContainer = d3.select('#scatterplot-container');
  const containerWidth = 600;
  const containerHeight = 350;
  const axisPadding = {
    top: 20,
    left: 50,
    right: 40,
    bottom: 40,
  }
  const svg = scatterplotContainer.append('svg')
      .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`);

  displayAxis(svg, dataObjArr, axisPadding);
}

function displayAxis(svg, dataObjArr, padding) {
  const viewBox = svg.attr('viewBox');
  const width = parseInt(viewBox.split(' ')[2] - padding.left - padding.right);
  const height = parseInt(viewBox.split(' ')[3] - padding.top - padding.bottom);
  // X-axis
  const xMin = d3.min(dataObjArr, obj => obj['Year'] );
  const xMax = d3.max(dataObjArr, obj => obj['Year'] );
  const xDomain = [xMin, xMax];
  const xRange = [0, width];
  const xScale = d3.scaleLinear(xDomain, xRange);

  svg.append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(${padding.left}, ${height})`)
      .call(d3.axisBottom(xScale).tickFormat(year => year));

  // Y-axis
  const yMin = d3.min(dataObjArr, obj => obj['Time'] );
  const yMax = d3.max(dataObjArr, obj => obj['Time'] );
  const yDomain = [yMin, yMax];
  const yRange = [height, padding.top];
  const yScale = d3.scaleOrdinal(yDomain, yRange);

  svg.append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding.left}, 0)`)
      .call(d3.axisLeft(yScale));
}
