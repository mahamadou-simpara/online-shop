
const addOrder = document.getElementById('add-order');
const productNameEl = document.getElementById('product_name');
const productPriceEl = document.getElementById('product_price');
const productIdEl = document.getElementById('product-id');



async function postOrder(e) {
    e.preventDefault();
    

    const item = {
        name: productNameEl.value,
        price: productPriceEl.value,
        id: productIdEl.value,
        date: new Date(),
        quantity: 1
    }

    console.log('Okay!');
    const order = await fetch('/order', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            "Content-Type": "application/json"  
        },
    });

    const data = await response.json();
    
    // location.reload();
    if (data.success) {
        // Update the cart length element
        cartLengthEl.textContent = data.cartLength;
        console.log('Order added successfully!');
    }

};


function fetch(){

};

addOrder.addEventListener('click', postOrder)