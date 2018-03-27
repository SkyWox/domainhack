import React, { Component } from 'react'
import './App.css'
import AvailCheck from './AvailCheck.js'
var axios = require('axios')
var debounce = require('debounce')
var TLD = require('./TLD')
const defaultname = ''

class App extends Component {
  componentWillMount() {
    this.setState({
      name: defaultname,
      TLDs: TLD,
      matchTLD: [],
      available: true,
      successes: 0,
      fails: 0,
      userTimeout: 11000,
      showUserTime: false
    })
  }

  componentDidMount() {
    this.getStats()
    //update TLD list
    axios({
      method: 'GET',
      url: '/tld',
      xsrfHeaderName: 'X-CSRFToken',
      headers: { userTimeout: this.state.userTimeout }
    }).then(res => {
      if (res.data[0] !== 'failure') {
        this.setState({
          TLDs: res.data.map(x => {
            return x.toUpperCase().replace(/\./g, '')
          })
        })
      }
    })
  }

  slowGetStats = debounce(this.getStats, 800)

  getStats() {
    axios({
      method: 'GET',
      url: '/whois/stats',
      xsrfHeaderName: 'X-CSRFToken'
    }).then(res => {
      this.setState({
        successes: res.data.successes,
        fails: res.data.fails
      })
    })
  }

  updateName(e) {
    this.setState({ name: e.target.value.toUpperCase(), matchTLD: [] }, () => {
      const name = this.state.name
      const TLDs = this.state.TLDs

      var matchTLD = []

      if (name.length < 3) {
        this.setState({ matchTLD: [] })
      } else {
        for (var a in TLDs) {
          if (
            name.indexOf(TLDs[a]) > 0 &&
            TLDs[a].length + name.indexOf(TLDs[a]) >= name.length
          ) {
            const b = name.indexOf(TLDs[a])
            matchTLD.push(name.slice(0, b) + '.' + TLDs[a])
          }
        }
        matchTLD.unshift(
          name + '.COM',
          name + '.NET',
          name + '.ORG',
          name + '.IO'
        )

        this.setState({ matchTLD: matchTLD })
      }
      this.slowGetStats.clear()
      this.slowGetStats()
    })
  }

  render() {
    return (
      <div className="App">
        <h1>find a hacked domain name</h1>

        <h1>
          <input
            autoFocus={true}
            type="text"
            spellCheck="false"
            size="20"
            autoComplete="false"
            autoCorrect="false"
            maxLength="63"
            placeholder="Enter a name"
            value={this.state.name}
            onChange={e => this.updateName(e)}
          />
        </h1>
        {//check for sufficient namespace
        this.state.name.length > 2 ? (
          <div>Click a domain to buy:</div>
        ) : (
          <div>Please enter at least 3 characters</div>
        )}
        <div className="suggestedURLs">
          {this.state.matchTLD.map((domain, index) => (
            <AvailCheck
              domain={domain}
              key={index}
              userTimeout={this.state.userTimeout}
            />
          ))}
        </div>
      </div>
    )
  }
}
//AvailCheck domain = {domain}
export default App
