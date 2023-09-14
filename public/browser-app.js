const nameInputDOM = document.querySelector('.filter-name')
const priceFromInputDOM = document.querySelector('.price-from')
const priceUpToInputDOM = document.querySelector('.price-up-to')
const companiesOptionsDOM = document.querySelector('.companies-options')
const applyFiltersDOM = document.querySelector('.apply-filters-btn')  
const resetFiltersDOM = document.querySelector('.reset-filters-btn')
const checkboxesDOM = document.querySelectorAll('.company-name-checkbox')
const productsDOM = document.querySelector('.products')                   
// To do: Loading text


// show products based on the filter
const ShowProducts = async (filter = {}) => {
  try {
    const response = await axios.get('api/v1/products', {params: filter});
    console.log(response); // Log the entire response to see its structure

    const {products} = response.data; // Assuming the products are in response.data

    console.log(products);

    if(products.length < 1) {
      return '<h5 class="empty-list" \ style="text-align: center">No products available</h5>'
    }
    const result = products.map((elem) => {
      const {name, price, rating, company} = elem
      return `<div class="product">
      <div>${name}</div>
      <div>${price}</div>
      <div>${rating}</div>
      <div>${company}</div>
  </div>`
    })

    productsDOM.innerHTML = result.join('')
    return
  } catch (error) {
    console.log(error)
  }
}

// generate company name filter options
const SetFilters = async () => {
  try {
    // get array of possible options
    let {data} = await axios.get('api/v1/products/filters')
    const options = data;

    // create html code
    if(data.length < 1) {
      companiesOptionsDOM.innerHTML =
      '<h5 class="empty-list" \ style="text-align: center">No filters available</h5>'
      return
    }
    else {
      data = data.map((name) => {
        return `<div class="comapny-option" style="display: flex; justify-content: center;">
        <a>${name}</a>
        <input type="checkbox" id="option-${name}" class="company-name-checkbox">
    </div>`
      })  
    }

    // show checkboxes
    companiesOptionsDOM.innerHTML = data.join('\n')
    // return options array
    return options

  } catch (error) {
    console.log(error)
    return
  }
}

const ReadFilters = () => {
  const nameVal = nameInputDOM.value;
  const priceFrom = priceFromInputDOM.value
  const priceUpTo = priceUpToInputDOM.value
  let priceResult = ""
  if(priceFrom != '') {
    priceResult += `price>=${priceFrom}`
  }
  if(priceUpTo != '' && priceResult != '') {
    priceResult += `,price<=${priceUpTo}`
  }
  else if(priceUpTo != '') {
    priceResult += `price<=${priceUpTo}`
  }

  const result = {
    name : nameVal,
    numericFilters : priceResult
  }

  return result
}

// reset filters
const ResetFilters = () => {
  nameInputDOM.value = ''
  priceFromInputDOM.value = ''
  priceUpToInputDOM.value = ''
}

// "Apply Filters" button event listener
applyFiltersDOM.addEventListener('click', () => {
  const filter = ReadFilters()
  console.log(filter)
  ShowProducts(filter)
})

// "Reset Filters" button event listener
resetFiltersDOM.addEventListener('click', () => {
  ResetFilters();
  ShowProducts()
})

// make price input boxes take only numbers
const SetUpPriceInput = () => {
  priceFromInputDOM.addEventListener("input", (event) => {
    const inputElement = event.target
    // replace non number elements with empty string
    inputElement.value = inputElement.value.replace(/[^0-9.]/g, '')

    // ensure that there's only one decimal point
    const decimalCount = (inputElement.value.match(/\./g) || []).length
    if (decimalCount > 1) {
      // if more than one decimal point, remove the extras
      inputElement.value = inputElement.value.replace(/\./g, '')
    }
  })

  priceUpToInputDOM.addEventListener("input", (event) => {
    const inputElement = event.target
    // replace non number elements with empty string
    inputElement.value = inputElement.value.replace(/[^0-9.]/g, '')

    // ensure that there's only one decimal point
    const decimalCount = (inputElement.value.match(/\./g) || []).length
    
    if (decimalCount > 1) {
      // if more than one decimal point, remove the extras
      inputElement.value = inputElement.value.replace(/\./g, '')
    }
  })
}

SetFilters()
SetUpPriceInput()
ShowProducts()

