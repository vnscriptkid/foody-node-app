const moment = require('moment');

exports.siteName = 'FoodStores';

// exports.produceMap = (lat, lng) => `https://maps.googleapis.com/maps/api/staticmap?center=40.714728,-73.998672&zoom=12&size=400x400&key=AIzaSyCwcQXW2ryukhw9eIWEnKEWA5TwWkYWWds`;

exports.produceMap = (lat, lng) => `https://www.google.com/maps/embed/v1/streetview
?key=${process.env.MAP_API_KEY}
&location=${lng, lat}
&heading=210
&pitch=10
&fov=35`;

exports.fromNow = (time) => moment(time, "YYYYMMDD").fromNow();