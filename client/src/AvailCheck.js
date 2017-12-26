import React, { Component } from 'react'
import './App.css'
import { Button } from 'react-bootstrap'
var axios = require('axios')
var debounce = require('debounce')

class AvailCheck extends Component {
  componentWillMount() {
    this.setState({
      avail: 'may be available',
      domain: this.props.domain,
      link: 'www.namecheap.com'
    })
  }

  componentDidMount() {
    this.slowgetWhois.clear()
    this.slowgetWhois()
  }

  slowgetWhois = debounce(this.getWhois, 800)

  getWhois() {
    this.getAffLink()
    if (this.refs.mount) {
      axios({
        method: 'GET',
        url: '/whois?domain=' + this.state.domain,
        xsrfHeaderName: 'X-CSRFToken'
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({ avail: res.data.available })
          }
        })
        .catch()
    }
  }

  getResult(avail) {
    var result = ''

    switch (avail) {
      case true:
        result = 'is available!'
        break
      case false:
        result = 'is taken'
        break
      case 'unknown':
        result = 'may be available'
        break
      case 'bad':
        result = 'is a bad domain'
        break
      default:
        result = 'may be available'
        break
    }
    return result
  }

  getAffLink() {
    axios({
      method: 'GET',
      url: '/referral?domain=' + this.props.domain,
      xsrfHeaderName: 'X-CSRFToken'
    })
      .then(link => {
        this.setState({ link: link.data })
      })
      .catch(error => console.log(error))
  }

  render() {
    return (
      <li className="URL" ref="mount">
        <Button
          bsStyle="link"
          target="_blank"
          href={this.state.link}
          id={this.state.avail.toString()}
        >
          {this.props.domain} {this.getResult(this.state.avail)}
        </Button>
      </li>
    )
  }
}

export default AvailCheck
