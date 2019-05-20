(async function() {
  const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

  try {
    const res = await fetch(url);
    const dataObjArr =  await res.json();
    console.log(dataObjArr);
  } catch(err) {
    console.log(err)
  }
})();
