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
}