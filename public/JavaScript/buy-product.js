const buyProductBtn = document.getElementById("buy-product-btn");

console.log(buyProductBtn);

async function buyProduct() {
  try {
    console.log("Attempting to buy product...");

    const userState = await fetchUserState();

    const alertEl = document.querySelector(".alert");

    if (userState.userState === "Guest") {
      alertEl.style.display = "block";
    } else if (userState.userState === "Customer") {
      alertEl.style.display = "none";
    };

    if(userState.userState === "Guest"){
      return;
    };

   

    await fetch("/buy", {
      method: "POST",
      body: JSON.stringify(userState),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Product purchase completed:", userState.userState);
  } catch (error) {
    console.error("Error buying product:", error);
  }
}

async function fetchUserState() {
  const reponse = await fetch("/get-user");

  const user = await reponse.json();
  return user;
}

buyProductBtn.addEventListener("click", buyProduct);
