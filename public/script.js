// Elements
const sendButton = document.getElementById('sendButton');
const userInput = document.getElementById('userInput');
const chatBox = document.getElementById('chatBox');
const productListDiv = document.getElementById('productList');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const authContainer = document.getElementById('authContainer');
const chatContainer = document.getElementById('chatContainer');
const resetButton = document.getElementById('resetButton'); // Conversation reset button

// Store interactions
let chatHistory = [];

// Check if the user is already logged in
if (localStorage.getItem('authToken')) {
  authContainer.style.display = 'none';
  chatContainer.style.display = 'block';
} else {
  authContainer.style.display = 'block';
  chatContainer.style.display = 'none';
}

// Event listener for the login form
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
  const input = userInput.value;
  
  // Timestamp for when the message is sent
  const timestamp = new Date().toLocaleString();

  // Add user message to the chat
  const userMessage = document.createElement('div');
  userMessage.classList.add('message');
  userMessage.classList.add('user');
  userMessage.innerHTML = `<strong>You:</strong> ${input} <small>(${timestamp})</small>`;
  chatBox.appendChild(userMessage);

  // Save to chat history
  chatHistory.push({ sender: 'user', message: input, timestamp });

  // Clear previous product list and bot messages
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
    botResponse.innerHTML = `<strong>Bot:</strong> Sorry, I couldn't find any products matching your query. <small>(${timestamp})</small>`;
    chatBox.appendChild(botResponse);

    // Save to chat history
    chatHistory.push({ sender: 'bot', message: "Sorry, I couldn't find any products matching your query.", timestamp });
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
  // Clear any existing products before adding new ones
  productListDiv.innerHTML = '';

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

    // Save product display to chat history (bot response)
    const timestamp = new Date().toLocaleString();
    chatHistory.push({ sender: 'bot', message: `Displaying product: ${product.name}`, timestamp });
  });
}

// Handle buying product (mock buy process)
function buyProduct(productId) {
  alert(`You selected product ID: ${productId}. (Mock buy process)`);
}

// Clear previous search results and bot messages
function clearPreviousSearchResults() {
  // Remove all previous user and bot messages
  chatBox.innerHTML = '';

  // Also clear any displayed products from the previous search
  productListDiv.innerHTML = ''; // Clear the product list
}

// Conversation Reset (clear chat history and start fresh)
resetButton.addEventListener('click', () => {
  chatBox.innerHTML = ''; // Clear chat
  productListDiv.innerHTML = ''; // Clear product list
  chatHistory = []; // Reset chat history

  // Optionally, we can clear the user input field as well
  userInput.value = '';
});