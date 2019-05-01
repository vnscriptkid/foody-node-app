import axios from 'axios';
import qs from 'qs';

class AutoComplete {
    constructor(addressInput, lngInput, latInput, mapSearchDropdown) {
        this.addressInput = addressInput;
        this.lngInput = lngInput;
        this.latInput = latInput;
        this.mapSearchDropdown = mapSearchDropdown;
        this.init();
    }

    init() {
        if (!this.addressInput || !this.lngInput || !this.latInput) {
            console.log('You need to provide addressInput, lngInput and latInput!');
            return;
        };
        this.addressInput.addEventListener('input', this.handleAddressInput.bind(this));
    }

    handleAddressInput(e) {
        const input = e.target.value;
        if (!input) {
            this.mapSearchDropdown.classList.remove('show');
            return;
        };
        axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json`, {
            params: {
                access_token: 'pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g',
                autocomplete: true,
                types: ['country', 'region', 'district', 'postcode', 'locality', 'place', 'neighborhood', 'address', 'poi'],
                limit: 5
            },
            paramsSerializer: function (params) {
                return qs.stringify(params, { arrayFormat: 'comma' })
            }
        })
            .then(res => {
                this.populateDropdown(res.data.features);
            })
            .catch(err => console.error(err));
    }

    populateDropdown(dataArr) {
        this.mapSearchDropdown.innerHTML = '';
        // this.mapSearchDropdown.className = `${dropdown.className} show`;
        this.mapSearchDropdown.classList.add('show');
        dataArr.forEach(place => {
            const { coordinates: coords } = place.geometry;
            const ele = document.createElement('div');
            ele.className = 'dropdown-item';
            ele.onclick = this.handlePlaceClick.bind(this);
            ele.setAttribute('data-lng', coords[0]);
            ele.setAttribute('data-lat', coords[1]);
            ele.innerText = place.place_name;
            this.mapSearchDropdown.appendChild(ele);
        })
    }

    handlePlaceClick(e) {
        // console.log(e.target);
        const ele = e.target;
        const lng = ele.getAttribute('data-lng');
        const lat = ele.getAttribute('data-lat');
        const address = ele.innerText;
        this.addressInput.value = address;
        this.populateCoords(lng, lat);
        this.mapSearchDropdown.classList.remove('show');
    }

    populateCoords(lng, lat) {
        this.latInput.value = lat;
        this.lngInput.value = lng;
    }
}


// function populateCoords(lng, lat) {
//     console.log('lng: ', lng);
//     console.log('lat: ', lat);
// }

// function handlePlaceClick(e) {
//     console.log(e.target);
//     const ele = e.target;
//     const lng = ele.getAttribute('data-lng');
//     const lat = ele.getAttribute('data-lat');
//     populateCoords(lng, lat);
// }

// global.handlePlaceClick = handlePlaceClick;

// function populateDropdown(dataArr) {
//     const dropdown = document.getElementById('mapSearchDropdown');
//     let html = '';
//     dataArr.forEach(place => {
//         const { coordinates: coords } = place.geometry;
//         html += `<div onclick="handlePlaceClick(event)" class="dropdown-item" data-lng="${coords[0]}" data-lat="${coords[1]}">${place.place_name}</div>`;
//     })
//     dropdown.innerHTML = html;
// }

// function handleAddressInput(e) {
//     const input = e.target.value;
//     // const input = 'ha noi';
//     axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${input}.json`, {
//         params: {
//             access_token: 'pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g',
//             autocomplete: true,
//             types: ['country', 'region', 'district', 'postcode', 'locality', 'place', 'neighborhood', 'address', 'poi'],
//             limit: 5
//         },
//         paramsSerializer: function (params) {
//             return qs.stringify(params, { arrayFormat: 'comma' })
//         }
//     })
//         .then(res => {
//             populateDropdown(res.data.features);
//         })
//         .catch(err => console.error(err));
// }

// function autoComplete(addressInput, lngInput, latInput) {
//     if (!addressInput || !lngInput || !latInput) return;

//     addressInput.addEventListener('input', handleAddressInput);

// }

export default AutoComplete;