'use strict';

const axios = require('axios');
const crypto = require('crypto'); // Để hash IP
const likes = {}; // Bộ nhớ tạm để lưu lượt like

module.exports = function (app) {
  app.route('/api/stock-prices')
    .get(async function (req, res) {
      const { stock, like } = req.query;
      const stocks = Array.isArray(stock) ? stock : [stock];
      
      try {
        // Fetch stock prices
        const stockData = await Promise.all(
          stocks.map(async (symbol) => {
            const response = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`);
            return {
              stock: symbol.toUpperCase(),
              price: response.data.latestPrice || "N/A",
            };
          })
        );

        // Process likes
        const userIP = crypto.createHash('sha256').update(req.ip).digest('hex'); // Hash IP
        stockData.forEach((stockObj) => {
          const { stock } = stockObj;
          if (like === 'true') {
            likes[stock] = likes[stock] || new Set();
            likes[stock].add(userIP);
          }
          stockObj.likes = likes[stock] ? likes[stock].size : 0;
        });

        if (stocks.length === 2) {
          res.json({
            stockData: [
              {
                stock: stockData[0].stock,
                price: stockData[0].price,
                rel_likes: stockData[0].likes - stockData[1].likes,
              },
              {
                stock: stockData[1].stock,
                price: stockData[1].price,
                rel_likes: stockData[1].likes - stockData[0].likes,
              },
            ],
          });
        } else {
          res.json({ stockData: stockData[0] });
        }
      } catch (err) {
        res.status(500).json({ error: 'Unable to fetch stock data' });
      }
    });
};
