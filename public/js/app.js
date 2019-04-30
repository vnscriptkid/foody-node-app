import autoComplete from './modules/autocomplete';
import searchStores from './modules/typeahead';
import handleHeartSubmit from './modules/heart';
import handleAddComment from './modules/addComment';

const addressInput = document.getElementById('storeAddrInput');
const lngInput = document.getElementById('lngInput');
const latInput = document.getElementById('latInput');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const addReviewForm = document.getElementById('addReviewForm');

// debugger;
global.handleHeartSubmit = handleHeartSubmit || function(){};

autoComplete(addressInput, lngInput, latInput);
searchStores(searchInput);

// if (addReviewForm) {
//     console.log('Found addReviewForm!');
//     // addReviewForm.addEventListener('submit', handleSubmit);
//     addReviewForm.onsubmit = handleAddComment;
// }
