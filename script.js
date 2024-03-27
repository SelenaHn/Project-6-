// Initialize Leaflet map
var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

var simplifiedPolygons = []; // Array to store references to simplified polygons
var drawControl;

// Function to initialize drawing control
function initDrawControl() {
    drawControl = new L.Control.Draw({
        draw: {
            polyline: false,
            polygon: {
                allowIntersection: false,
                showArea: true
            },
            rectangle: false,
            circle: false,
            marker: false
        },
        edit: {
            featureGroup: drawnItems
        }
    });
    
    map.addControl(drawControl);
}

// Custom button for drawing polygons
document.getElementById('drawBtn').addEventListener('click', function () {
    if (!drawControl) {
        initDrawControl();
    }
    var drawPolygonButton = new L.Draw.Polygon(map, drawControl.options.polygon);
    drawPolygonButton.enable();
});

// Event handler for when a polygon is created
map.on('draw:created', function (e) {
    var layer = e.layer;
    drawnItems.addLayer(layer);
});

// Event handler for when the simplify button is clicked
document.getElementById('simplifyBtn').addEventListener('click', function () {
    drawnItems.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            var simplifiedPolygon = turf.simplify(layer.toGeoJSON(), { tolerance: 0.01, highQuality: false });
            var simplifiedLayer = L.geoJSON(simplifiedPolygon, { color: 'red' }).addTo(map);
            simplifiedPolygons.push(simplifiedLayer); // Store reference to simplified polygon
        }
    });
});

// Event handler for when the remove button is clicked
document.getElementById('removeBtn').addEventListener('click', function () {
    drawnItems.clearLayers(); // Clear all drawn features
    simplifiedPolygons.forEach(function (layer) {
        map.removeLayer(layer); // Remove simplified polygons
    });
});

