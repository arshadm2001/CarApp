console.log("CarApp initialized");

class CarApp {
    constructor() {
        console.log("CarApp initialized");
        this.map = null;
        this.currentPosition = null;
        this.placesService = null;
        this.init();
    }

    init() {
        console.log("Initializing CarApp...");
        this.loadGoogleMapsScript();
    }

    loadGoogleMapsScript() {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.defer = true;
        script.async = true;
        script.onload = () => this.initMap();
        document.head.appendChild(script);
    }

    initMap() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 0, lng: 0 },
            zoom: 15
        });
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.getCurrentLocation();
    }

    getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.map.setCenter(this.currentPosition);
                    this.addMarker(this.currentPosition, 'You are here');
                    this.findNearbyPlaces();
                },
                () => {
                    console.error('Error: The Geolocation service failed.');
                }
            );
        } else {
            console.error('Error: Your browser doesn\'t support geolocation.');
        }
    }

    addMarker(position, title) {
        new google.maps.Marker({
            position: position,
            map: this.map,
            title: title
        });
    }

    findNearbyPlaces() {
        const request = {
            location: this.currentPosition,
            radius: '500',
            type: ['store']
        };

        this.placesService.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    this.addMarker(results[i].geometry.location, results[i].name);
                }
            }
        });
    }
}

const app = new CarApp();