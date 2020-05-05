const barChart = $('#nav-bar-chart');
const choroplethMap = $('#nav-choropleth-map');
const heatMap = $('#nav-heat-map' );
const scatterPlot = $('#nav-scatterplot');
const treeMap = $('#nav-treemap');

$(function(){
  const barChartHtml = 'bar-chart/index.html';
  $('#visual').load(barChartHtml);
});

function handleItemClick(nodeSelected, htmlPath) {
  $('#tooltip').remove();
  $('.nav div.active').removeClass('active');
  nodeSelected.addClass('active');
  $('#visual').load(htmlPath);
}

barChart.click(function() {
  const barChartHtml = 'bar-chart/index.html';
  handleItemClick($(this), barChartHtml);
});

choroplethMap.click(function() {
  const choroplethMapHtml = 'choropleth-map/index.html';
  handleItemClick($(this), choroplethMapHtml);
});

heatMap.click(function() {
  const heatMapHtml = 'heat-map/index.html';
  handleItemClick($(this), heatMapHtml);
});

scatterPlot.click(function() {
  const scatterplotHtml = 'scatterplot/index.html';
  handleItemClick($(this), scatterplotHtml);
});

treeMap.click(function() {
  const treemapHtml = 'treemap/index.html';
  handleItemClick($(this), treemapHtml);
});

