import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-sidebar-v2';

import 'leaflet-sidebar-v2/css/leaflet-sidebar.min.css';
import './Sidebar.css';

class Sidebar extends Component {

    componentDidMount() {
        this.sidebar = L.control.sidebar({
            container: this.containerEl
        });
    }

    componentWillUpdate(nextProps) {
        if (this.props.selectedData !== nextProps.selectedData) {
            // Selected data changed
            if (nextProps.selectedData == null) {
                // No data selected
                this.close('details');
            } else {
                // Data selected
                this.open('details');
            }
        }
    }

    render() {
        const searchOptions = this.props.searchOptions;

        return (
            <div ref={(r) => this.containerEl = r} className="leaflet-sidebar collapsed">
                <div className="leaflet-sidebar-tabs">
                    <ul role="tablist">
                        <li><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
                        <li><a href="#details" role="tab"><i className="fa fa-info"></i></a></li>
                    </ul>
                </div>

                <div className="leaflet-sidebar-content">
                    <div className="leaflet-sidebar-pane" id="home">
                        <h1 className="leaflet-sidebar-header">
                            Uncharted Hackathon
                            <span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span>
                        </h1>
                        <p>
                            Clickity clickity click something and something else will happen?
                        </p>
                        <div className="form-content">
                            <div>
                                <label>
                                    <span>Property Type</span>
                                    <select value={searchOptions.PropertySearchTypeId} onChange={this.onPropertyChanged.bind(this, 'PropertySearchTypeId')}>
                                        <option value={0}>No Preference</option>
                                        <option value={1}>Residential</option>
                                        <option value={2}>Recreational</option>
                                        <option value={3}>Condo/Strata</option>
                                        <option value={4}>Agriculture</option>
                                        <option value={5}>Parking</option>
                                        <option value={6}>Vacant Land</option>
                                        <option value={7}>Multi Family</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Transaction Type</span>
                                    <select value={searchOptions.TransactionTypeId} onChange={this.onPropertyChanged.bind(this, 'TransactionTypeId')}>
                                        <option value={1}>For sale or rent</option>
                                        <option value={2}>For sale</option>
                                        <option value={3}>For rent</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Price Min</span>
                                    <input type='text' pattern="[0-9]*" value={searchOptions.PriceMin} onChange={this.onPropertyChanged.bind(this, 'PriceMin')}/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Price Max</span>
                                    <input type='text' pattern="[0-9]*" value={searchOptions.PriceMax} onChange={this.onPropertyChanged.bind(this, 'PriceMax')}/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Story Range</span>
                                    <input type='text' pattern="[0-9]*-[0-9]*" placeholder='min-max' value={searchOptions.StoryRange} onChange={this.onPropertyChanged.bind(this, 'StoryRange')}/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Bed Range</span>
                                    <input type='text' pattern="[0-9]*-[0-9]*" placeholder='min-max' value={searchOptions.BedRange} onChange={this.onPropertyChanged.bind(this, 'BedRange')}/>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Bath Range</span>
                                    <input type='text' pattern="[0-9]*-[0-9]*" placeholder='min-max' value={searchOptions.BathRange} onChange={this.onPropertyChanged.bind(this, 'BathRange')}/>
                                </label>
                            </div>
                        </div>
                        <p>
                            Project made by: Chris Regnier, Thanh Pham, Anthony Kalsatos, Christian Natis
                        </p>
                    </div>

                    <div className="leaflet-sidebar-pane" id="details">
                        <h1 className="leaflet-sidebar-header">
                            Data Details
                            <span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span>
                        </h1>
                        {this.props.selectedData && this.props.selectedData.test}
                    </div>
                </div>
            </div>
        );
    }

    // Public API
    open(tab) {
        this.sidebar.open(tab);
    }

    close(tab) {
        this.sidebar.close(tab);
    }

    // Event handlers
    onPropertyChanged(property, e) {
        if (e.target.checkValidity()) {
	        let newSearchOptions = Object.assign({}, this.props.searchOptions, {
		        [property]: e.target.value
	        });
	        this.props.onSearchChanged(newSearchOptions);
        }
    }
}

export default Sidebar;
