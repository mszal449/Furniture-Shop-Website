// DOM of main website elements
const nameInputDOM = document.querySelector('.filter-name')
const priceFromInputDOM = document.querySelector('.price-from')
const priceUpToInputDOM = document.querySelector('.price-up-to')
const ratingFromInputDOM = document.querySelector('.rating-from')
const ratingUpToInputDOM = document.querySelector('.rating-up-to')
const companiesOptionsDOM = document.querySelector('.companies-options')
const applyFiltersDOM = document.querySelector('.apply-filters-btn')  
const resetFiltersDOM = document.querySelector('.reset-filters-btn')
const productsDOM = document.querySelector('.products')                   

// DOM of filter checkboxes
const ikeaOptionDOM = document.getElementById('ikea')
const liddyOptionDOM = document.getElementById('liddy')
const marcosOptionDOM = document.getElementById('marcos')
const caressaOptionDOM = document.getElementById('caressa')



// show products based on the filter
const ShowProducts = async (filter = {}) => {
  try {
    const response = await axios.get('api/v1/products', { params: filter })

    const { products } = response.data

    if (products.length < 1) {
      productsDOM.innerHTML = '<h5 class="empty-list">No products available</h5>'
      return
    }

    const result = products.map((elem) => {
      const { name, price, rating, company } = elem
      return `
        <div class="product-card">
          <div class="product-name">${name}</div>
          <div class="product-price">$${price.toFixed(2)}</div>
          <div class="product-rating">Rating: ${rating}/5</div>
          <div class="product-company">By: ${company}</div>
        </div>
      `
    })

    productsDOM.innerHTML = `<div class="product-list">${result.join('')}</div>`
  } catch (error) {
    console.log(error)
  }
}

// read filters
const ReadFilters = () => {
  // name filter
  const nameVal = nameInputDOM.value

  let companyFilter = []
  // company filter
  if(ikeaOptionDOM.checked){
    companyFilter.push('ikea')
  }
  if(liddyOptionDOM.checked){
    companyFilter.push('liddy')
  }
  if(marcosOptionDOM.checked){
    companyFilter.push('marcos')
  }
  if(caressaOptionDOM.checked){
    companyFilter.push('caressa')
  }

  // numeric filters
  const priceFrom = priceFromInputDOM.value
  const priceUpTo = priceUpToInputDOM.value
  const ratingFrom = ratingFromInputDOM.value
  const ratingUpTo = ratingUpToInputDOM.value
  let priceResult = ''
  let ratingResult = ''

  // create filter strings
  if(priceFrom != '') {
    priceResult += `price>=${priceFrom}`
  }
  if(priceUpTo != '' && priceResult != '') {
    priceResult += `,price<=${priceUpTo}`
  }
  else if(priceUpTo != '') {
    priceResult += `price<=${priceUpTo}`
  }

  if(ratingFrom != '') {
    ratingResult += `rating>=${ratingFrom}`
  }
  if(ratingUpTo != '' && ratingResult != '') {
    ratingResult += `,rating<=${ratingUpTo}`
  }
  else if(ratingUpTo != '') {
    ratingResult += `rating<=${ratingUpTo}`
  }
  let numericFiltersResult = {}

  // join filter strings
  if(priceResult != '' && ratingResult != '') {
    numericFiltersResult = `${priceResult},${ratingResult}`
  } else if (priceResult != ''){
    numericFiltersResult = priceResult
  } else if (ratingResult != ''){
    numericFiltersResult = ratingResult
  } 

  // create result filter
  const result = {
    name : nameVal,
    numericFilters : numericFiltersResult,
    company : companyFilter
  }

  return result
}

// reset filters
const ResetFilters = () => {
  // reset text input values
  nameInputDOM.value = ''
  priceFromInputDOM.value = ''
  priceUpToInputDOM.value = ''
  ratingFromInputDOM.value = ''
  ratingUpToInputDOM.value = ''

  // reset checkbox values
  ikeaOptionDOM.checked = false
  liddyOptionDOM.checked = false
  marcosOptionDOM.checked = false
  caressaOptionDOM.checked = false
}

// "Apply Filters" button event listener
applyFiltersDOM.addEventListener('click', () => {
  const filter = ReadFilters()
  ShowProducts(filter)
})

// "Reset Filters" button event listener
resetFiltersDOM.addEventListener('click', () => {
  ResetFilters()
  ShowProducts()
})

// make input fields accept only numeric values
const SetUpNumericInput = () => {
  const priceFromInputDOM = document.querySelector('.price-from')
  const priceUpToInputDOM = document.querySelector('.price-up-to')
  const ratingFromInputDOM = document.querySelector('.rating-from')
  const ratingUpToInputDOM = document.querySelector('.rating-up-to')

  const setInputFilter = (textbox, inputFilter) => {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
      textbox.addEventListener(event, function () {
        if (inputFilter(this.value)) {
          this.oldValue = this.value
          this.oldSelectionStart = this.selectionStart
          this.oldSelectionEnd = this.selectionEnd
        } else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
          this.value = this.oldValue
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd)
        } else {
          this.value = ""
        }
      })
    })

    // Add a focusout event listener to clear the input value if it's empty when the input field loses focus
    textbox.addEventListener("focusout", function () {
      if (this.value === "") {
        this.oldValue = ""
      }
    })
  }

  const priceFilter = function (value) {
    return /^-?\d*[.]?\d{0,2}$/.test(value)
  }

  const ratingFilter = function (value) {
    return /^[0-5]*$/.test(value)
  }

  setInputFilter(priceFromInputDOM, priceFilter)
  setInputFilter(priceUpToInputDOM, priceFilter)
  setInputFilter(ratingFromInputDOM, ratingFilter)
  setInputFilter(ratingUpToInputDOM, ratingFilter)
}


SetUpNumericInput()
ShowProducts()

