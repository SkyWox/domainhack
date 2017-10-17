import React, { Component } from 'react';
import './App.css';

class AvailCheck extends Component {

  state = {
      avail : 'unknown'
  }


  componentWillMount (){
    this.setState({ domain : this.props.domain })
  }

  componentWillReceiveProps (){
    this.setState({ domain : this.props.domain})
  }

  componentDidMount(){
    var requestURL = new Request('/whois?domain=' + this.state.domain)
    fetch(requestURL)
    .then(res => res.json())
    .then(res => {this.setState({ avail : res.available})})
    .catch()
  }

  render(){
    const domain = this.state.domain
    var result = ''

    switch(this.state.avail){
      case true:
        result ='available'
        break;
      case false:
        result ='taken'
        break;
      case 'unknown':
        result = 'unknown'
        break;
      case 'bad':
        result = 'bad'
        break;
      default:
        result = 'unknown'
        break;
    }
    return(
      <li className='URL'>
        <a target="_blank" href={"https://google.com/search?q=" + domain}
        id={result}>
        {domain} is {result}
        </a>
      </li>
    )
  }

}

export default AvailCheck;
