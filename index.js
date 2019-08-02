var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json';
const BKINDEX = 0, CPINDEX = 1;
var newShipmentURL = {}
newShipmentURL[BKINDEX] = "https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/shipments";
newShipmentURL[CPINDEX] = "https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/shipments";

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port);

function compare2Rates(rate1, rate2){
  if(rate1.price < rate2.price){
    return [rate1, BKINDEX];
  }
  else if (rate2.price < rate1.price){
    return [rate2, CPINDEX];
  }
  else if (rate1.price == rate2.price){
    if(rate1.estimate_days < rate2.estimate_days){
      return [rate1, BKINDEX];
    }
    else if (rate2.estimate_days < rate1.estimate_days){
      return [rate2, CPINDEX];
    }
  }
}

function findBestRateInDays(rates){
  if (rates.length == 0){
    return undefined;
  }

  var bestLength = undefined;
  var minLength = Number.MAX_SAFE_INTEGER;

  rates.forEach(rate => {
    if (rate.estimate_days < minLength){
      minLength = rate.estimate_days;
      bestLength = rate;
    }
  });
  return bestLength;
}

function findBestRate(rates){
  var bestPrices = [];
  var minPrice = Number.MAX_SAFE_INTEGER;

  rates.forEach(rate => {
    if (rate.price < minPrice){
      minPrice = rate.price;
      bestPrices = [];
      bestPrices.push(rate);
    }
    else if (rate.price == minPrice){
      bestPrices.push(rate);
    }
  });
  
  return findBestRateInDays(bestPrices);
}

app.post('/getBestShippingRate',function(req,res){
    var address = req.body;
    const postalCode = address.postalCode;
    bkRates = axios.get('https://lo2frq9f4l.execute-api.us-east-1.amazonaws.com/prod/rates/'+postalCode)
    cpRates = axios.get('https://7ywg61mqp6.execute-api.us-east-1.amazonaws.com/prod/rates/'+postalCode)
    axios.all([
      bkRates,
      cpRates
    ]).then(axios.spread((bkRes, cpRes) => {
      bestRateAndIndex = compare2Rates(findBestRate(bkRes.data), findBestRate(cpRes.data))
      bestRate = bestRateAndIndex[0];
      bestRateIndex = bestRateAndIndex[1];
      
      console.log("Sending best rate back, here it is: ", bestRate);
      res.json(bestRate);

      console.log("Creating a shipment...")
      axios.post(newShipmentURL[bestRateIndex], {
        rate_id: bestRate.id,
        destination: address
      }).then(res =>{
        if (res.status === 200){
          console.log("Shipment confirmed, here it is:", res.data, "\n");
        }
        
      }).catch(error => {
        res.status(404).end();
      });

      res.end();
    })).catch(error => {
      console.log(error);
      res.status(404).end();
    });

    
});

console.log('server started on: ' + port);
