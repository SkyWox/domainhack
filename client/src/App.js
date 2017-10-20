import React, { Component } from 'react';
import './App.css';
import AvailCheck from './AvailCheck.js'

var TLD = require('./TLD')
const defaultname = ''


class App extends Component {
  componentWillMount(){
    this.setState({
      name : defaultname, TLDs : TLD, matchTLD : [], available : true
    })
  }

  componentDidMount(){
    //update TLD list
    var requestURL = new Request('/tld')
    fetch(requestURL)
    .then(res => res.json())
    .then(res => {
      if (res[0] !== 'failure'){
        this.setState({
          TLDs : res.toString().toUpperCase().split(","),
          //Rebuild the array making all domains single layer for matching
          TLDsNoDot : res.toString().replace(/\./g, "").toUpperCase().split(",")
        })
      }
    })
    .catch()
  }

  updateName(e) {
    this.setState({name : e.target.value.toUpperCase()})
    const name = e.target.value.toUpperCase()
    const TLDs = this.state.TLDs
    const TLDsNoDot = this.state.TLDsNoDot

    var matchTLD = []

    if (name.length < 3){
      this.setState({matchTLD : []})
    }else{
      for (var a in TLDs){
        if(name.indexOf(TLDsNoDot[a]) > 0 &&
          TLDsNoDot[a].length + name.indexOf(TLDsNoDot[a]) >= name.length){
          const b = name.indexOf(TLDsNoDot[a])
          matchTLD.push((name.slice(0,b) + "." + TLDs[a]))
        }
      }
      matchTLD.unshift(name+'.COM', name+'.NET',name+'.ORG',name+'.IO')

      this.setState({matchTLD : matchTLD})
    }
  }

  render() {
    return (
      <div className="App">
          <h1>
            hack a domain
          </h1>

          <h1>
            <input autoFocus={true} type='text' spellCheck = 'false' size ='20'
              autoComplete = 'false' autoCorrect = 'false' maxLength ='63'
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
          {this.state.matchTLD.map((domain, index) =>
            <AvailCheck domain = {domain} key={index}/>
          )}
        </div>
      </div>
    );
  }
}
//AvailCheck domain = {domain}
export default App;
