/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

// TODO: If a new stock is added without a like, and that same stock is later liked,
// the first value in the array is always null. Not a big deal, but ugly.

const expect = require('chai').expect;
const MongoClient = require('mongodb').MongoClient;
const request = require('request');

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(function (req, res){
      if(Array.isArray(req.query.stock) && (req.query.stock).length > 2) {
        res.send("Uhh... I don't think so.");
      }
    
      /** One stock passed in */
      if(!Array.isArray(req.query.stock) ) {
        const requestedStock = req.query.stock;
        let stockData = {};

        request(`https://repeated-alpaca.glitch.me/v1/stock/${requestedStock}/quote`, (error, response, body) => {
          if(error) {
            console.log("ERROR: " + error);
          }
          
          if(typeof JSON.parse(body) === "string") {
            res.send("Sorry, that is not a real stock and/or is not in the database.")
          } else {
            MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
              (err, client) => {
              if(err) {
                console.log("error: " + err);
              }
              
              const collection = client.db("stock_price_checker").collection("stocks");
              
              collection.countDocuments({ stock: JSON.parse(body).symbol }).then(result => {
                // console.log("result: " + result);
                let likes = req.query.like ? 1 : 0;
                let clientIp = req.query.like ? req.ip : null;
                
                let newStock = {
                  stock: JSON.parse(body).symbol,
                  likes: likes,
                  clientIp: [clientIp]
                }
                
                if(result === 0) {
                  collection.insertOne(newStock)
                  
                  stockData = {
                    stock: JSON.parse(body).symbol,
                    price: JSON.parse(body).latestPrice,
                    likes: likes
                  }

                  res.send(stockData)
                  client.close();
                } else {
                  collection.countDocuments(
                    { $and: [
                      { stock: JSON.parse(body).symbol },
                      { likes: { $gt: 0 } },
                      { clientIp: { $in: [req.ip ]} }
                    ]})
                  .then(ipResult => {
                    // console.log("ipResult: " + ipResult);
                    if(ipResult !== 0 && req.query.like) {
                      res.send("You're not allowed to like the same stock twice, sorry.");
                      client.close();
                    } else if(req.query.like) {
                      collection.findOneAndUpdate(
                        { stock: JSON.parse(body).symbol },
                        { $inc: { likes: +1 },
                          $push: { clientIp:  req.ip }
                        },
                        { returnOriginal: false }, (err, document) => {
                          if(err) {
                            console.log("error while updating: " + err);
                          }
                          
                          let likes = document.value.likes;
                          stockData = {
                            stock: JSON.parse(body).symbol,
                            price: JSON.parse(body).latestPrice,
                            likes: likes
                          }

                          res.send(stockData)
                          client.close();
                        }
                      )
                    } else {
                      stockData = {
                        stock: JSON.parse(body).symbol,
                        price: JSON.parse(body).latestPrice,
                        likes: likes
                      }

                      res.send(stockData)
                      client.close();
                    }
                  })
                }
              })
            });
          }
        });
        
        /** Two stocks passed in */
      } else {
        let stockData = [];
        const requestedStockOne = req.query.stock[0];
        const requestedStockTwo = req.query.stock[1];
        
        request(`https://repeated-alpaca.glitch.me/v1/stock/${requestedStockOne}/quote`, (outerError, outerResponse, outerBody) => {
          if(outerError) {
            console.log("OUTERERROR: " + outerError);
          }
          
          if(typeof JSON.parse(outerBody) === "string") {
            res.send(`Sorry, ${requestedStockOne} is not a real stock and/or is not in the database.`)
          } else {
              MongoClient.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true },
                (err, client) => {
                if(err) {
                  console.log("error: " + err);
                }

                const collection = client.db("stock_price_checker").collection("stocks");

                collection.countDocuments({ stock: JSON.parse(outerBody).symbol }).then(outerResult => {
                  // console.log("outerResult: " + outerResult);
                  if(outerResult === 0) {
                    let likes = req.query.like ? 1 : 0;
                    let clientIp = req.query.like ? req.ip : null;

                    let newStockOne = {
                      stock: JSON.parse(outerBody).symbol,
                      likes: likes,
                      clientIp: [clientIp]
                    }

                    collection.insertOne(newStockOne)
                  }
                  
                  stockData.push({
                    stock: JSON.parse(outerBody).symbol,
                    price: JSON.parse(outerBody).latestPrice,
                    likes: 0
                  });

                  request(`https://repeated-alpaca.glitch.me/v1/stock/${requestedStockTwo}/quote`, (innerError, innerResponse, innerBody) => {
                    if(innerError) {
                      console.log("INNERERROR: " + innerError);
                    }

                    if(typeof JSON.parse(innerBody) === "string") {
                      res.send(`Sorry, ${requestedStockTwo} is not a real stock and/or is not in the database.`)
                    } else {
                      collection.countDocuments({ stock: JSON.parse(innerBody).symbol }).then(innerResult => {
                        // console.log("innerResult: " + innerResult);
                        if(innerResult === 0) {
                          let likes = req.query.like ? 1 : 0;
                          let clientIp = req.query.like ? req.ip : null;

                          let newStockTwo = {
                            stock: JSON.parse(innerBody).symbol,
                            likes: likes,
                            clientIp: [clientIp]
                          }

                          collection.insertOne(newStockTwo)
                        }
                        
                        collection.countDocuments(
                          { $or: [
                            { $and: [
                              { stock: JSON.parse(outerBody).symbol },
                              { likes: { $gt: 0 } },
                              { clientIp: { $in: [req.ip ]} }
                            ]},
                            { $and: [
                              { stock: JSON.parse(innerBody).symbol },
                              { likes: { $gt: 0 } },
                              { clientIp: { $in: [req.ip ]} }
                            ]}
                          ]}).then(ipResult => {
                          // console.log("ipResult: " + ipResult);
                          if(ipResult !== 0 && req.query.like) {
                            res.send("You're not allowed to like the same stock twice, sorry.");
                            client.close();
                          } else if(ipResult === 0 && req.query.like) {
                            collection.findOneAndUpdate(
                                { stock: JSON.parse(outerBody).symbol },
                                { $inc: { likes: +1 },
                                  $push: { clientIp:  req.ip } },
                                { returnOriginal: false }, (err, document) => {
                                  if(err) {
                                    console.log("error while updating: " + err);
                                  }

                                  let stockOneLikes = document.value.likes;
                                  stockData = [{
                                    stock: JSON.parse(outerBody).symbol,
                                    price: JSON.parse(outerBody).latestPrice,
                                    rel_likes: stockOneLikes
                                  }, {
                                    stock: JSON.parse(innerBody).symbol,
                                    price: JSON.parse(innerBody).latestPrice,
                                    rel_likes: stockOneLikes
                                  }]
                                }
                              )
                              
                              collection.findOneAndUpdate(
                                { stock: JSON.parse(innerBody).symbol },
                                { $inc: { likes: +1 },
                                  $push: { clientIp:  req.ip } },
                                { returnOriginal: false }, (err, document) => {
                                  if(err) {
                                    console.log("error while updating: " + err);
                                  }

                                  let stockTwoLikes = document.value.likes;
                                  
                                  stockData[0].rel_likes = stockData[0].rel_likes - stockTwoLikes;
                                  stockData[1].rel_likes = stockTwoLikes - stockData[1].rel_likes;
                                  
                                  res.send(stockData)
                                  client.close();
                                }
                              )
                            } else {
                              collection.findOne({ stock: JSON.parse(outerBody).symbol },
                                (err, document) => {
                                  if(err) {
                                    console.log("stock one error: " + err);
                                  }
                                
                                  let stockOneLikes = document.likes;
                                  stockData = [{
                                    stock: JSON.parse(outerBody).symbol,
                                    price: JSON.parse(outerBody).latestPrice,
                                    rel_likes: stockOneLikes
                                  }, {
                                    stock: JSON.parse(innerBody).symbol,
                                    price: JSON.parse(innerBody).latestPrice,
                                    rel_likes: stockOneLikes
                                  }]
                                }
                              )
                              
                              collection.findOne({ stock: JSON.parse(innerBody).symbol },
                                 (err, document) => {
                                  if(err) {
                                    console.log("stock two error: " + err);
                                  }

                                  let stockTwoLikes = document.likes;
                                  
                                  stockData[0].rel_likes = stockData[0].rel_likes - stockTwoLikes;
                                  stockData[1].rel_likes = stockTwoLikes - stockData[1].rel_likes;
                                  
                                  res.send(stockData)
                                  client.close();
                                }
                              )
                            }
                          });
                        });
                      }
                    });
                });
              });
            }
          })
        } 
  });
}