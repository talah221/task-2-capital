import React, { Component } from 'react';
import { dataService } from '../services/dataService'
export class MainApp extends Component {
  state = {
    data: null
  }
  interval;
  componentDidMount() {
    this.interval = setInterval(this.fetchData(), 1000 * 60 * 20) // Fetching Data Every 20 Minutes (We Also can keep the interval on localStorage to handle Refresh.)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  async fetchData() {
    console.log('intervaling');
    const data = await dataService.getData()
    this.setState({ data })
  }

  render() {
    var { data } = this.state
    if (!data) return <p>Loading Data. If Loading too long => Go to dataService and uncomment function.</p>
    return (
      <main className="main-app-container">
        <h1>Data From : https://www.live-rates.com/rates</h1>
        <div className="stocks">

          {data.map(item => {
            return <div key={item.currency}>
              <h1>Currency: {item.currency}</h1>
              <p>Timestamp: {item.timestamp}</p>
              <p>rate: {item.rate}</p>
              <p>ask: {item.ask}</p>
              <p>bid: {item.bid}</p>
              <p>close: {item.close}</p>
              <p>high: {item.high}</p>
              <p>low: {item.low}</p>
              <p>open: {item.open}</p>
            </div>
          })}
        </div>

      </main>
    );
  }
}
