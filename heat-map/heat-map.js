(async function() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

  try {
    const res = await fetch(url);

    const data = await res.json();
    console.log(data);
  } catch(err) {
    console.log(err);
  }
})()
