import React, { Component } from 'react';
import './App.css';
//prefer not to use lodash schema just for this
var debounce = require('debounce')


class AvailCheck extends Component {

  componentWillMount (){
    this.setState({
      avail : 'may be available',
      domain : this.props.domain })
  }

  componentDidMount(){
    this.slowgetWhois()
  }

  componentWillReceiveProps (nextProps){
    //update state then fetch availability
    this.setState({
      domain : nextProps.domain,
      avail : 'may be available'
    }, () => {
      this.slowgetWhois.clear()
      this.slowgetWhois()
    })
  }

  slowgetWhois = debounce(this.getWhois, 1000)

  getWhois (){
    var requestURL = new Request('/whois?domain=' + this.state.domain)
    fetch(requestURL)
    .then(res => res.json())
    .then(res => {this.setState({ avail : res.available})})
    .catch()
  }

  getResult(avail){
    var result = ''

    switch(avail){
      case true:
        result ='is available!'
        break;
      case false:
        result ='is taken'
        break;
      case 'unknown':
        result = 'may be available'
        break;
      case 'bad':
        result = 'is a bad domain'
        break;
      default:
        result = 'may be available'
        break;
    }
    return result
  }

  getAffLink(domain){
    domain = domain.replace(/\./g, "%2E")
    const URL = "http://shareasale.com/r.cfm?b=467188&u=1627081&m=46483&urllink=www%2Enamecheap%2Ecom%2Fdomains%2Fregistration%2Fresults%2Easpx%3Fdomain%3D" + domain
    console.log(URL)
    return URL
  }

  render(){
    const domain = this.state.domain
    const result = this.getResult(this.state.avail)

    return(
      <li className='URL'>
        <a target="_blank" href={this.getAffLink(domain)}
        id={this.state.avail.toString()}>
        {domain} {result}
        </a>
      </li>
    )
  }

}

export default AvailCheck;
