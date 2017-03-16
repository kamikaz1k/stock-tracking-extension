// Copyright (c) 2016 Kaiser Dandangi. All rights reserved.
function getQuotes (quotes, callback, errorCallback, status) {
  if (!quotes) quotes = ["TSLA","VOO","BOX","MSFT","BBRY","NVDA","CGC","F"];// ["YHOO","AAPL","GOOG","MSFT"];
  
  var searchUrl = "https://finance.google.com/finance/info?client=ig&q="
  searchUrl += encodeURIComponent(quotes.join(","));
  
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.onload = function() {
    var response = x.response;
    
    status("Success!");
    callback(JSON.parse(response.slice(4)));
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
  status("Running...");
}

function renderStatus (statusText) {
  document.getElementById('status').textContent = statusText;
}

function renderStockPicks (stockPicks, element) {
  if (!element) element = document.getElementById("stock-picks");
  if (!stockPicks) stockPicks = JSON.parse(localStorage.stockPicks);
  element.textContent = "Your picks: " + stockPicks.join(", ")
}

function normalizeQuotes (quotes) {
  return quotes.map((quote) => {
    return {
      symbol: quote.t,
      LastTradePriceOnly: quote.l,
      ChangeinPercent: quote.c
    };
  });
}

function renderQuotes (quotes) {
  // Normalize the google finance response to be the same as yql
  quotes = normalizeQuotes(quotes);
  // alert("Rendering", JSON.strigify(quote));
  // document.getElementById('status').textContent = "RENDERED"; // quote.LastTradePriceOnly;
  // document.getElementById('current').innerHTML = "RENDERED!";// quote.LastTradePriceOnly;
  var doc = document.createDocumentFragment();
  doc = document.getElementById("quotes");
  var innerHTML = "<table><tr><th>Symbol</th><th>Last Trade</th><th>% Change</th><th>Remove</th></tr>";
  quotes.forEach(function (quote) {
    innerHTML += '<tr>' + 
                  '<td>' + quote.symbol + '</td>' + //'Symbol: 
                  '<td>' + quote.LastTradePriceOnly + '</td>' + //'Price: 
                  '<td>' + quote.ChangeinPercent + '</td>' +
                  '<td class="remove-stock" symbol="' + quote.symbol + '"><button>Remove ' + quote.symbol + '</button></td>' +
                  '</tr>';
  });
  innerHTML += "</table>";
  doc.innerHTML = innerHTML;
  // Setup remove listeners
  document.querySelectorAll(".remove-stock").forEach(function (element) {
    element.addEventListener('click', function () {
      removeStockPick(element.getAttribute("symbol"));
      element.parentNode.parentNode.removeChild(element.parentNode);
    });
  });
}

function removeStockPick (quote) {
  var stockPicks = JSON.parse(localStorage.stockPicks);
  if (stockPicks.includes(quote)) {
    stockPicks.splice(stockPicks.indexOf(quote), 1);
    localStorage.stockPicks = JSON.stringify(stockPicks);
  }
  renderStockPicks();
}

function addStock () {
  var stockPicks = localStorage.stockPicks, newEntry = document.getElementById("stock").value;
  if (!stockPicks) {
    localStorage.stockPicks = JSON.stringify([newEntry.toUpperCase()]);
  } else {
    stockPicks = JSON.parse(stockPicks);
    newEntry = newEntry.toUpperCase();
    // Check for duplicate entries
    if (stockPicks.indexOf(newEntry) !== -1) {
      return;
    }

    stockPicks.push(newEntry);
    localStorage.stockPicks = JSON.stringify(stockPicks);
  }
  renderStatus("Add " + newEntry);
}

document.addEventListener('DOMContentLoaded', function() {
  // setTimeout(function(){ renderStatus("DOMContentLoaded"); }, 500);
  renderStatus("Extension Ready");

  // Get stock picks from local storage
  // Initialize if first run
  var stockPicks = localStorage.stockPicks;
  if (!stockPicks) {
    localStorage.stockPicks = JSON.stringify([]);
    stockPicks = [];
  } else {
    stockPicks = JSON.parse(stockPicks);
  }
  renderStockPicks(stockPicks);
  getQuotes(stockPicks, renderQuotes, renderStatus, renderStatus);

  // Setup Add Stock Listener
  document.getElementById("add-stock").addEventListener('click', function () {
    // Adding click listener
    addStock();
    renderStockPicks();
  });
  // Setup Clear Stock Listener
  document.getElementById("clear-stocks").addEventListener('click', function () {
    localStorage.stockPicks = JSON.stringify([]);
    renderStockPicks();
  });
  // Setup Clear Stock Listener
  document.getElementById("refresh-stocks").addEventListener('click', function () {
    var stockPicks = JSON.parse(localStorage.stockPicks);
    getQuotes(stockPicks, renderQuotes, renderStatus, renderStatus);
  });
});
