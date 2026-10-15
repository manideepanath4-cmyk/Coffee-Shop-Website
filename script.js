const cart = [];
const cartButton = document.querySelector(".cart");
const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector(".cart-items");
const cartEmpty = document.querySelector(".cart-empty");
const cartTotal = document.querySelector(".cart-total");
const cartCount = document.querySelector(".cart-count");
const signupForm = document.querySelector(".signup");
const signupSuccess = document.querySelector(".signup-success");
const viewAllBeansButton = document.querySelector(".view");
const extraBeans = document.querySelectorAll(".extra-bean");

function formatPrice(price) {
	return `$${price.toFixed(2)}`;
}

function renderCart() {
	const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
	const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	cartCount.textContent = String(itemCount);
	cartTotal.textContent = formatPrice(total);
	cartEmpty.hidden = cart.length > 0;
	cartItems.replaceChildren();

	for (const item of cart) {
		const row = document.createElement("li");
		row.className = "cart-item";

		const details = document.createElement("div");
		const name = document.createElement("div");
		name.className = "cart-item-name";
		name.textContent = item.name;
		const price = document.createElement("div");
		price.className = "cart-item-price";
		price.textContent = `${formatPrice(item.price)} each`;
		details.append(name, price);

		const controls = document.createElement("div");
		controls.className = "cart-item-controls";
		const decrement = document.createElement("button");
		decrement.type = "button";
		decrement.textContent = "−";
		decrement.setAttribute("aria-label", `Remove one ${item.name}`);
		decrement.addEventListener("click", () => updateQuantity(item.name, -1));
		const quantity = document.createElement("span");
		quantity.textContent = String(item.quantity);
		const increment = document.createElement("button");
		increment.type = "button";
		increment.textContent = "+";
		increment.setAttribute("aria-label", `Add one ${item.name}`);
		increment.addEventListener("click", () => updateQuantity(item.name, 1));
		controls.append(decrement, quantity, increment);
		row.append(details, controls);
		cartItems.append(row);
	}
}

function updateQuantity(name, change) {
	const item = cart.find((entry) => entry.name === name);
	if (!item) return;

	item.quantity += change;
	if (item.quantity <= 0) {
		cart.splice(cart.indexOf(item), 1);
	}
	renderCart();
}

document.querySelectorAll(".card .add").forEach((button) => {
	button.addEventListener("click", () => {
		const card = button.closest(".card");
		const name = card.querySelector("h3").textContent.trim();
		const price = Number(card.querySelector(".price").textContent.replace("$", ""));
		const existingItem = cart.find((item) => item.name === name);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cart.push({ name, price, quantity: 1 });
		}
		renderCart();
	});
});

viewAllBeansButton.addEventListener("click", () => {
	const showingAllBeans = viewAllBeansButton.getAttribute("aria-expanded") === "true";
	viewAllBeansButton.setAttribute("aria-expanded", String(!showingAllBeans));
	extraBeans.forEach((card) => {
		card.hidden = showingAllBeans;
	});
	viewAllBeansButton.textContent = showingAllBeans ? "View all beans →" : "Show fewer beans ↑";
});

cartButton.addEventListener("click", () => cartDialog.showModal());
document.querySelector(".cart-close").addEventListener("click", () => cartDialog.close());
cartDialog.addEventListener("click", (event) => {
	if (event.target === cartDialog) cartDialog.close();
});

signupForm.addEventListener("submit", (event) => {
	event.preventDefault();
	if (!signupForm.reportValidity()) return;

	signupForm.hidden = true;
	signupSuccess.textContent = "Thank You For Joining Us!";
	signupSuccess.hidden = false;
});

renderCart();