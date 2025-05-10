/*
PLEASE READ:

This is possibly the worst thing I have ever made.
It is a complete disaster and I made so many bad design choices.
It is possibly really buggy (I know it is, who am I kidding).
Unfortunately I did not have a lot of time to work on this and this whole thing was really rushed.
I realize it looks bad, barely works, and the code is garbage.
I call the same functions over and over and over.
I barely have error handling.
I should have used classes probably.
At this point I am just submitting and hoping I pass.
Also I did a lot of this on no sleep and late at night.
I know I could have done this 1000x better if I wasn't such a mess lol.
I did learn about IIFEs and those are cool and I used them a bunch.

I did my best to follow your rubric, for almost everything.
Honest to god though, I gave up around the checkout routine (and it is obvious).
Oh and my commenting is terrible, I just did not have time to comment as I went.
I just did the checkout routine and localStorage stuff and I really need to sleep so I'm just gonna turn it in.
Sorry for rambling.

In order to find instances where I used course topics you can CTRL+F this emoji:  ⭐

Please forgive me for the code you are about to read.

P.S.
If everything breaks, oh well, I just shuffled a bunch of stuff around and don't really have time to test.
Worst case scenario I can always retake the course haha.
*/




// Default coordinates set to interurban campus
let userLat = 48.49103113795146;
let userLong = -123.41514114992222;


const calculateTotalCost = (vessel, tripDetails) => {
    return vessel.base_rental_rate
        + (vessel.crew_required * vessel.crew_cost_per_member)
        + (vessel.cost_per_nautical_mile * tripDetails.tripDistance)
        + (tripDetails.isRaining ? vessel.fuel_surcharge * 2 : vessel.fuel_surcharge);
};



// okay so I figured out this localStorage thing at like 2am
// idk what is going on
// it works
// it's gross
// i have so much regret and wish I did everything differently
// also i know i haven't commented this project much, im so low on time and have given up on commenting

// ⭐ USE OF LET VARIABLES
let cartTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
let numberOfCartItems = parseInt(localStorage.getItem("numberOfCartItems")) || 0;
let vesselsInCart = JSON.parse(localStorage.getItem("vesselsInCart") || "[]");
let trip = JSON.parse(localStorage.getItem("tripDetails") || "[]");
(obtainLocalStorageInfo = () => {
    if (numberOfCartItems > 0) {
        $("#emptyCart").html("");

        for (const vessel of vesselsInCart) {
            $("#cartItems").append(`
                <li id="${vessel.vessel.name.replaceAll(" ", "")}CartItem" class="list-group-item">
                    <div class="d-flex justify-content-between">
                        <p>Boat: ${vessel.vessel.name}<br><b>Cost:</b> $${calculateTotalCost(vessel.vessel, trip).toFixed(2)}</p>
                        <button id="${vessel.vessel.name.replaceAll(" ", "")}RemoveFromCart" class="btn" type="button"><i class="fa-solid fa-x"></i></button>
                    </div>
                </li>
            `);

            $(`#${vessel.vessel.name.replaceAll(" ", "")}RemoveFromCart`).on("click", () => {
                $(`#${vessel.vessel.name.replaceAll(" ", "")}CartItem`).remove();
                cartTotal -= calculateTotalCost(vessel.vessel, trip);
                $("#cartTotal").html(`<b>Total: </b>$${cartTotal.toFixed(2)}`);
                numberOfCartItems--;

                const indexToRemove = vesselsInCart.findIndex(v => v.vessel.name === vessel.vessel.name);
                if (indexToRemove !== -1) {
                    vesselsInCart.splice(indexToRemove, 1);
                }

                localStorage.setItem("cartTotal", cartTotal);
                localStorage.setItem("numberOfCartItems", numberOfCartItems);
                localStorage.setItem("vesselsInCart", JSON.stringify(vesselsInCart));

                if (numberOfCartItems === 0) {
                    $("#emptyCart").html("Empty cart");
                }
            });
        }

        $("#cartTotal").html(`<b>Total: </b>$${cartTotal.toFixed(2)}`);
    } else {
        $("#emptyCart").html("Empty cart");
    }
})();

// empty cart btn
$(`#emptyCartBtn`).on("click", () => {
    $("#cartItems").html("");
    numberOfCartItems = 0;
    $("#emptyCart").html("Empty cart");
    cartTotal = 0;
    $("#cartTotal").html(`<b>Total: </b>$${cartTotal.toFixed(2)}`);

    vesselsInCart = [];

    localStorage.setItem("cartTotal", cartTotal);
    localStorage.setItem("numberOfCartItems", numberOfCartItems);
    localStorage.setItem("vesselsInCart", JSON.stringify(vesselsInCart));
});

