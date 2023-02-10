/* eslint-disable */


$(() => {
  getAllListings().then(function(json) {
    propertyListings.addProperties(json.properties, false, true);
    views_manager.show('listings');
  });
});
