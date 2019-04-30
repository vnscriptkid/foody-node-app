function autoComplete(addressInput, lngInput, latInput) {
    // if there's no addressInput found, exit the function
    if (!addressInput) return;
    // else
    const dropdown = new google.maps.places.Autocomplete(addressInput);

    dropdown.addListener('places_changed', function() {
        const place = dropdown.getPlace();
        if (!place) return;
        console.log('selected place: ', place);
    })
}

export default autoComplete;