const bookingModal = new bootstrap.Modal(document.getElementById("bookingDetailsModal"));
const customerInfoModal = new bootstrap.Modal(document.getElementById("customerInfoModal"));
const orderConfirmModal = new bootstrap.Modal(document.getElementById("confirmBookingModal"));
const bookedModal = new bootstrap.Modal(document.getElementById("bookedModal"));
const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById("offcanvasCart"));

// book trip btn
$("#cartBookBtn").on("click", () => {
    if (numberOfCartItems > 0) {
        bookingModal.show();
        const bookingItems = $("#cart").html();
        $("#bookingItems").html(bookingItems);
    }
});

// confirm btn for booking details modal
$("#bookingDetailsConfirm").on("click", () => {
    bookingModal.hide();
    customerInfoModal.show();
});

// customer info submit btn w/ regex and shit
customerInfoSubmit.addEventListener("click", () => {
    // Error message shit
    let error = false;
    let errorDiv = document.querySelector("#error");
    let errorMessage = "";

    // Input values
    const firstName = document.querySelector("#firstName").value;
    const lastName = document.querySelector("#lastName").value;
    const email = document.querySelector("#email").value;
    const phoneNumber = document.querySelector("#phoneNumber").value;
    const address = document.querySelector("#address").value;
    const city = document.querySelector("#city").value;
    const province = document.querySelector("#province").value;
    const country = document.querySelector("#country").value;

    const postalCode = document.querySelector("#postalCode").value;

    // ⭐ USE OF REGEX TO VALIDATE FORM DATA
    // Regex
    const nameReggie = /^[a-zA-Z]+$/;
    const emailReggie = /^\w+@[a-zA-Z]+\.[a-zA-Z]+$/;
    const postalReggie = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;
    const phoneReggie = /^[0-9][0-9][0-9][ |-]?[0-9][0-9][0-9][ |-]?[0-9][0-9][0-9][0-9]$/

    // more Regex
    const checkForBlank = /^$/;
    const checkForSpace = / /;
    const checkForNotAZ = /[^A-Za-z]/;
    const checkForNotAZEmailEdition = /@.*[^A-Za-z|.].*/ // after the @ if there are any non alphabetical or non period characters
    const checkForNotAlphanumeric = /[^a-zA-Z\d\s]/;
    // Validate name inputs
    // Add check for each kind of error
    if (!(nameReggie.test(firstName))) {
        errorMessage = "First name:\n";

        if (checkForBlank.test(firstName)) {
            errorMessage += "is blank\n";
        }

        if (checkForSpace.test(firstName)) {
            errorMessage += "has a space\n";
        }

        if (checkForNotAZ.test(firstName)) {
            errorMessage += "has a non alphabetical character\n";
        }

        error = true;

        document.querySelector("#firstName").value = "";
    }

    if (!(nameReggie.test(lastName))) {
        errorMessage = "Last name:\n";

        if (checkForBlank.test(lastName)) {
            errorMessage += "is blank\n";
        }

        if (checkForSpace.test(lastName)) {
            errorMessage += "has a space\n";
        }

        if (checkForNotAZ.test(lastName)) {
            errorMessage += "has a non alphabetical character\n";
        }

        error = true;

        document.querySelector("#lastName").value = "";
    }

    if (!error) {
        // Validate email inputs
        if (!(emailReggie.test(email))) {
            errorMessage = "Email must be entered as email@email.com\n";

            if (checkForNotAZEmailEdition.test(email)) {
                errorMessage += "and the domains must be alphabetical\n"
            }

            error = true;

            document.querySelector("#email").value = "";
        }
    }

    if (!error) {
        // Validate postal code
        if (!(postalReggie.test(postalCode))) {
            errorMessage = "Postal format: X0X0X0 or X0X 0X0\n";
            error = true;

            document.querySelector("#postalCode").value = "";
        }
    }

    if (!error) {
        // Validate phone number
        if (!(phoneReggie.test(phoneNumber))) {
            errorMessage = "Phone number format whack\n";
            error = true;

            document.querySelector("#phoneNumber").value = "";
        }
    }

    if (!error) {
        // validate address
        if (checkForNotAlphanumeric.test(address)) {
            errorMessage = "Address not alphanumeric\n";
            error = true;

            document.querySelector("#address").value = "";
        }
    }

    if (!error) {
        // validate city
        if (checkForNotAlphanumeric.test(city)) {
            errorMessage = "City not alphanumeric\n";
            error = true;

            document.querySelector("#city").value = "";
        }
    }

    if (!error) {
        // validate province
        if (checkForNotAlphanumeric.test(province)) {
            errorMessage = "State/Province not alphanumeric\n";
            error = true;

            document.querySelector("#province").value = "";
        }
    }

    if (!error) {
        // validate country
        if (checkForNotAlphanumeric.test(country)) {
            errorMessage = "Country not alphanumeric\n";
            error = true;

            document.querySelector("#country").value = "";
        }
    }

    errorDiv.innerText = errorMessage;

    if (!error) {
        customerInfoModal.hide();
        cartOffcanvas.hide();
        orderConfirmModal.show();
    }
});

