// Array of quotes with text and category
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Success" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" }
];

let currentCategory = "All"; // Default: show all quotes

// Function to display a random quote
function showRandomQuote() {
  let filteredQuotes = currentCategory === "All" 
    ? quotes 
    : quotes.filter(q => q.category === currentCategory);

  if (filteredQuotes.length === 0) {
    document.getElementById("quoteDisplay").innerText = "No quotes available for this category.";
    return;
  }

  let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  document.getElementById("quoteDisplay").innerText = filteredQuotes[randomIndex].text;
}

// Function to add a new quote
function addQuote() {
  let text = document.getElementById("newQuoteText").value.trim();
  let category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });

    // Add category if it doesn't exist
    let categoryFilter = document.getElementById("categoryFilter");
    if (![...categoryFilter.options].some(opt => opt.value === category)) {
      let option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    }

    // Clear inputs
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    alert("New quote added!");
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Function to create category filter dynamically
function createCategoryFilter() {
  let container = document.createElement("div");
  let label = document.createElement("label");
  label.innerText = "Filter by Category: ";
  
  let select = document.createElement("select");
  select.id = "categoryFilter";

  // Add "All" option
  let allOption = document.createElement("option");
  allOption.value = "All";
  allOption.textContent = "All";
  select.appendChild(allOption);

  // Add unique categories from quotes
  let categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    let option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  // Listen for category changes
  select.addEventListener("change", function () {
    currentCategory = this.value;
    showRandomQuote();
  });

  container.appendChild(label);
  container.appendChild(select);
  document.body.insertBefore(container, document.getElementById("quoteDisplay"));
}

// Setup event listener for "Show New Quote"
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Create category filter on page load
createCategoryFilter();

// Show first quote automatically
showRandomQuote();
