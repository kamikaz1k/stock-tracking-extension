// Copyright (c) 2016 Kaiser Dandangi. All rights reserved.

function getQuotes (quotes, callback, errorCallback, status) {
  if (!quotes) quotes = ["TSLA","VOO","BOX","MSFT","BBRY","NVDA","CGC","F"];// ["YHOO","AAPL","GOOG","MSFT"];
  var searchUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" +
    // encodeURIComponent("\"YHOO\",\"AAPL\",\"GOOG\",\"MSFT\"") + 
    encodeURIComponent("\"" + quotes.join("\",\"") + "\"") + 
    ")%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=";
  
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.responseType = 'json';
  x.onload = function() {
    var response = x.response;
    if (!response || !response.query || !response.query.results || !response.query.results.quote) {
      errorCallback('No response from Yahoo Query search!');
      return;
    }
    status("Success!");
    // console.log(response.query.results.quote);
    // Special case in case of only searching for one stock
    // quote is the response for that pick, rather than it being an array
    response = response.query.results.quote;
    if (!response.length) response = [response];

    callback(response);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
  status("Running...");
}

function renderStatus (statusText) {
  document.getElementById('status').textContent = statusText;
  // chrome.extension.getBackgroundPage().console.log(statusText);
}

function renderStockPicks (stockPicks, element) {
  if (!element) element = document.getElementById("stock-picks");
  if (!stockPicks) stockPicks = JSON.parse(localStorage.stockPicks);
  element.textContent = "Your picks: " + stockPicks.join(", ")
}

function renderQuotes (quotes) {
  // alert("Rendering", JSON.strigify(quote));
  // document.getElementById('status').textContent = "RENDERED";
  document.getElementById('current').textContent = "Quotes: " + quotes.length;// quote.LastTradePriceOnly;
  // document.getElementById('current').innerHTML = "RENDERED!";// quote.LastTradePriceOnly;
  var doc = document.createDocumentFragment();
  doc = document.getElementById("quotes");
  var innerHTML = "<table><tr><th>Symbol</th><th>Last Trade</th><th>% Change</th></tr>";
  quotes.forEach(function (quote) {
    innerHTML += '<tr>' + 
                  '<td>' + quote.symbol + '</td>' + //'Symbol: 
                  '<td>' + quote.LastTradePriceOnly + '</td>' + //'Price: 
                  '<td>' + quote.ChangeinPercent + '</td>' +
                  '</tr>';
  });
  innerHTML += "</table>";
  doc.innerHTML = innerHTML;
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
  // console.log(stockPicks);
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
});
