/* eslint-disable */


$(() => {
  window.propertyListing = {};

  function createListing(property, isReservation, needReservationForm) {
    return `
    <article class="property-listing">
        <section class="property-listing__preview-image">
          <img src="${property.thumbnail_photo_url}" alt="house">
        </section>
        <section class="property-listing__details">
          <h3 class="property-listing__title">${property.title}</h3>
          <ul class="property-listing__details">
            <li>number_of_bedrooms: ${property.number_of_bedrooms}</li>
            <li>number_of_bathrooms: ${property.number_of_bathrooms}</li>
            <li>parking_spaces: ${property.parking_spaces}</li>
          </ul>
          ${isReservation ?
            `<p>${moment(property.start_date).format('ll')} - ${moment(property.end_date).format('ll')}</p>`
            : ``}
          <footer class="property-listing__footer">
            <div class="property-listing__rating">${Math.round(property.average_rating * 100) / 100}/5 stars</div>
            <div class="property-listing__price">
              $${property.cost_per_night/100.0}/night
            </div>
            ${needReservationForm ?
              `
              <div class="property-listing__reservation">
                <form
                name="${property.id}-reservation-form"
                class="property-listing__reservation__form" method="post" action="/api/reservations">
                  <label for="start">Start date:</label>

                  <input type="date" id="start" name="start_date" value="2023-01-01" min="2023-01-01" required>
                 <label for="start">End date:</label>

                  <input type="date" id="start" name="end_date" value="2023-01-01" min="2023-01-01" required>
                  <button type="submit">Make Reservation</button>
                </form>
              </div>
              `

              : ``}

          </footer>
        </section>
      </article>
    `
  }

  window.propertyListing.createListing = createListing;

});
