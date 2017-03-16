# STOCK TRACKING (CHROME) EXTENSION

I made a dinky little stock tracker because I got tired of manually typing in the tickers in the google search page.

It'll create a [$] icon/button in the extension section beside the URL bar. Click it to reveal a popover that retrieves the the stock quotes from Google's unpublished finance endpoint.

Basically it is parsing the text response from: https://finance.google.com/finance/info?client=ig&q=GOOG
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
- [x] ~~Allow querying of non-US stock listings~~
- [ ] MOAR GFX. Atleast 3 times as many
- [ ] Find a better service for **REALTIME** data