$("#orderConfirm").on("click", () => {
    orderConfirmModal.hide();
    bookedModal.show();
    $("#emptyCartBtn").click(); // i can't believe this worked. i just guessed this existed.
})

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

// ⭐ USE OF FETCH
async function getPorts() {
    const response = await fetch("public/ports.json");
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    const ports = await response.json();
    return ports;
}

async function getVessels() {
    const response = await fetch("public/vessels.json");
    if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
    }
    const vessels = await response.json();
    return vessels;
}

async function getWeatherData(latitude, longitude) {
    // not my api key
    // note to self: if you do start using your own use a proxy server or something (before you commit)
    const API_KEY = "408910547897fd9d7029410128827a6d";
    const UNITS = "metric";

    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${UNITS}&appid=${API_KEY}`;

    try {
        const response = await fetch(URL);

        if (!response.ok) {
            // ⭐ USE OF THROWING ERROR
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        return data;
    } catch (e) {
        console.error(`An error occurred while fetching weather data: ${e}`);
    }
}

// I used leaflet's PosAnimation: https://leafletjs.com/reference.html#posanimation
// ⭐ USE OF ANIMATION TECHNIQUES
// ⭐ USE OF LEAFLET KNOWLEDGE
async function runBoatAnimation(latlngs, map) {
    const boatIcon = L.divIcon({
        html: `<i class="fa-solid fa-ship text-danger" style="font-size: 1.5rem"></i>`,
        className: ""
    });
    const boat = L.marker([latlngs[0].lat, latlngs[0].lng], { icon: boatIcon }).addTo(map);
    const fx = new L.PosAnimation();

    // used to ensure each PosAnimation runs one at a time
    const moveBoatToPos = (latlng) => {
        return new Promise((resolve, reject) => {
            // ⭐ USE OF TRY/CATCH
            try {
                const pos = map.latLngToLayerPoint(latlng);
                fx.run(boat._icon, pos, 2); // run the animation
                fx.once('end', resolve); // resolve the promise
            } catch (e) {
                reject(e); // reject with error
            }
        });
    };

    for (let i = 1; i < latlngs.length; i++) {
        await moveBoatToPos(latlngs[i]);
    }
}

async function loadMap() {
    const { userLat, userLong } = await getUserCoords();
    const ports = await getPorts();
    const vessels = await getVessels();

    let tripStarted = false; // used to keep track of if a user has started a trip for controlling state of marker popups
    let latlngsForTrip = []; // used to keep track of marker coords (used to draw leaflet polyline)
    let tripPolyline = null;
    let stops = [] // used to keep track of markers that are generated by clicking on ocean
    let tripDistance = 0;

    var map = L.map('map', {
        center: [userLat, userLong],
        zoom: 4,
    });

    // Add the tile layer
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add a marker at Interurban or user location on load
    const userLocIcon = L.divIcon({
        html: `<i class="fa-solid fa-location-dot text-success" style="font-size: 1.5rem"></i>`,
        className: "", // remove leaflet stylings
        iconSize: [24, 24], // 24px x 24px --- 24px ~= 1.5rem
        iconAnchor: [12, 24] // sets the icon position to the middle top (since the marker is a long shape)
    });
    L.marker([userLat, userLong], { icon: userLocIcon }).addTo(map).bindPopup("You are here!");

    // Add markers at all ports
    // Using Font Awesome icons w/ Bootstrap styling for markers
    const portIcon = L.divIcon({
        html: '<i class="fa-solid fa-anchor text-primary" style="font-size: 1.5rem;"></i>',
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 24] // sets the icon position to the middle top (since the anchor is also a long shape)
    });
    for (const port of ports) {
        L.marker([port.coordinates[0], port.coordinates[1]], { icon: portIcon }).addTo(map).bindPopup(() => {
            const disabledStartBtn = tripStarted ? "disabled" : "";
            const disabledAddStopBtn = tripStarted ? "" : "disabled";
            const disabledEndBtn = tripStarted ? "" : "disabled";

            return `
                <h5>${port.name}</h5>
                <div id="weather">Loading weather...</div>
                <button type="button" id="startTripBtn" class="btn btn-primary" ${disabledStartBtn}>Start Trip</button>
                <button type="button" id="addStopBtn" class="btn btn-primary" ${disabledAddStopBtn}>Add Stop</button>
                <button type="button" id="endTripBtn" class="btn btn-primary" ${disabledEndBtn}>End Trip</button>
            `;
        });
    }

    // Add event listeners to popup start and end trip buttons
    // have to add an event listener to detect when popups open first, because popups are added to the dom only when they are opened (i think)
    map.on("popupopen", (e) => {
        // ⭐ USE OF CONST VARIABLES
        const popup = e.popup.getElement();
        const markerLatlng = e.popup._latlng;
        const startTripBtn = $(popup).find("#startTripBtn");
        const addStopBtn = $(popup).find("#addStopBtn");
        const endTripBtn = $(popup).find("#endTripBtn");

        // Async IIFE from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function#async_iife
        // Add weather data to popup
        (async () => {
            const weatherData = await getWeatherData(markerLatlng.lat, markerLatlng.lng);
            $(popup).find("#weather").html(`
                <div class="d-flex">
                    <div id="weatherLeft"><img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png"></div>
                    <div id"weatherRight" class="d-flex flex-column justify-content-center align-items-center">
                        ${weatherData.main.temp} &deg;C 
                        <br>
                        ${weatherData.weather[0].main}
                    </div>
                </div>
                `);
        })();

        startTripBtn.on("click", () => {
            // empty cart
            cartTotal = 0;
            numberOfCartItems = 0;

            // ⭐ USE OF JQUERY DOM MANIPULATION
            $("#cartItems").html("");
            $("#emptyCart").html("Empty cart");
            $("#cartTotal").html(`<b>Total: </b> $0.00`);

            $("#catalogContent").html("<h1>New trip in progress...</h1>"); // remove catalog
            $(".leaflet-marker-pane").find(".fa-ship").remove(); // remove boat
            latlngsForTrip = []; // empty array from previous trip
            if (tripPolyline) { tripPolyline.setLatLngs([]); } // reset polyline
            tripDistance = 0; // reset distance
            for (const stop of stops) { // remove stop markers
                stop.remove();
            }
            $("#distance").remove(); // remove distance displayed from previous trip (if it's there)
            $("#capableVessels").remove(); // remove list of capable vessels 
            tripStarted = true;
            startTripBtn.prop("disabled", true);
            addStopBtn.prop("disabled", false);
            endTripBtn.prop("disabled", false);
            latlngsForTrip.push(markerLatlng);
            tripPolyline = L.polyline(latlngsForTrip, { color: "red" }).addTo(map);
        });

        addStopBtn.on("click", () => {
            latlngsForTrip.push(markerLatlng);
            tripPolyline.setLatLngs(latlngsForTrip);
            tripDistance += map.distance(latlngsForTrip[latlngsForTrip.length - 2], latlngsForTrip[latlngsForTrip.length - 1]);
        });

        endTripBtn.on("click", () => {
            latlngsForTrip.push(markerLatlng);
            if (!(latlngsForTrip[0] === latlngsForTrip[latlngsForTrip.length - 1])) {
                tripStarted = false;
                startTripBtn.prop("disabled", false);
                addStopBtn.prop("disabled", true);
                endTripBtn.prop("disabled", true);
                tripPolyline.setLatLngs(latlngsForTrip);
                runBoatAnimation(latlngsForTrip, map);
                tripDistance += map.distance(latlngsForTrip[latlngsForTrip.length - 2], latlngsForTrip[latlngsForTrip.length - 1]);

                // load vessels capable of completing trip on page
                let capableVessels = [];
                const tripDistanceInMiles = tripDistance * 0.000621371;
                $("#currentTripDistance").html(`Current trip distance: ${tripDistanceInMiles.toFixed(2)} miles`);
                for (const vessel of vessels) {
                    const maxDistanceInMiles = vessel.max_travel_distance_nautical_miles;
                    if (maxDistanceInMiles == "Unlimited" || maxDistanceInMiles >= tripDistanceInMiles) {
                        capableVessels.push(vessel);
                    }
                }

                // determine if its raining at any of the trips markers
                // (i know joe said just to do start and stop points but that didn't make sense to me)
                // then reload the map with trip details
                let tripDetails = null;
                (async () => {
                    let raining = false;
                    for (const latlng of latlngsForTrip) {
                        const weatherData = await getWeatherData(latlng.lat, latlng.lng);
                        if (weatherData.weather[0].main === "Rain") {
                            raining = true;
                            break;
                        }
                    }
                    // ⭐ USE OF OBJECT (DECONSTRUCTED)
                    tripDetails = { tripDistance: tripDistanceInMiles, isRaining: raining };
                    loadBoatCatalog(capableVessels, tripDetails);
                })();
            }

        });
    });


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
    fetch('public/ocean.geojson')
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
            if (tripStarted) {
                latlngsForTrip.push(L.latLng(e.latlng.lat, e.latlng.lng));
                stops.push(L.marker([e.latlng.lat, e.latlng.lng]).addTo(map));
                tripPolyline.setLatLngs(latlngsForTrip);
                tripDistance += map.distance(latlngsForTrip[latlngsForTrip.length - 2], latlngsForTrip[latlngsForTrip.length - 1]);
            }
        } else {
            // a random thought:
            // update the map visuals so that there is only one boat icon on whatever port the trip is started at
            // the boat travels along the polyline of the trip
            // if that polyline happens to be across land... like from van to boston
            // turn the boat into a car before animating it...? this might be hard
        }
    });
}


// loads using bootstrap grid by default
function loadBoatCatalog(vessels, tripDetails) {
    let displayMode = null;

    const renderDisplayMode = (displayMode, vessels) => {
        switch (displayMode) {
            case "grid":
                displayVesselsAsGrid(vessels);
                break;
            case "row":
                displayVesselsAsRow(vessels);
                break;
            case "masonry":
                displayVesselsUsingMasonry(vessels);
                break;
            default:
                displayVesselsAsGrid(vessels);
                break;
        }
    }

    // ⭐  USE OF ARRAY
    // get unique boat types
    const boatTypes = [];
    for (const vessel of vessels) {
        let typeAdded = false;
        for (const boatType of boatTypes) {
            if (vessel.type === boatType) {
                typeAdded = true;
            }
        }

        if (!typeAdded) {
            boatTypes.push(vessel.type);
        }
    }



    (displayCatalogMenu = () => {
        const catalogMenu = $("#catalogMenu");
        catalogMenu.html("");

        const displayStyleDropdown = `
         <!--display style dropdown-->
        <div class="btn-group mb-3">
            <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                aria-expanded="false">
                Select Display Style
            </button>
            <ul class="dropdown-menu">
                <li><button id="gridBtn" class="dropdown-item" type="button">Grid</button></li>
                <li><button id="rowBtn" class="dropdown-item" type="button">Row</button></li>
                <li><button id="masonryBtn" class="dropdown-item" type="button">Masonry</button></li>
            </ul>
        </div>
        `;

        const sortByDropdown = `
            <div class="btn-group mb-3">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Sort By
                </button>
                <ul class="dropdown-menu">
                    <li><button id="fastestBtn" class="dropdown-item" type="button">Fastest</button></li>
                    <li><button id="slowestBtn" class="dropdown-item" type="button">Slowest</button></li>
                    <li><button id="lowestBtn" class="dropdown-item" type="button">Lowest</button></li>
                    <li><button id="highestBtn" class="dropdown-item" type="button">Highest</button></li>
                </ul>
            </div>`;


        let boatTypeDropdownBtnsHtml = ``;
        for (const boatType of boatTypes) {
            boatTypeDropdownBtnsHtml += `<li><button id="${boatType.replaceAll(" ", "")}Btn" class="dropdown-item" type="button">${boatType}</button></li>`;
        }

        const boatTypeDropdown = `
            <div class="btn-group mb-3">
                <button type="button" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    Choose Type
                </button>
                <ul class="dropdown-menu">
                    ${boatTypeDropdownBtnsHtml}
                    <li><button id="anyTypeBtn" class="dropdown-item" type="button">Any type</button></li>
                </ul>
            </div>
            `;

        catalogMenu.append(displayStyleDropdown);
        catalogMenu.append(sortByDropdown);
        catalogMenu.append(boatTypeDropdown);

    })();

    const catalogContent = $("#catalogContent");


    // ⭐ USE OF DECONSTRUCTION OF JSON DATA
    const displayVesselsAsGrid = (vessels) => {
        displayMode = "grid";
        catalogContent.html("");
        const row = `<div id="mainRow" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-5 g-2 g-lg-3"></div>`;
        catalogContent.append(row);
        for (const vessel of vessels) {
            const totalCrewCost = (vessel.crew_required * vessel.crew_cost_per_member).toFixed(2);
            const totalCostForDistance = (vessel.cost_per_nautical_mile * tripDetails.tripDistance).toFixed(2);
            const fuelSurcharge = (tripDetails.isRaining ? vessel.fuel_surcharge * 2 : vessel.fuel_surcharge).toFixed(2);
            // replace boating with custom imgs in json eventually
            const boatCard = `
            <div class="col">
                <div class="card">
                    <img src="${vessel.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title"><b>${vessel.name}</b></h5>
                    </div>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">
                            <h5>Ship Info</h5>
                            <b>Type: </b>${vessel.type} <br>
                            <b>Length: </b>${vessel.length_meters} meters <br>
                            <b>Speed: </b>${vessel.speed_knots} knots <br>
                            <b>Max travel distance: </b>${vessel.max_travel_distance_nautical_miles} nautical miles <br>
                            <b>Cost per mile: </b>$${vessel.cost_per_nautical_mile.toFixed(2)} <br>
                            <b>Fuel surcharge: </b> $${vessel.fuel_surcharge.toFixed(2)} <br>
                            <b>Suitable for rain?: </b> ${vessel.suitable_for_rain}
                        </li>
                        <li class="list-group-item">
                            <h5>Crew Info</h5>  
                            <b>Crew required:</b> ${vessel.crew_required} members <br>
                            <b>Cost per member:</b> $${vessel.crew_cost_per_member.toFixed(2)}/member
                        </li>
                        <li class="list-group-item">
                            <h5>Cost Breakdown</h5> 
                            <b>Base rate: </b>$${vessel.base_rental_rate.toFixed(2)} <br>
                            <b>Cost of crew: </b> $${totalCrewCost}<br>
                            <b>Cost per mile * current trip distance: </b> $${totalCostForDistance} <br>
                            <b>Total fuel surcharge (2x if raining): </b>$${fuelSurcharge} <br>
                            <b>Total cost of current trip: </b>$${calculateTotalCost(vessel, tripDetails).toFixed(2)}
                        </li>
                    </ul>
                    <div class="card-body">
                        <button type="button" id="${vessel.name.replaceAll(" ", "")}AddToCartBtn" class="btn btn-primary">Add to cart</button>
                    </div>
                </div>
            </div>
        `;
            catalogContent.find("#mainRow").append(boatCard);
        }
    };

    const displayVesselsAsRow = (vessels) => {
        displayMode = "row";
        catalogContent.html("");
        const row = `<div id="mainRow" class="row row-cols-1 g-2 g-lg-3"></div>`;
        catalogContent.append(row);
        for (const vessel of vessels) {
            const totalCrewCost = (vessel.crew_required * vessel.crew_cost_per_member).toFixed(2);
            const totalCostForDistance = (vessel.cost_per_nautical_mile * tripDetails.tripDistance).toFixed(2);
            const fuelSurcharge = (tripDetails.isRaining ? vessel.fuel_surcharge * 2 : vessel.fuel_surcharge).toFixed(2);
            // replace boatimg with custom imgs in json eventually
            const boatCard = `
            <div class="col">
                <div class="card">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="${vessel.image}" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title"><b>${vessel.name}</b></h5>
                            </div>
                           
                            <div class="accordion" id="${vessel.name.replaceAll(" ", "")}Accordion">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${vessel.name.replaceAll(" ", "")}CollapseOne" aria-expanded="false" aria-controls="${vessel.name.replaceAll(" ", "")}CollapseOne">
                                            Ship Info
                                        </button>
                                    </h2>
                                    <div id="${vessel.name.replaceAll(" ", "")}CollapseOne" class="accordion-collapse collapse">
                                        <div class="accordion-body">
                                            <b>Type: </b>${vessel.type} <br>
                                            <b>Length: </b>${vessel.length_meters} meters <br>
                                            <b>Speed: </b>${vessel.speed_knots} knots <br>
                                            <b>Max travel distance: </b>${vessel.max_travel_distance_nautical_miles} nautical miles <br>
                                            <b>Cost per mile: </b>$${vessel.cost_per_nautical_mile.toFixed(2)} <br>
                                            <b>Fuel surcharge: </b> $${vessel.fuel_surcharge.toFixed(2)} <br>
                                            <b>Suitable for rain?: </b> ${vessel.suitable_for_rain}
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${vessel.name.replaceAll(" ", "")}CollapseTwo" aria-expanded="false" aria-controls="${vessel.name.replaceAll(" ", "")}CollapseTwo">
                                        Crew Info
                                    </button>
                                    </h2>
                                    <div id="${vessel.name.replaceAll(" ", "")}CollapseTwo" class="accordion-collapse collapse">
                                    <div class="accordion-body">
                                        <b>Crew required:</b> ${vessel.crew_required} members <br>
                                        <b>Cost per member:</b> $${vessel.crew_cost_per_member.toFixed(2)}/member
                                    </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${vessel.name.replaceAll(" ", "")}CollapseThree" aria-expanded="false" aria-controls="${vessel.name.replaceAll(" ", "")}CollapseThree">
                                        Cost Breakdown
                                    </button>
                                    </h2>
                                    <div id="${vessel.name.replaceAll(" ", "")}CollapseThree" class="accordion-collapse collapse">
                                    <div class="accordion-body">
                                        <b>Base rate: </b>$${vessel.base_rental_rate.toFixed(2)} <br>
                                        <b>Cost of crew: </b> $${totalCrewCost}<br>
                                        <b>Cost per mile * current trip distance: </b> $${totalCostForDistance} <br>
                                        <b>Total fuel surcharge (2x if raining): </b>$${fuelSurcharge} <br>
                                        <b>Total cost of current trip: </b>$${calculateTotalCost(vessel, tripDetails).toFixed(2)}
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <button type="button" id="${vessel.name.replaceAll(" ", "")}AddToCartBtn" class="btn btn-primary">Add to cart</button>
                            </div>
                        </div>
                    </div>    
                </div>
            </div>
        `;
            catalogContent.find("#mainRow").append(boatCard);
        }
    };

    const displayVesselsUsingMasonry = (vessels) => {


        displayMode = "masonry";
        catalogContent.html("");
        const row = `<div id="mainRow" class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-4 row-cols-xxl-5 g-2 g-lg-3" data-masonry='{"percentPosition": true }'></div>`;
        catalogContent.append(row);
        for (const vessel of vessels) {
            const totalCrewCost = (vessel.crew_required * vessel.crew_cost_per_member).toFixed(2);
            const totalCostForDistance = (vessel.cost_per_nautical_mile * tripDetails.tripDistance).toFixed(2);
            const fuelSurcharge = (tripDetails.isRaining ? vessel.fuel_surcharge * 2 : vessel.fuel_surcharge).toFixed(2);

            // replace boatimg with custom imgs in json eventually
            const boatCard = `
            <div class="col">
                <div class="card">
                            <img src="${vessel.image}" class="img-fluid rounded-start" alt="...">
                            <div class="card-body">
                                <h5 class="card-title"><b>${vessel.name}</b></h5>
                            </div>
                           
                            <div class="accordion" id="${vessel.name.replaceAll(" ", "")}Accordion">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${vessel.name.replaceAll(" ", "")}CollapseOne" aria-expanded="false" aria-controls="${vessel.name.replaceAll(" ", "")}CollapseOne">
                                            Ship Info
                                        </button>
                                    </h2>
                                    <div id="${vessel.name.replaceAll(" ", "")}CollapseOne" class="accordion-collapse collapse">
                                        <div class="accordion-body">
                                            <b>Type: </b>${vessel.type} <br>
                                            <b>Length: </b>${vessel.length_meters} meters <br>
                                            <b>Speed: </b>${vessel.speed_knots} knots <br>
                                            <b>Max travel distance: </b>${vessel.max_travel_distance_nautical_miles} nautical miles <br>
                                            <b>Cost per mile: </b>$${vessel.cost_per_nautical_mile.toFixed(2)} <br>
                                            <b>Fuel surcharge: </b> $${vessel.fuel_surcharge.toFixed(2)} <br>
                                            <b>Suitable for rain?: </b> ${vessel.suitable_for_rain}
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${vessel.name.replaceAll(" ", "")}CollapseTwo" aria-expanded="false" aria-controls="${vessel.name.replaceAll(" ", "")}CollapseTwo">
                                        Crew Info
                                    </button>
                                    </h2>
                                    <div id="${vessel.name.replaceAll(" ", "")}CollapseTwo" class="accordion-collapse collapse">
                                    <div class="accordion-body">
                                        <b>Crew required:</b> ${vessel.crew_required} members <br>
                                        <b>Cost per member:</b> $${vessel.crew_cost_per_member.toFixed(2)}/member
                                    </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${vessel.name.replaceAll(" ", "")}CollapseThree" aria-expanded="false" aria-controls="${vessel.name.replaceAll(" ", "")}CollapseThree">
                                        Cost Breakdown
                                    </button>
                                    </h2>
                                    <div id="${vessel.name.replaceAll(" ", "")}CollapseThree" class="accordion-collapse collapse">
                                    <div class="accordion-body">
                                        <b>Base rate: </b>$${vessel.base_rental_rate.toFixed(2)} <br>
                                        <b>Cost of crew: </b> $${totalCrewCost}<br>
                                        <b>Cost per mile * current trip distance: </b> $${totalCostForDistance} <br>
                                        <b>Total fuel surcharge (2x if raining): </b>$${fuelSurcharge} <br>
                                        <b>Total cost of current trip: </b>$${calculateTotalCost(vessel, tripDetails).toFixed(2)}
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card-body">
                                <button type="button" id="${vessel.name.replaceAll(" ", "")}AddToCartBtn" class="btn btn-primary">Add to cart</button>
                            </div>
                </div>
            </div>
        `;
            catalogContent.find("#mainRow").append(boatCard);
        }
    };

    // all sorting operations for now will by default use grid??? // idk how to deal with the multiple display types and sorting rn
    // oh i just figure it out
    // ill keep track of the state of the display update it in the on clicks
    // and then use it to determine which display method to use?
    // still trying to figure out how the displays and the sort will work together
    // since we will want to be able to do every sort on each display type
    // OOOOOO WE HAVE TO SORT THE VESSELS ARRAY THEN CALL THE DISPLAY FUNCTIONS DUHHHH

    let sortedVessels = vessels;

    const sortByFastest = () => {
        sortedVessels.sort((a, b) => b.speed_knots - a.speed_knots);
        renderDisplayMode(displayMode, sortedVessels);
    };

    const sortBySlowest = () => {
        sortedVessels.sort((a, b) => a.speed_knots - b.speed_knots);
        renderDisplayMode(displayMode, sortedVessels);
    };

    const sortByLowest = () => {
        // I'm so sorry this is disgusting and I am lazy
        sortedVessels.sort((a, b) => (calculateTotalCost(a, tripDetails)) - (calculateTotalCost(b, tripDetails)));
        renderDisplayMode(displayMode, sortedVessels);
    };

    const sortByHighest = () => {
        sortedVessels.sort((a, b) => (calculateTotalCost(b, tripDetails)) - (calculateTotalCost(a, tripDetails)));
        renderDisplayMode(displayMode, sortedVessels);
    };

    const sortByType = (type) => {
        // vessels with matching type in new arr
        // redisplay those vessels

        sortedVessels = [];
        // ⭐ USE OF LOOP
        for (const vessel of vessels) {
            // ⭐ USE OF CONDITIONAL 
            if (vessel.type == type) {
                sortedVessels.push(vessel);
            }
        }

        renderDisplayMode(displayMode, sortedVessels);
    };

    const sortByAnyType = () => {
        sortedVessels = vessels;

        renderDisplayMode(displayMode, sortedVessels);
    };

    // default calls
    displayVesselsAsGrid(vessels);

    $("#gridBtn").on("click", () => { displayVesselsAsGrid(sortedVessels); });
    $("#rowBtn").on("click", () => { displayVesselsAsRow(sortedVessels); });
    $("#masonryBtn").on("click", () => { displayVesselsUsingMasonry(sortedVessels); });

    $("#fastestBtn").on("click", sortByFastest);
    $("#slowestBtn").on("click", sortBySlowest);

    $("#lowestBtn").on("click", sortByLowest);
    $("#highestBtn").on("click", sortByHighest);

    $("#anyTypeBtn").on("click", sortByAnyType);
    for (const boatType of boatTypes) {
        $("#" + boatType.replaceAll(" ", "") + "Btn").on("click", () => { sortByType(boatType) });
    }

    // event listeners for add to cart btns
    // generate html for each item added to cart
    let vesselsInCart = [];
    localStorage.setItem("tripDetails", JSON.stringify(tripDetails));

    for (const vessel of vessels) {
        $("#" + vessel.name.replaceAll(" ", "") + "AddToCartBtn").on("click", () => {
            // can only add each boat once
            // just inverted my removal logic below and it works lol
            const indexToFind = vesselsInCart.findIndex(v => v.vessel.name === vessel.name);
            if (indexToFind === -1) {
                $("#emptyCart").html("");
                $("#cartItems").append(`
                    <li id="${vessel.name.replaceAll(" ", "")}CartItem" class="list-group-item">
                        <div class="d-flex justify-content-between">
                            <p>Boat: ${vessel.name}<br><b>Cost:</b> $${calculateTotalCost(vessel, tripDetails).toFixed(2)}</p>
                            <button id="${vessel.name.replaceAll(" ", "")}RemoveFromCart" class="btn" type="button"><i class="fa-solid fa-x"></i></button>
                        </div>
                    </li>
                    `);
                cartTotal += calculateTotalCost(vessel, tripDetails);
                $("#cartTotal").html(`<b>Total: </b>$${cartTotal.toFixed(2)}`);

                numberOfCartItems++;
                vesselsInCart.push({ vessel: vessel });

                localStorage.setItem("cartTotal", cartTotal);
                localStorage.setItem("numberOfCartItems", numberOfCartItems);
                localStorage.setItem("vesselsInCart", JSON.stringify(vesselsInCart));

                // remove item from cart
                $(`#${vessel.name.replaceAll(" ", "")}RemoveFromCart`).on("click", () => {
                    $(`#${vessel.name.replaceAll(" ", "")}CartItem`).remove();
                    cartTotal -= calculateTotalCost(vessel, tripDetails);
                    $("#cartTotal").html(`<b>Total: </b>$${cartTotal.toFixed(2)}`);
                    numberOfCartItems--;

                    // find and remove the vessel from the vesselsInCart array
                    // i think this works
                    // idk i dont have time to test anymore
                    const indexToRemove = vesselsInCart.findIndex(v => v.vessel.name === vessel.name);
                    if (indexToRemove !== -1) {
                        vesselsInCart.splice(indexToRemove, 1);
                    }

                    localStorage.setItem("cartTotal", cartTotal);
                    localStorage.setItem("numberOfCartItems", numberOfCartItems);
                    localStorage.setItem("vesselsInCart", JSON.stringify(vesselsInCart));

                    if (numberOfCartItems === 0) {
                        $("#emptyCart").html("Empty cart");
                    }
                });
            }
        });
    }
}

(async () => {
    await loadMap();
})();
