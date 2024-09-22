const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Sell = require('../models').Sell;
const Product = require('../models').Product;

const db = require('../models');
const moment = require('moment-timezone'); // Add moment-timezone


// Add Sell Route
router.post('/addSell', async (req, res) => {
  try {
    const sales = req.body;
    const salesData = [];

    // Fetch the timezone from the settings table
    const timezoneSetting = await db.Setting.findOne({ where: { key: 'timezone' } });
    const timezone = timezoneSetting ? timezoneSetting.value : 'UTC'; // Default to UTC if not found

    for (const sale of sales) {
      const { quantity, product_id } = sale;

      if (!product_id) {
        return res.status(400).json({ message: 'Product ID is required' });
      }

      // Fetch the product price from the database
      const product = await db.Product.findByPk(product_id);
      if (!product) {
        return res.status(400).json({ message: `Product with ID ${product_id} not found` });
      }

      // Calculate total price based on product price and quantity
      const totalPrice = product.productPrice * quantity;

      // Use the timezone from the settings table
      const sellDate = sale.date
        ? moment.tz(sale.date, timezone).toDate()
        : moment().tz(timezone).toDate();

      const newSell = await db.Sell.create({
        quantity,
        totalPrice,
        product_id,
        date: sellDate,
      });

      salesData.push(newSell);
    }

    res.status(201).json(salesData);
  } catch (error) {
    console.error('Error adding sell:', error);
    res.status(500).json({ message: 'Error adding sell', error: error.message });
  }
});




// Get total sells for the current day/week/month/year
router.get('/sells', async (req, res) => {
  const { date } = req.query;
  let dateFilter = {};
  const timezone = 'Asia/Dhaka'; // Adjust this to your local timezone

  if (date === 'today') {
    const today = moment.tz(timezone).startOf('day');  // Local start of the day
    const tomorrow = moment(today).add(1, 'day');      // Local end of the day

    dateFilter = {
      date: {
        [Op.gte]: today.toDate(),
        [Op.lt]: tomorrow.toDate(),
      },
    };
  } else if (date === 'yesterday') {
    const yesterday = moment.tz(timezone).subtract(1, 'day').startOf('day');
    const today = moment(yesterday).add(1, 'day');

    dateFilter = {
      date: {
        [Op.gte]: yesterday.toDate(),
        [Op.lt]: today.toDate(),
      },
    };
  } else if (date) {
    const selectedDate = moment.tz(date, timezone).startOf('day'); // Use local date
    const nextDay = moment(selectedDate).add(1, 'day');

    dateFilter = {
      date: {
        [Op.gte]: selectedDate.toDate(),
        [Op.lt]: nextDay.toDate(),
      },
    };
  }

  try {
    const sells = await Sell.findAll({
      where: dateFilter,
      include: {
        model: Product,
        attributes: ['productName', 'productPrice', 'productImage'], // Include product details with image
      },
    });

    res.status(200).json(sells);
  } catch (error) {
    console.error("Error fetching sells:", error);
    res.status(500).json({ message: 'Error fetching sells', error: error.message });
  }
});


// Fetch all sells with product details including productImage
router.get('/all-sells', async (req, res) => {
  try {
    const sells = await Sell.findAll({
      include: {
        model: Product,
        attributes: ['productName', 'productPrice', 'productImage'], // Include productImage
      },
    });

    res.status(200).json(sells);
  } catch (error) {
    console.error("Error fetching all sells:", error);
    res.status(500).json({ message: 'Error fetching sells', error: error.message });
  }
});


module.exports = router;
