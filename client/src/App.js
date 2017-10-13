import React, { Component } from 'react';
import './App.css';
var TLD = require('./TLD')
const defaultname = ''

class App extends Component {
  componentWillMount(){

    this.setState({
      name : defaultname, TLDs : TLD, matchTLD : []
    })
  }

  updateName(e) {
    const name = e.target.value.toUpperCase()
    const TLDs = this.state.TLDs
    var matchTLD = []

    if (name.length < 3){
      matchTLD = []
    }else{
      for (var a in TLDs){
        if(name.indexOf(TLDs[a]) > 0){
          const b = name.indexOf(TLDs[a])
          matchTLD.push((name.slice(0,b) + "." + TLDs[a]))
        }
      }
    }

    //Sort by length (longer = more complete)
    matchTLD.sort(function(a, b) {
      return b.length - a.length //||  sort by length, if equal then
             //a.localeCompare(b);     sort by dictionary order -> change to completeness?
    })

    this.setState({
      name : name,
      matchTLD : matchTLD
    })
  }

  render() {
    return (
      <div className="App">
          <h1>
            hack a domain
          </h1>
          <h1>
            <input autoFocus={true} type='text' spellCheck = 'false' size ='30'
              autoComplete = 'false' autocorrect = 'false' maxLength ='63'
              placeholder = "Enter a name"
              value = {this.state.name}
              onChange={(e)=> this.updateName(e)}/>
          </h1>
          {//check for sufficient namespace
              (this.state.name.length > 3)
              ? <div>Click a domain to buy:</div>
              : <div>Please enter at least 3 characters</div>
          }
        <div className="suggestedURLs">
          {this.state.matchTLD.map((tld, index) =>
          <li className="URL" key={index}>
            <a target="_blank" href={"https://google.com/search?q=" + tld}>
            {tld}
          </a>
          </li>)}
        </div>
      </div>
    );
  }
}

export default App;
