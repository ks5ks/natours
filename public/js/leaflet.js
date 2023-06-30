/* eslint-disable */
export const displayMap = (start, locations) => {
  const map = L.map('map', { zoomControl: false }).setView(
    start.coordinates.reverse(),
    5
  );

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.dragging.disable();

  const myIcon = L.icon({
    iconUrl: './../img/pin.png',
    iconSize: [30, 35],
    iconAnchor: [15, 35],
    popupAnchor: [0, -50],
  });

  const markerArray = [];
  locations.forEach((loc) => {
    const reversedArr = [...loc.coordinates].reverse();
    markerArray.push(reversedArr);

    L.marker(reversedArr, { icon: myIcon })
      .addTo(map)
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        className: 'mapPopup',
      })
      .on('mouseover', function (e) {
        this.openPopup();
      })
      .on('mouseout', function (e) {
        this.closePopup();
      });
  });

  const bounds = L.latLngBounds(markerArray).pad(0.5);
  map.fitBounds(bounds);
  map.scrollWheelZoom.disable();
};
