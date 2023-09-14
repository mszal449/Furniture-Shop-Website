const express = require('express')
const router = express.Router()

const {getAllProducts, getAllProductsStatic, getAllCompanyOptions} = require('../controller/controller')

router.route('/').get(getAllProducts)
router.route('/filters').get(getAllCompanyOptions)
router.route('/static').get(getAllProductsStatic)

module.exports = router