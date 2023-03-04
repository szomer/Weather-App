document.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    getWeather();
  }
});

function home() {
  window.location.reload();
}

async function getWeather() {
  const input = document.getElementsByClassName('searchInput');

  if (!input[0].value) {
    return;
  }
  hideError();
  hideStartPage();
  showLoading();

  const locationValue = input[0].value;
  const formattedLocation = locationValue.replace(/\s+/g, '-').toLowerCase();
  console.log('[User Input Formatted]', formattedLocation);

  await getData(formattedLocation);
}

const getData = async (location) => {
  await getWeatherLocation(location);
  await getLocationImage(location);
};

const getWeatherLocation = async (location) => {
  await fetch(`/api/weather/${location}`)
    .then((response) => response.json())
    .then(async (data) => {
      if (data) {
        // update HTML
        updateToday(data);
        updateWeek(data);

        // update page content
        showWeather();
        hideLoading();
      } else {
        locationNotFound();
        return;
      }
    })
    .catch(() => {
      locationNotFound();
      return;
    });
};

const getLocationImage = async (location) => {
  await fetch(`/api/picture/${location}`)
    .then((response) => response.blob())
    .then((imageBlob) => {
      if (imageBlob.type === 'image/jpeg') {
        // Then create a local URL for that image and print it
        const imageObjectURL = URL.createObjectURL(imageBlob);
        document.getElementById(
          'bg'
        ).style.backgroundImage = `url(${imageObjectURL})`;
      } else {
        imgNotFound();
        return;
      }
    })
    .catch(() => {
      imgNotFound();
      return;
    });
};

function imgNotFound() {
  console.log('No Images Were Found For This Location');
  document.getElementById(
    'bg'
  ).style.backgroundImage = `url("/assets/images/bg.jpg")`;
}

function locationNotFound() {
  console.log('No Location Was Found');
  hideStartPage();
  hideWeather();
  hideLoading();
  showError();
}

function hideStartPage() {
  document.getElementById('content-text').style.visibility = 'hidden';
}
function showStartPage() {
  document.getElementById('content-text').style.visibility = 'visible';
}
function hideWeather() {
  document.getElementById('content-weather').style.visibility = 'hidden';
}
function showWeather() {
  document.getElementById('content-weather').style.visibility = 'visible';
}
function showLoading() {
  document.getElementById('loading').style.visibility = 'visible';
}
function hideLoading() {
  document.getElementById('loading').style.visibility = 'hidden';
}
function showError() {
  document.getElementById('error').style.visibility = 'visible';
}
function hideError() {
  document.getElementById('error').style.visibility = 'hidden';
}

function updateToday(data) {
  var todayDiv = document.getElementById('weather-today');
  let str = `
  <div id="weather-current">
        <div>
            <label id="temp-today-day">${data.forecast[0].high} C</label><br>
            <label id="temp-today-night">${data.forecast[0].low} C</label>
        </div>
        <div>    
            <label id="today-detail">${data.current.skytext}</label><br>
            <label id="today-detail">${data.current.winddisplay}</label>
        </div>
    </div>
    <div>
        <label id="city-name">${data.location.name}</label>  <br>
        <label id="today-weekday">${data.forecast[0].day}, ${data.forecast[0].date}</label>
    </div>`;

  todayDiv.innerHTML = str;
}

function updateWeek(data) {
  var todayDiv = document.getElementById('weather-forecast');
  let str = `<div> 
    <label class="temp-weekday">${data.forecast[1].day}</label><br><br>
    <label class="temp-detail"> ${data.forecast[1].skytextday}</label><br>
    <label class="temp-day"> ${data.forecast[1].high} C</label><br>
    <label class="temp-night"> ${data.forecast[1].low} C</label>
  </div>
  <div>
  <label class="temp-weekday">${data.forecast[2].day}</label><br><br>
  <label class="temp-detail"> ${data.forecast[2].skytextday}</label><br>
  <label class="temp-day"> ${data.forecast[2].high} C</label><br>
  <label class="temp-night"> ${data.forecast[2].low} C</label>
  </div>
  <div>
  <label class="temp-weekday">${data.forecast[3].day}</label><br><br>
  <label class="temp-detail"> ${data.forecast[3].skytextday}</label><br>
  <label class="temp-day"> ${data.forecast[3].high} C</label><br>
  <label class="temp-night"> ${data.forecast[3].low} C</label>
  </div>
  <div>
  <label class="temp-weekday">${data.forecast[4].day}</label><br><br>
  <label class="temp-detail"> ${data.forecast[4].skytextday}</label><br>
  <label class="temp-day"> ${data.forecast[4].high} C</label><br>
  <label class="temp-night"> ${data.forecast[4].low} C</label>
  </div>`;

  todayDiv.innerHTML = str;
}
