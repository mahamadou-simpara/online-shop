const addOrder = document.getElementById("add-order");
const productNameEl = document.getElementById("product_name");
const productPriceEl = document.getElementById("product_price");
const productIdEl = document.getElementById("product-id");

async function postOrder(e) {
  e.preventDefault();

  const item = {
    name: productNameEl.value,
    price: productPriceEl.value,
    id: productIdEl.value,
    date: new Date(),
    quantity: 1,
  };

  console.log("Okay!");

  const getFetch = fetchItems();

  const items = await getFetch;

  const existingProductCheck = items.some(item => item.id === productIdEl.value);

console.log('Ok');

if (existingProductCheck) {
  console.log('Product exists!');
  return;
} else {
  console.log(items);
}




  try {
    const order = await fetch("/order", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
  const data = await response.json();

  // location.reload();
  if (data.success) {
    // Update the cart length element
    cartLengthEl.textContent = data.cartLength;
    console.log("Order added successfully!");
  };


}

async function fetchItems() {
  const reponse = await fetch("/get-item");

  const order = await reponse.json();
  return order;
};



addOrder.addEventListener("click", postOrder);
