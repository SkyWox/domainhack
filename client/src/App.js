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

  /*componentDidMount(){
    //update TLD list
    var requestURL = new Request('/tld')
    fetch(requestURL)
    .then(res => res.json())
    .then(res => {
      this.setState({ TLDs : res})
    })
    .catch()
  }*/

  /*componentDidUpdate(){
    const name = this.state.name
    const TLDs = this.state.TLDs
    var matchTLD = []

    function compareTLDs(){
      console.log("in compareTLDs")
      for (var a in TLDs){
        if(name.indexOf(TLDs[a]) > 0){
          const b = name.indexOf(TLDs[a])
          matchTLD.push((name.slice(0,b) + "." + TLDs[a]))
        }
      }
      return Promise.resolve()
    }

    function sortByL(){
      console.log('in sortByL')
      //Sort by length (longer = more complete)
      matchTLD.sort(function(a, b) {
        return b.length - a.length //||  sort by length, if equal then
               //a.localeCompare(b);     sort by dictionary order -> change to completeness?
      })
      return Promise.resolve()
    }

    function addCommon(){
      //add common TLDs to front of lists
      //matchTLD.unshift(name+'.COM', name+'.NET',name+'.ORG',name+'.IO')
      return Promise.resolve()
    }

    if (name.length < 3){
      //too short!
    }else{
      compareTLDs().then(sortByL()).then(addCommon()).then(
        this.setState({
          flag : 'in updateName pt 2',
          matchTLD : matchTLD
        })
      ).then(console.log('this.state.name is ' + this.state.name))
      /*for (var a in TLDs){
        if(name.indexOf(TLDs[a]) > 0){
          const b = name.indexOf(TLDs[a])
          matchTLD.push((name.slice(0,b) + "." + TLDs[a]))
        }
      }
  }*/

  updateName(e) {
    this.setState({name : e.target.value.toUpperCase()})
    const name = e.target.value.toUpperCase()
    const TLDs = this.state.TLDs
    var matchTLD = []

    function compareTLDs(){
      console.log("in compareTLDs")
      for (var a in TLDs){
        if(name.indexOf(TLDs[a]) > 0){
          const b = name.indexOf(TLDs[a])
          matchTLD.push((name.slice(0,b) + "." + TLDs[a]))
        }
      }
      return Promise.resolve()
    }

    function sortByL(){
      console.log('in sortByL')
      //Sort by length (longer = more complete)
      matchTLD.sort(function(a, b) {
        return b.length - a.length //||  sort by length, if equal then
               //a.localeCompare(b);     sort by dictionary order -> change to completeness?
      })
      return Promise.resolve()
    }

    function addCommon(){
      //add common TLDs to front of lists
      //matchTLD.unshift(name+'.COM', name+'.NET',name+'.ORG',name+'.IO')
      return Promise.resolve()
    }

    if (name.length < 3){
      //too short!
      this.setState({
        name : name,
        matchTLD : []
      })
    }else{
      compareTLDs().then(sortByL()).then(addCommon()).then(
        this.setState({
          name : name,
          flag : 'in updateName pt 2',
          matchTLD : matchTLD
        })
      ).then(console.log('this.state.name is ' + this.state.name))
      /*for (var a in TLDs){
        if(name.indexOf(TLDs[a]) > 0){
          const b = name.indexOf(TLDs[a])
          matchTLD.push((name.slice(0,b) + "." + TLDs[a]))
        }*/
      }
  }

  render() {
    return (
      <div className="App">
          <h1>
            hack a domain
          </h1>

          <h1>
            <input autoFocus={true} type='text' spellCheck = 'false' size ='30'
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

export default App;
