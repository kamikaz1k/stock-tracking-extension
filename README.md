# STOCK TRACKING (CHROME) EXTENSION

I made a dinky little stock tracker because I got tired of manually typing in the tickers in the google search page.

It'll create a [$] icon/button in the extension section beside the URL bar. Click it to reveal a popover that retrieves the the stock quotes from [Yahoo using the YQL](https://query.yahooapis.com/v1/public/yql) to query data in the Yahoo finance quotes table.

Basically it is parsing the JSON response from: https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22GOOG%22%2C%22MSFT%22%2C%22NVDA%22%2C%22TSLA%22)%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env
If you have a better service to use, I would appreciate the tip!

## Quick Start
1. `git clone https://github.com/kamikaz1k/stock-tracking-extension.git` or just download the source manually
2. Open `chrome://extensions/` in Chrome
3. Click on `Load Unpacked Extension...` and select the directory that contains all the source files
4. ???
5. Profit

Installation help reference: https://developer.chrome.com/extensions/getstarted#unpacked

## Future improvements: 
- [x] ~~Dynamically add in quotes and remember it~~
- [ ] MOAR GFX. Atleast 3 times as many
- [ ] Find a better service for **REALTIME** data
