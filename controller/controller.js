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
  if (company && Array.isArray(company)) { 
    primaryQuery.company = { $in: company };
  }

  if(featured) {
    primaryQuery.featured = featured === 'true' ? true : false
 }
  
 // price and rating filters
 let numericQuery = {};
 if (numericFilters) {
  // replace symbols for db request
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

    // create parameter array
    filters = filters.split(',').map((item) => {
      const [field, operator, value] = item.split('-');
      console.log(field + "/" + operator + "/" + value)
      if (options.includes(field)) {
        return {
          'field' : field,
          'operator' : operator,
          'value' : Number(value)
        };
      }
    });
  
    // join array into one filter
    filters.forEach((element) => {
      const { field, operator, value } = element;
      if (field == 'price') {
        numericQuery[field] = {
          ...numericQuery[field], // Preserve existing operators
          [operator]: value,
        };
      } else if (field == 'rating') {
        numericQuery[field] = {
          ...numericQuery[field], // Preserve existing operators
          [operator]: value,
        };
      }
    });
  }

  // merge all filters
  const mergedQuery = {
    ...primaryQuery,
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



module.exports = {
  getAllProducts,
  getAllProductsStatic,
}