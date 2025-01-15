export const currencySetter = (value) => {
  // Ensure the value is parsed as a number
  const number = parseFloat(value);

  // If the number is not valid, return ₹0 or handle gracefully
  if (isNaN(number) || number === 0) {
    return "₹0";
  }

  let theNewCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);

  let currencySymbol = theNewCurrency.substring(0, 1);
  let theAmount = theNewCurrency.substring(1);

  if (theAmount.endsWith(".00")) {
    theAmount = theAmount.slice(0, -3);
  }

  return `${currencySymbol} ${theAmount}`;
};

export const numberSetter = (number) => {
  let theNewCurrency = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
  // let currencySymbol = theNewCurrency.substring(0, 1);
  //   let theAmount = theNewCurrency.substring(1, theNewCurrency.length);
  let theAmount = theNewCurrency.substring(1);
  return `${theAmount}`;
};
