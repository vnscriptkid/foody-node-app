import AutoComplete from './modules/autocomplete';
import searchStores from './modules/typeahead';
import handleHeartSubmit from './modules/heart';
// import handleAddComment from './modules/addComment';

const mapSearchInput = document.getElementById('mapSearchInput');
const lngInput = document.getElementById('lngInput');
const latInput = document.getElementById('latInput');
const mapSearchDropdown = document.getElementById('mapSearchDropdown');
//
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addReviewForm = document.getElementById('addReviewForm');

// debugger;
global.handleHeartSubmit = handleHeartSubmit || function(){};

new AutoComplete(mapSearchInput, lngInput, latInput, mapSearchDropdown);
searchStores(searchInput);

// if (addReviewForm) {
//     console.log('Found addReviewForm!');
//     // addReviewForm.addEventListener('submit', handleSubmit);
//     addReviewForm.onsubmit = handleAddComment;
// }
