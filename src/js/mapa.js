
let map;
        let service;
        let infowindow;

        function initMap() {
            const taller = new google.maps.LatLng(
                39.33170482266272,
                -3.067695774527927,
            );

            infowindow = new google.maps.InfoWindow();
            map = new google.maps.Map(document.getElementById("map"), {
                center: taller,
                zoom: 19,
            });

            const request = {
                query: "Talleres marcelino albacete",
                fields: ["name", "formatted_address", "place_id", "geometry"],
            };

            service = new google.maps.places.PlacesService(map);
            service.findPlaceFromQuery(request, (results, status) => {
                if (
                    status === google.maps.places.PlacesServiceStatus.OK &&
                    results
                ) {
                    for (let i = 0; i < results.length; i++) {
                        createMarker(results[i]);
                    }

                    map.setCenter(results[0].geometry.location);
                }
            });
        }

        function createMarker(place) {
            if (!place.geometry || !place.geometry.location) return;

            const marker = new google.maps.Marker({
                map,
                position: place.geometry.location,
            });

            google.maps.event.addListener(marker, "click", () => {
                infowindow.setContent(place.name || "");
                infowindow.open(map);
            });
        }

        window.initMap = initMap;