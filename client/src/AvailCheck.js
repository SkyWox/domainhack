import React, { Component } from 'react'
import './App.css'
import { Button } from 'react-bootstrap'
var axios = require('axios')
var debounce = require('debounce')
var CancelToken = axios.CancelToken
var source = CancelToken.source()

class AvailCheck extends Component {
  componentWillMount() {
    this.setState({
      avail: 'may be available',
      domain: this.props.domain,
      link: 'www.namecheap.com',
      requestFailed: false,
      retries: 2
    })
  }

  componentDidMount() {
    this.slowgetWhois.clear()
    this.slowgetWhois()
  }

  componentWillUnmount() {
    if (
      this.state.avail === 'may be available' ||
      this.state.link === 'www.namecheap.com'
    ) {
      source.cancel()
    }
  }

  componentWillUpdate() {
    source = new CancelToken.source()
  }

  slowgetWhois = debounce(this.getWhois, 800)
  slowgetAffLink = debounce(this.getAffLink, 400)

  getWhois() {
    if (this.state.domain === 'www.namecheap.com') {
      this.slowgetAffLink.clear()
      this.slowgetAffLink()
    }
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
        .catch(function(thrown) {
          if (axios.isCancel(thrown)) {
            console.log('WhoIs request canceled')
          }
        })
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
      xsrfHeaderName: 'X-CSRFToken',
      cancelToken: source.token
    }).then(link => {
      this.setState({ link: link.data })
    })
  }

  render() {
    return (
      <li className="URL" ref="mount">
        <Button
          bsStyle="link"
          target="_blank"
          href={this.state.link}
          id={this.state.avail.toString()}
          failed={this.state.requestFailed.toString()}
        >
          {this.props.domain} {this.getResult(this.state.avail)}
        </Button>
      </li>
    )
  }
}

export default AvailCheck
