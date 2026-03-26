| №   | Endpoint | Description                                                         | Expected result |
| --- | -------- | ------------------------------------------------------------------- | --------------- |
| 1   | Get      | Check all productes for exists                                      | 200 success     |
| 2   | Post     | Create a new product with valid data.                               | 200 success     |
| 3   | Get      | Search for the created product by ID                                | 200 success     |
| 4   | Put      | Confirmed that data is changed on the server                        | 200 success     |
| 5   | Get      | Confirmed that date is actually changed                             | 200 success     |
| 6   | Delete   | Confirmed that product is deleted                                   | 204 success     |
| 7   | Get      | Confirmed that there is no product whith deleted ID in the database | 400             |
