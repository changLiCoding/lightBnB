SELECT reservations.id as id, properties.title as title, cost_per_night, start_date, AVG(property_reviews.rating) as average_rating
FROM users
JOIN reservations
on users.id = reservations.guest_id
JOIN properties
ON reservations.property_id = properties.id
JOIN property_reviews
ON properties.id = property_reviews.property_id
WHERE users.id = 15
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10
;
