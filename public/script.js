// Elements
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const productListDiv = document.getElementById('productList');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const registerForm = document.getElementById('registerForm');
const registerEmail = document.getElementById('registerEmail');
const registerPassword = document.getElementById('registerPassword');
const registerError = document.getElementById('registerError');
const authContainer = document.getElementById('authContainer');
const chatContainer = document.getElementById('chatContainer');
const showRegisterFormBtn = document.getElementById('showRegisterForm');
const showLoginFormBtn = document.getElementById('showLoginForm');

// Check if the user is already logged in
if (localStorage.getItem('authToken')) {
  authContainer.style.display = 'none';
  chatContainer.style.display = 'block';
} else {
  authContainer.style.display = 'block';
  chatContainer.style.display = 'none';
}

// Event listener for login form
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  // Send login request
  const response = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    localStorage.setItem('authToken', data.token); // Store token in localStorage
    authContainer.style.display = 'none';
    chatContainer.style.display = 'block';
  } else {
    loginError.style.display = 'block';
    loginError.innerText = data.error;
  }
});

// Event listener for register form
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = registerEmail.value;
  const password = registerPassword.value;

  // Send registration request
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (response.ok) {
    // After successful registration, switch to the login form
    alert('Registration successful! You can now log in.');
    registerError.style.display = 'none';
    authContainer.style.display = 'block';
    document.getElementById('registerCard').style.display = 'none'; // Hide register form
    document.getElementById('loginCard').style.display = 'block'; // Show login form
  } else {
    registerError.style.display = 'block';
    registerError.innerText = data.error;
  }
});

// Switch to Register form
showRegisterFormBtn.addEventListener('click', () => {
  document.getElementById('loginCard').style.display = 'none';
  document.getElementById('registerCard').style.display = 'block';
});

// Switch to Login form
showLoginFormBtn.addEventListener('click', () => {
  document.getElementById('registerCard').style.display = 'none';
  document.getElementById('loginCard').style.display = 'block';
});

// Logout function
function logout() {
  localStorage.removeItem('authToken');
  authContainer.style.display = 'block';
  chatContainer.style.display = 'none';
}

// Event listener for sending messages
sendButton.addEventListener('click', handleChat);

// Handle chat interaction
async function handleChat() {
  const input = userInput.value.trim();

  // Check if the input is empty
  if (input === '') {
    alert('Chatbox is empty. Please enter a product search.');
    return; // Prevent further execution if input is empty
  }

  // Add user message to the chat
  const userMessage = document.createElement('div');
  userMessage.classList.add('message');
  userMessage.classList.add('user');
  userMessage.innerText = input;
  chatBox.appendChild(userMessage);

  // Clear the previous product list and bot messages (if any)
  clearPreviousSearchResults();

  // Query products from backend
  const products = await fetchProducts(input);
  if (products.length > 0) {
    displayProducts(products);
  } else {
    // If no products found, display the bot's message
    const botResponse = document.createElement('div');
    botResponse.classList.add('message');
    botResponse.classList.add('bot');
    botResponse.innerText = "Sorry, I couldn't find any products matching your query.";
    chatBox.appendChild(botResponse);
  }

  // Clear input
  userInput.value = '';
}

// Fetch products from the backend
async function fetchProducts(query) {
  const response = await fetch(`http://localhost:3000/api/products?search=${query}`);
  const products = await response.json();
  return products;
}

// Display products on the page
function displayProducts(products) {
  productListDiv.innerHTML = ''; // Clear any existing products
  products.forEach((product) => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');
    productDiv.innerHTML = `
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <p><strong>Price:</strong> $${product.price}</p>
      <button class="buyButton" onclick="buyProduct(${product.id})">Buy Now</button>
    `;
    productListDiv.appendChild(productDiv);
  });
}

// Handle buying product (mock buy process)
function buyProduct(productId) {
  alert(`You selected product ID: ${productId}. (Mock buy process)`);
}

// Clear previous search results and bot messages
function clearPreviousSearchResults() {
  // Remove all bot messages (including previous search results)
  const botMessages = chatBox.querySelectorAll('.bot-message');
  botMessages.forEach((message) => message.remove());

  // Also clear any displayed products from the previous search
  productListDiv.innerHTML = ''; // Clear the product list
}