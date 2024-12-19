Project Documentation: 
E-commerce Chatbot with Login and Search Features

1. Project Overview

This project is a simple e-commerce chatbot that enhances the user shopping experience by allowing users to search for products, interact via chat, and manage user authentication (login/logout). The chatbot interface is intuitive, featuring a conversation reset button, session tracking with timestamps, and chat history storage.

The backend handles product queries and login validation, while the frontend is responsive and user-friendly, offering a seamless interaction for both desktop and mobile users.

2. Features

Frontend
	1.	Login Functionality
	•	Secure user login with email and password.
	•	Displays appropriate error messages for invalid credentials.
	•	Maintains the user session using localStorage.
	2.	Chatbot Interface
	•	Allows users to ask queries about products(under development).
	•	Displays search results with product details.
	•	Features a conversation reset button to clear chat history.
	•	Tracks session timestamps for chat messages.
	3.	Product Display
	•	Shows a list of products based on the search query.
	•	Includes “Buy Now” functionality for a mock purchase.
	4.	Responsive Design
	•	Compatible with desktops, tablets, and mobile devices.

Backend
	1.	Authentication
	•	User registration and login functionality with password hashing using bcrypt.
	•	Token-based session management (mock token stored in localStorage).
	2.	Product Search
	•	Searches a database of products based on user input and returns matching results.
	•	Fetches product details by product ID.
	3.	Session and Chat Management
	•	Maintains chat history with session timestamps for later analysis.(currently not functioning)
	4.	Database
	•	Uses SQLite for storing user data (email, password, token).
	•	Fetches product data from a products.json file.

3. Project Structure

chatbot/
├── public/
│   ├── index.html         # Main HTML file
│   ├── styles.css         # CSS for styling the application
│   ├── script.js          # Frontend JavaScript logic
├── products.json          # Mock product inventory with 100 entries
├── server.js              # Node.js server logic
├── database.db            # SQLite database file for storing user credentials
├── database.js            # Database connection and setup logic
└── package.json           # Node.js dependencies

1. Installation and Setup

Prerequisites
	•	Node.js (v14+)
	•	SQLite installed on your system.

Step 1: Clone the Repository

git clone <repository-url>
cd ecommerce-chatbot

Step 2: Install Dependencies

npm install

Step 3: Set Up the Database
	1.	Ensure database.db exists in the root directory.
	2.	Use the following schema for the users table:

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  token TEXT
);

Step 4: Run the Server

Start the server using:

node server.js

The server will run at http://localhost:3000.

5. Usage

Frontend
	1.	Open http://localhost:3000 in your browser.
	2.	Login:
	•	Enter your email and password to log in.
	•	On successful login, the chatbot interface will be displayed.
	3.	Chatbot Interaction:
	•	Enter queries in the chatbox to search for products.
	•	View results in the product list below the chat.
	4.	Reset Conversation:
	•	Click the “Reset Conversation” button to clear chat history.
	5.	Logout:
	•	Click the “Logout” button to end the session and return to the login page.

Backend
	1.	Login Endpoint
	•	URL: POST /api/login
	•	Request Body: { "email": "nikhil@123.com", "password": "123" }
	•	Response: { "token": "sample-token-123" }
	2.	Product Search Endpoint
	•	URL: GET /api/products?search=product_name
	•	Response: A list of matching products.
	3.	Product Details Endpoint
	•	URL: GET /api/products/:id
	•	Response: Product details for the given id.

6. How to View the Database

Using SQLite Command Line
	1.	Open the terminal and navigate to the project directory:

sqlite3 database.db


	2.	Use SQL commands to view tables:

.tables
SELECT * FROM users;



Using GUI Tools
	•	Use DB Browser for SQLite or SQLiteStudio to open and inspect the database.db file.

7. Key Files

Frontend
	•	index.html: Contains the structure of the chatbot and login interface.
	•	styles.css: Defines the styling for the application.
	•	script.js: Handles all client-side logic, including login, chat interactions, and resetting the conversation.

Backend
	•	server.js: Implements server-side logic, including API routes for login, product search, and chat handling.
	•	products.json: Contains a mock database of 100 products for search functionality.
	•	database.js: Manages SQLite database connections.

8. Features for Analysis
	1.	Chat Storage: All chat interactions are stored in the frontend (for display) and can be saved to a database for later retrieval.
	2.	Session Tracking: Timestamps are added to chat messages for better session tracking.

9. Future Enhancements
	•	Integrate a full-fledged token-based authentication system using JWT.
	•	Add user registration functionality.
	•	Store chat history in the database for long-term analysis.
	•	Expand chatbot capabilities with AI-based natural language processing (NLP).
	•	Implement real-time updates using WebSockets for better interactivity.

10. Example Data

Sample Product (from products.json):

{
  "id": 1,
  "name": "Wireless Mouse",
  "description": "A high-precision wireless mouse.",
  "price": 25.99
}
