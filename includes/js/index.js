// Default coordinates set to interurban campus
let userLat = 48.49103113795146;
let userLong = -123.41514114992222;

async function getUserCoords() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject({ userLat, userLong });
        }

        navigator.geolocation.getCurrentPosition(
            // success function
            (position) => {
                userLat = position.coords.latitude;
                userLong = position.coords.longitude;
                resolve({ userLat, userLong })
            },
            // error function - defaults to interurban
            () => {
                reject({ userLat, userLong });
            }
        );
    });
}

async function getPorts() {
    const response = await fetch("includes/json/ports.json");
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }

    const ports = await response.json();
    return ports;
}

async function loadMap() {
    const { userLat, userLong } = await getUserCoords();
    const ports = await getPorts();

    var map = L.map('map', {
        center: [userLat, userLong],
        zoom: 13,
    });

    // Add the tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add a marker at Interurban or user location on load
    var marker = L.marker([userLat, userLong]).addTo(map).bindPopup("You are here!");

    // Add markers at all ports
    for (let i = 0; i < ports.length; i++) {
        L.marker([ports[i].coordinates[0], ports[i].coordinates[1]]).addTo(map).bindPopup(`${ports[i].name}`);
    }

    // Load and duplicate water polygons //
    // This stuff is where Joe differentiates the land and sea. DON'T Change this Stuff //
    // Unless you dont want it to work.
    let waterPolygons;
    // Duplicating the land and sea over 3 sets of world maps
    function duplicateWaterPolygons(original) {
        const offsets = [-360, 0, 360];
        const allFeatures = [];

        for (const offset of offsets) {
            const wrapped = JSON.parse(JSON.stringify(original));
            for (const feature of wrapped.features) {
                const geom = feature.geometry;
                if (geom.type === "Polygon") {
                    geom.coordinates = geom.coordinates.map(ring =>
                        ring.map(([lng, lat]) => [lng + offset, lat])
                    );
                } else if (geom.type === "MultiPolygon") {
                    geom.coordinates = geom.coordinates.map(polygon =>
                        polygon.map(ring =>
                            ring.map(([lng, lat]) => [lng + offset, lat])
                        )
                    );
                }
            }
            allFeatures.push(...wrapped.features);
        }

        return {
            type: "FeatureCollection",
            features: allFeatures
        };
    }
    // Fetching JSON data to make the boundaries
    fetch('includes/json/ocean.geojson')
        .then(res => res.json())
        .then(data => {
            waterPolygons = duplicateWaterPolygons(data);
        });

    /* Click event to detect land or water. You will have to add things and change things in here
    But you won't likely want to delete  this! */
    map.on('click', function (e) {
        if (!waterPolygons) return;
        const point = turf.point([e.latlng.lng, e.latlng.lat]);
        let isInWater = null;
        for (let feature of waterPolygons.features) {
            if (turf.booleanPointInPolygon(point, feature)) {
                isInWater = true;
                break;
            }
        }
        // if its water, do something!!! Definitely delete those alerts.
        if (isInWater) {
            alert("This is Water");
        } else {
            alert("This is not Water!");
        }
    });
}

loadMap();
