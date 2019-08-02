# bkchallenge
Dev Challenge for BK 

## Install dependancies

To install dependancies, use:

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm start`

## Test it

Use [Postman](https://www.getpostman.com/) to send POST requests to [http://localhost:3000/getBestShippingRate](http://localhost:3000/getBestShippingRate)

Example of payload:
```
{
   "address_line_one": "4455 Boul. Poirier",
   "address_line_two": "201",
   "city": "Montréal",
   "province": "Québec",
   "postalCode": "H4R2A4",
   "country": "Canada"
}
```
You should see in the console:
```
server started on: 3000
Sending best rate back, here it is:  { id: '86c92042-990f-11e9-a2a3-2a2ae2dbcce4',
  description:
   'BoxKnight Next Day & Scheduled Delivery (Select a 3-hour the next day window at checkout)',
  price: 6.5,
  estimate_days: 2 }
Creating a shipment...
Shipment confirmed, here it is: { order_id: '737b5a04-9910-11e9-a2a3-2a2ae2dbcce4',
  rate_id: 'bd039d0a-990e-11e9-a2a3-2a2ae2dbcce4',
  destination:
   { address_line_one: '4455 Boul. Poirier',
     address_line_two: '201',
     city: 'Montréal',
     province: 'Québec',
     postalCode: 'H4R2A4',
     country: 'Canada' } }
```