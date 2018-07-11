import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet-sidebar-v2';

import 'leaflet-sidebar-v2/css/leaflet-sidebar.min.css';

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
}

export default Sidebar;
