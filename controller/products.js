// controller

const { query } = require('express')
const Product = require('../model/product')
// static tesing route
const getAllProductsStatic = async (req,res) => {
  const search = 'a'
  const products = await Product.find({
    name : {$regex : search, $options : 'i'} 
  }).sort("name")
  res.status(200).json({ products, nbHits: products.length})
}

const getAllProducts = async (req,res) => {
  const {
    name,
    featured,
    company,
    sort,
    fields
  } = req.query 
  
  const queryObject = {}  // empty query object
  
  if(name) {
    queryObject.name = {$regex : name, $options: 'i'}
  }
  if(featured) {
    queryObject.featured = featured === 'true' ? true : false
  }
  if(company) {
    queryObject.company = company
  }
   
  console.log(queryObject)
  let result = Product.find(queryObject)
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  if (fields) {
    const fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }
  
  products = await result
  res.status(200).json({products, nbHits: products.length})
}


module.exports = {
  getAllProducts,
  getAllProductsStatic
}