import _ from 'lodash';

class RealtorAPI {

	query = _.throttle((opts) => {
		return this._query(opts);
	}, 5000);


	_query = (opts) => {
		// let opts = {
		// 	CultureId: 1, ApplicationId: 1, PropertySearchTypeId: 1,
		//
		// 	LongitudeMin: -79.96602773666382,
		// 	LongitudeMax: -78.88044118881226,
		// 	LatitudeMin: 43.52992179210901,
		// 	LatitudeMax: 43.92142893950709,
		// 	PriceMin: 100000,
		// 	PriceMax: 410000,
		//
		// 	// MaximumResults:9,
		// 	// TransactionTypeId:2,
		// 	// StoreyRange:"0-0",
		// 	// BedRange:"0-0",
		// 	// BathRange:"0-0",
		// 	// SortOrder:"A",
		// 	// SortBy:1,
		// 	// CurrentPage:1,
		// 	// ZoomLevel:11,
		// 	// PropertyTypeGroupID:1
		// };

		let params = { CultureId: 1, ApplicationId: 1, PropertySearchTypeId: 1 };
		Object.assign(params, opts);

		// convert json into urlencoded form data
		const searchParams = Object.keys(params).map((key) => {
			return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
		}).join('&');

		return fetch("/realtor", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
			},
			body: searchParams
		})
			.then(resp => {
				console.log('request result: ' + resp.statusText + ': ' + resp.status);
				return resp.json();
			})
			.catch(err => {
				console.error(err);
			});
	}
}

export default new RealtorAPI();