import React, { Component } from 'react';

export default class SelectedItem extends Component {
	render() {
		const item = this.props.item;
		return (
			<div className='details-content'>
				<p>{item.MlsNumber}</p>
			</div>
		);
	}
}