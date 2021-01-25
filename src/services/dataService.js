import axios from 'axios'
import { storageService } from './storageService'

const PROXY_BOT_URL = 'https://proxybot.io/api/v1/2YFn6h7TYjRRD4u8Cn52xhGflOD2?url=https://www.live-rates.com/rates'
const RATES_URL = 'https://www.live-rates.com/rates'

async function getData() {
// Uncomment each line to test.

    // return await _getDataEvery20Minutes() // Option 1
    return await _getDataWithProxy() // Option 2
    // return await _getLatestData() // Option 3
}


/*Option 1:
Storing the data on localStorage
sending another request after 20 minutes (3 requests per hour)
updating the template.

Advantages: Every 20 minutes we get update
Disadvantages: Not Exactly "LIVE STREAMING" and not always showing Real time currencies.*/
async function _getDataEvery20Minutes() {
    try {
        let currencies = storageService.getWithExpiry('currencies')
        if (!currencies) {
            console.log('Getting Data From From API');
            var { data } = await axios.get(RATES_URL)
            const twentyMinutesTimestamp = 1000 * 60 * 20
            return storageService.setWithExpiry('currencies', data, twentyMinutesTimestamp)
        }
        console.log('Getting Data From Local Storage');
        return currencies
    }
    catch (err) {
        console.log('Error fetching the data: ', err);
    }
}


/*Option 2:
Using Proxy bot that send requests from random IP's.

Advantages: Free Plan: 100 requests Per Month. Paid Plan: Cheaper than live-rates Pricing.
Disadvantages: 100 requests is not quite enough for app that needs "LIVE STREAMING" - Every second update(Http Request.)*/
async function _getDataWithProxy() {
    try {
        var { data } = await axios.get(PROXY_BOT_URL)
        if (Object.keys(data[0])[0] === "error"){ // Checking if API Doesnt blocks us
            console.log('Unfortunatly API Blocks us. Getting Data From localStorage.');
            data = JSON.parse(localStorage.getItem('currencies'))
            console.log('data', data);
            return data
        }
        localStorage.setItem('currencies',JSON.stringify(data))
        return data
    }
    catch (err) {
        console.log('Got Error Fetching the data: ', err);
    }
}


/*Option 3:
Getting the latest result we requested for.
First we are trying to fetch the latest data. Success? Saving to localStorage.
If the API Blocks us -> we are getting the latest update from the latest save on localStorage

Advantages: We don't need to worry about API Blocks / interval blocks / user accessing the API outside the app
Disadvantages: Less "LIVE STREAMING"
*/
async function _getLatestData() {
    try {
        var { data } = await axios.get(RATES_URL)
        if (Object.keys(data[0])[0] === "error"){ // Checking if API Doesnt blocks us
            console.log('Unfortunatly API Blocks us. Getting Data From localStorage.');
            data = JSON.parse(localStorage.getItem('currencies'))
            console.log('data', data);
            return data
        }
        localStorage.setItem('currencies', JSON.stringify(data)) // Saving the latest update
        return data
    }
    catch (err) {
        console.log('Got Error Fetching the Data: ', err);
    }
}
export const dataService = {
    getData
}