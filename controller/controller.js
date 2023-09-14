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

// get products based on request
const getAllProducts = async (req,res) => {
  const {
    name,
    featured,
    company,
    sort,
    fields,
    numericFilters
  } = req.query 
  
  // simple query filters
  const primaryQuery = {}
  if(name) {
    primaryQuery.name = {$regex : name, $options: 'i'}
  }
  if(company) {
    primaryQuery.company = company
  }
  if(featured) {
    primaryQuery.featured = featured === 'true' ? true : false
 }
  
 // price and rating filters
  const numericQuery = {price: {},rating : {}}
  if (numericFilters) {
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ['price', 'rating'];
    filters = filters.split(',').map((item) => {
      const [field, operator, value] = item.split('-');
      console.log(field + "/" + operator + "/" + value)
      if (options.includes(field)) {
        return {
          'field' : field,
          'operator' : operator,
          'value' : value
        };
      }
    });
  
    filters.forEach((element) => {
      const { field, operator, value } = element;
      if (field == 'price') {
        numericQuery.price[operator] = Number(value);
      } else if (field == 'rating') {
        numericQuery.rating[operator] = Number(value);
      }
    });
  }

  // merge all filters
  const mergedQuery = {
    ...queryObject,
    ...numericQuery
  }

  // get and sort results
  let result = Product.find(mergedQuery)
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

  // pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)
  products = await result
  res.status(200).json({products, nbHits: products.length})
}

// get company options to make matching filters available
const getAllCompanyOptions = async (req, res) => {
  try {
    const companyOptions = await Product.distinct('company')
    res.json(companyOptions)
  } catch (error) {
    console.log(error)
    
    res.status(500).json({error : 'Internal server error'})
  }
}

module.exports = {
  getAllProducts,
  getAllProductsStatic,
  getAllCompanyOptions
}