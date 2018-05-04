// Copyright (c) 2016 Kaiser Dandangi. All rights reserved.
function getQuotes (quotes, callback, errorCallback, status) {
  if (!quotes) quotes = ["TSLA","VOO","BOX","MSFT","BBRY","NVDA","CGC","F"];

  var searchUrl = "https://api.robinhood.com/quotes/?symbols=";
  searchUrl += encodeURIComponent(quotes.join(","));

  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  x.onload = function() {
    var response = x.response;

    status("Quotes retrieved!");
    callback(JSON.parse(response).results);
  };
  x.onerror = function(e) {
    status("Request unsuccessful...");
    errorCallback(e);
  };
  x.send();
  status("Loading...");
}

function renderStatus (statusText) {
  document.getElementById('status').textContent = statusText;
  if (statusText == "Loading...") {
    document.querySelector("#status-block .spinner").style.display = "";
  } else {
    document.querySelector("#status-block .spinner").style.display = "none";
  }
}

function renderStockPicks (stockPicks, element) {
  if (!element) element = document.getElementById("stock-picks");
  if (!stockPicks) stockPicks = JSON.parse(localStorage.stockPicks);
  element.textContent = "Your picks: " + stockPicks.join(", ")
}

// Google Finance Normalizer
function normalizeQuotesGoogle (quotes) {
  return quotes.map((quote) => {
    return {
      symbol: quote.t,
      exchange: quote.e,
      LastTradePriceOnly: quote.l,
      ChangeinPercent: quote.cp[0] === "-" ? quote.cp : "+" + quote.cp,
      localizedPrice: quote.l_cur.indexOf("$") > -1 ? quote.l_cur : "US$" + quote.l_cur
    };
  });
}

// Robinhood Normalizer
function normalizeQuotes (quotes) {
  var stockPicks = JSON.parse(localStorage.stockPicks)

  return quotes.map((quote, i) => {
    if (!quote) quote = { symbol: stockPicks[i] };
    return {
      symbol: quote.symbol,
      exchange: "",
      LastTradePriceOnly: quote.last_trade_price || "",
      ChangeinPercent: calcChangeinPercent(
        parseFloat(quote.last_trade_price),
        parseFloat(quote.previous_close)
      ) || "",
      localizedPrice: "US$" + (quote.last_trade_price || "0.000")
    };
  });

  function calcChangeinPercent(curr, prev) {
    return (curr - prev) * 100/prev;
  }
}

function renderQuotes (quotes) {
  // Normalize the google finance response to be the same as yql
  quotes = normalizeQuotes(quotes);

  var doc = document.getElementById("quotes");
  var innerHTML = "<table><tr><th>Symbol</th><th>Last Trade</th><th>% Change</th><th>Remove</th></tr>";
  quotes.forEach(function (quote) {

    var delta = Number(quote.ChangeinPercent).toFixed(3);
    var styleClass = "neutral";

    if (delta > 10) {
      styleClass = "big-positive";
    } else if (delta > 0) {
      styleClass = "positive";
    } else if (delta < -10) {
      styleClass = "big-negative";
    } else if (delta < 0) {
      styleClass = "negative";
    } else {
      styleClass = "neutral";
    }

    innerHTML += `<tr>
                    <td><a href="https://www.google.ca/finance?q=${quote.exchange}%3A${quote.symbol}" target="_blank">${quote.symbol}</a></td>
                    <td>${quote.localizedPrice}</td>
                    <td class="${styleClass}">${delta}</td>
                    <td class="remove-stock" symbol="${quote.symbol}"><button>Remove ${quote.symbol}</button></td>
                  </tr>`;
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

function dumpError (e) {
  console.log(e);
}

document.addEventListener('DOMContentLoaded', function() {

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
  getQuotes(stockPicks, renderQuotes, dumpError, renderStatus);

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
    getQuotes(stockPicks, renderQuotes, dumpError, renderStatus);
  });
});
