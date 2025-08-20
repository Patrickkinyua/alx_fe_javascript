

// ==========================
// QUOTES WITH STORAGE & SYNC
// ==========================

// Load quotes from localStorage or fallback
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Wisdom" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Inspiration" },
  { text: "If you are working on something exciting, it will keep you motivated.", category: "Work" }
];

const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const categorySelect = document.getElementById("categorySelect");

// -----------------
// STORAGE FUNCTIONS
// -----------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}
function saveLastCategory(category) {
  localStorage.setItem("lastCategory", category);
}
function getLastCategory() {
  return localStorage.getItem("lastCategory") || "all";
}
function saveLastQuote(quoteText) {
  sessionStorage.setItem("lastQuote", quoteText);
}

// -----------------
// DOM MANIPULATION
// -----------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categorySelect.innerHTML = `<option value="all">All</option>`;
  categories.forEach(cat => {
    let option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  // Restore last chosen category
  const lastCat = getLastCategory();
  categorySelect.value = lastCat;
}

function showRandomQuote() {
  const selectedCategory = categorySelect.value;
  let filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quoteObj = filteredQuotes[randomIndex];
  const output = `"${quoteObj.text}" — ${quoteObj.category}`;

  quoteDisplay.textContent = output;

  // Save last shown
  saveLastQuote(output);
  saveLastCategory(selectedCategory);
}

// -----------------
// FORM CREATION
// -----------------
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.className = "form-container";

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addBtn);

  document.body.appendChild(formContainer);
}

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (!newText || !newCategory) {
    alert("Please enter both quote text and category!");
    return;
  }

  quotes.push({ text: newText, category: newCategory });
  saveQuotes(); // persist

  populateCategories();

  textInput.value = "";
  categoryInput.value = "";

  alert("Quote added successfully!");
}

// -----------------
// JSON IMPORT/EXPORT
// -----------------
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format.");
      }
    } catch (err) {
      alert("Error parsing JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// -----------------
// SERVER SYNC (Mock)
// -----------------
async function syncWithServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const serverQuotes = await response.json();

    const mapped = serverQuotes.map(item => ({
      text: item.title,
      category: "Server"
    }));

    // Conflict resolution: server data wins
    quotes = [...mapped, ...quotes];
    saveQuotes();
    populateCategories();
    console.log("Synced with server");
  } catch (err) {
    console.error("Error syncing with server", err);
  }
}

// -----------------
// EVENT LISTENERS
// -----------------
newQuoteBtn.addEventListener("click", showRandomQuote);
categorySelect.addEventListener("change", () => {
  saveLastCategory(categorySelect.value);
});

document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  createAddQuoteForm(); // <- dynamically add the form on page load

  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    quoteDisplay.textContent = lastQuote;
  }
});

setInterval(syncWithServer, 30000);



categoryFilter.addEventListener("input", (e) => {
  const filterValue = e.target.value.toLowerCase();
  const filteredQuotes = quotes.filter(quote =>
    quote.category.toLowerCase().includes(filterValue)
  );
  displayQuotes(filteredQuotes);
});