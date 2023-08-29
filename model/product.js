// Product model
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
      type:String,
      required:[true, 'Product name must be provided']
    },
    price:{
      type:Number,
      required:[true, 'Price name must be provided']
    },
    featured:{
      type:Boolean,
      default: false
    },
    rating:{
      type:Number,
      default: 4.5
    },
    createdAt:{
      type:Date,
      default: Date.now()
    },
    Company:{
      type:String,
      enum:{
        values:['ikea','macros','caressa','liddy'],
        message: '{VALUE} is not supported'
      }
    },
})

module.exports = mongoose.model('Product', productSchema)