/* eslint-disable */


$(() => {

  const $propertyListings = $(`
  <section class="property-listings" id="property-listings">
      <p>Loading...</p>
    </section>
  `);
  window.$propertyListings = $propertyListings;

  window.propertyListings = {};

  function addListing(listing) {
    $propertyListings.append(listing);
  }
  function clearListings() {
    $propertyListings.empty();
  }
  window.propertyListings.clearListings = clearListings;

  function addProperties(properties, isReservation = false, needReservationForm = false) {
    clearListings();
    for (const propertyId in properties) {
      const property = properties[propertyId];
      const listing = propertyListing.createListing(property, isReservation, needReservationForm);
      addListing(listing);
    }
  }
  window.propertyListings.addProperties = addProperties;

  $('.property-listing__reservation__form').on('submit', function (event) {
    event.preventDefault();
    console.log('reservation got clicked!');
    const data=$(this).serialize();
    newReservation(data)
      .then((json => {
        console.log(json);
        views_manager.show('listings');
      }))
      .catch(err => views_manager.shwo('error', 'Not valid date'))

  });
});
