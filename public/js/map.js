// Ensure the map token and coordinates are set correctly
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: [77.10249020, 28.70405920],
    zoom: 9
});

const marker = new mapboxgl.Marker({color:'red'})
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Stay Location</p>`)) 
    .addTo(map); // Add the marker to the map
