const properties = require('./json/properties.json');
const users = require('./json/users.json');

const {Pool} = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const emailQuery = `
    SELECT *
    FROM users
    WHERE users.email = $1
  ;
  `;
  const sqlParams = [email];
  return pool.query(emailQuery, sqlParams)
    .then((res) => {
      const user = res.rows[0];
      return user;
    })
    .catch(() => null);

  // return Promise.resolve(user);
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {

  const idQuery = `
    SELECT *
    FROM users
    WHERE users.id = $1
    LIMIT 1
  ;
  `;
  const sqlParams = [id];
  return pool.query(idQuery, sqlParams)
    .then((res) => {
      const user = res.rows[0];
      return user;
    })
    .catch(() => null);



  // return Promise.resolve(users[id]);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  const addUserQuery = `
  INSERT INTO users (name, email, password) VALUES($1, $2, $3)
  RETURNING *
  ;
  `;
  const {name, email, password} = user;
  const sqlParams = [name, email, password];
  pool.query(addUserQuery, sqlParams)
    .then((res) => console.log(res.rows))
    .catch(err => console.error(err.message));
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {

  const allReservationQuery = `
    SELECT reservations.*, properties.*, AVG(rating) as average_rating
    FROM reservations

    JOIN properties
    ON reservations.property_id = properties.id
    JOIN property_reviews
    ON properties.id = property_reviews.property_id
    WHERE reservations.guest_id = $1
    GROUP BY reservations.id, properties.id
    ORDER BY start_date
    LIMIT $2
  ;
  `;
  const sqlParams = [guest_id, limit];

  return pool.query(allReservationQuery, sqlParams)
    .then(res => {
      console.log(res.rows);
      return res.rows;
    }).catch(err => {
      console.error(err.message);
    });

  // return getAllProperties(null, 2);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `And city iLIKE $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);

    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `
      GROUP BY properties.id
      HAVING AVG(rating) >= $${queryParams.length}

    `;
  } else {
    queryString += `
      GROUP BY properties.id
    `;
  }


  // 4
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5

  return pool.query(queryString, queryParams)
    .then((res)=>{
      return res.rows;
    })
    .catch(err => console.error('query error', err.stack));

};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {

  const sqlParams = Object.values(property);
  const dollarIndex = sqlParams.reduce((preV, curV, index) => {
    if (index === 0) {
      curV = `$${index + 1}`;
    } else {
      curV = `, $${index + 1}`;
    }
    preV += curV;
    return preV;
  }, '');
  const addPropertyQuery = `
  INSERT INTO properties (title, description, number_of_bedrooms, number_of_bathrooms, parking_spaces, cost_per_night, thumbnail_photo_url, cover_photo_url, street, country, city, province, post_code, owner_id) VALUES(${dollarIndex})
  RETURNING *
  ;
  `;
  console.log(addPropertyQuery);
  pool.query(addPropertyQuery, sqlParams)
    .then(res => console.log(res.rows))
    .catch(err => console.error(err.message));
  // const propertyId = Object.keys(properties).length + 1;
  // property.id = propertyId;
  // properties[propertyId] = property;
  // return Promise.resolve(property);
};
exports.addProperty = addProperty;
