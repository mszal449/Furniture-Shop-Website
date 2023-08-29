// controller

const { query } = require('express')
const Product = require('../model/product')
// static tesing route
const getAllProductsStatic = async (req,res) => {
  const search = 'a'
  const products = await Product.find({
    name : {$regex : search, $options : 'i'} 
  }).sort("name").limit(7)
  res.status(200).json({nbHits: products.length, products})
}

const getAllProducts = async (req,res) => {
  const {
    name,
    featured,
    company,
    sort,
    fields,
    numericFilters
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
  // numeric filters
  if (numericFilters) {
    const operatorMap = {
      '>' : '$gt',
      '>=' : '$gte',
      '=' : '$eq',
      '<' : '$lt',
      '<=' : '$lte',
    }
    const regEx = /\b(<|>|>=|<=|=)\b/g
    let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`)
    const options =['price','rating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')
      if(options.included(field)) {
        queryObject[field] = {[operator]:Number(value)}
      }
    });
  }

  // pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)
  products = await result
  res.status(200).json({products, nbHits: products.length})
}


module.exports = {
  getAllProducts,
  getAllProductsStatic
}