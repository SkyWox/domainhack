import React, { Component } from 'react'
import './App.css'
import { Button } from 'react-bootstrap'
var axios = require('axios')
//prefer not to use lodash schema just for this
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
		this.slowgetWhois()
		this.getAffLink()
	}

	componentWillReceiveProps(nextProps) {
		//update state then fetch availability
		this.setState(
			{
				domain: nextProps.domain,
				avail: 'may be available'
			},
			() => {
				this.slowgetWhois.clear()
				this.slowgetWhois()
			}
		)
	}

	slowgetWhois = debounce(this.getWhois, 800)

	getWhois() {
		if (this.refs.mount) {
			var requestURL = new Request('/whois?domain=' + this.state.domain)
			fetch(requestURL)
				.then(res => res.json())
				.then(res => {
					this.setState({ avail: res.available })
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
		var domain = this.props.domain.replace(/\./g, '%2E')
		axios
			.post('/referral', { domain: domain })
			.then(link => {
				this.setState({ link: link.data })
			})
			.catch(error => console.log(error))
	}

	render() {
		const domain = this.props.domain
		const result = this.getResult(this.state.avail)

		return (
			<li className="URL" ref="mount">
				<Button
					bsStyle="link"
					target="_blank"
					href={this.state.link}
					id={this.state.avail.toString()}>
					{domain} {result}
				</Button>
			</li>
		)
	}
}

export default AvailCheck
