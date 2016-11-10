// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function getQuotes (quotes, callback, errorCallback, status) {
  if (!quotes) quotes = ["TSLA","VOO","BOX","MSFT","BBRY","NVDA","CGC","F"];// ["YHOO","AAPL","GOOG","MSFT"];
  var searchUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(" +
    // encodeURIComponent("\"YHOO\",\"AAPL\",\"GOOG\",\"MSFT\"") + 
    encodeURIComponent("\"" + quotes.join("\",\"") + "\"") + 
    ")%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&callback=";
  
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.query || !response.query.results || !response.query.results.quote) {
      callback('No response from Yahoo Query search!');
      return;
    }
    // var firstResult = response.responseData.results.quote[0];
    status("Success!");
    callback(response.query.results.quote);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
  status("Running...");
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
  // chrome.extension.getBackgroundPage().console.log(statusText);
}

function renderQuotes(quotes) {
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

document.addEventListener('DOMContentLoaded', function() {
  // setTimeout(function(){ renderStatus("DOMContentLoaded"); }, 500);
  renderStatus("Calling Query");
  getQuotes(null, renderQuotes, renderStatus, renderStatus);
  // anotherOne();

  document.getElementById("stock").addEventListener('change', function addNewStock () {
    alert("new! " + document.getElementById("stock").value);
  });
});
