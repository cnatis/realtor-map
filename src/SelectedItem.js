import React, { Component } from 'react';

export default class SelectedItem extends Component {

	render() {
		const item = this.props.item;
		if (item) {
			return (
				<div className='details-content'>
					<p>{item.MlsNumber}</p>
					{item.Building ? (
						<div>
	                        <div className='row'>
	                            <label>Type</label>
	                            <span>{item.Building.Type}</span>
	                        </div>
	                        <div className='row'>
	                            <label>Ammenities</label>
	                            <span>{item.Building.Ammenities}</span>
	                        </div>
	                        <div className='row'>
	                            <label>Bathrooms</label>
	                            <span>{item.Building.BathroomTotal}</span>
	                        </div>
	                        <div className='row'>
	                            <label>Bedrooms</label>
	                            <span>{item.Building.Bedrooms}</span>
	                        </div>
						</div>
					) : null}
					{item.Property ? (
						<div>
	                        <div className='row'>
	                            <label>Price</label>
	                            <span>{item.Property.Price}</span>
	                        </div>
	                        <div className='row'>
	                            <label>Property Type</label>
	                            <span>{item.Property.Type}</span>
	                        </div>
	                        <div className='row'>
	                            <label>Ownership Type</label>
	                            <span>{item.Property.OwnershipType}</span>
	                        </div>
							{item.Property.Address ? (
								<div className='row'>
									<label>Address</label>
									<span>{item.Property.Address.AddressText}</span>
								</div>
							) : null}
	                        {item.Property.Parking ? (
								<div className='row'>
									<label>Parking</label>
									<span>{item.Property.Parking.map(p => p.name)}</span>
								</div>
	                        ) : null}
	                        <div className='row'>
	                            <label>Near By Ammenities</label>
	                            <span>{item.Property.AmmenitiesNearBy}</span>
	                        </div>
						</div>
					) : null}
	                {item.PublicRemarks ? (
	                    <p>
							<label>Description</label>
	                        {item.PublicRemarks}
	                    </p>
	                ) : null}
				</div>
			);
		}
		else {
			return (
				<div>Loading</div>
			);
		}

	}
}

// Building: {BathroomTotal: "1", Bedrooms: "2", Type: "Apartment", Ammenities: "Exercise Centre"}
// Business: {}
// Distance:""
// Id:"19031989"
// Individual:(2) [{…}, {…}]
// Land:{}
// MlsNumber:"W4029876"
// PhotoChangeDateUTC:"2018-01-27 7:26:41 PM"
// PostalCode:"M3M2E9"
// PriceChangeDateUTC:"2018-05-28 7:10:49 PM"
// Property:{Price: "$209,900", Type: "Single Family", Address: {…}, Photo: Array(1), Parking: Array(2), …}
// PublicRemarks:"770 Square Feet, 2 Bedroom Updated Condo. 24 Hr Security. Close To Wilson Subway, 401, York U, Yorkdale.  Shops & Restaurants Within Walking Distance. Fitness Club Membership Available In Building.   72 Hrs Irrevocable. Seller Sch B To Accompany Offers**** EXTRAS **** Also Included Unit 99, Level A; Unit 195, Level A.   Buyer To Verify Taxes, Any Rental Equipment, Parking, Measurements & Any Fees."   RelativeDetailsURL:"/Residential/Single-Family/19031989/503--2737-KEELE-ST-Toronto-Ontario-M3M2E9-Downsview-Roding-CFB"
// StatusId:"1"