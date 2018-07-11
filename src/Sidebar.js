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

    render() {
        return (
            <div ref={(r) => this.containerEl = r} className="leaflet-sidebar collapsed">
                <div className="leaflet-sidebar-tabs">
                    <ul role="tablist">
                        <li><a href="#home" role="tab"><i className="fa fa-bars"></i></a></li>
                        <li><a href="#profile" role="tab"><i className="fa fa-user"></i></a></li>
                        <li className="disabled"><a href="#messages" role="tab"><i className="fa fa-envelope"></i></a></li>
                        <li><a href="https://github.com/Turbo87/sidebar-v2" role="tab" target="_blank"><i className="fa fa-github"></i></a></li>
                    </ul>

                    <ul role="tablist">
                        <li><a href="#settings" role="tab"><i className="fa fa-gear"></i></a></li>
                    </ul>
                </div>

                <div className="leaflet-sidebar-content">
                    <div className="leaflet-sidebar-pane" id="home">
                        <h1 className="leaflet-sidebar-header">
                            sidebar-v2
                            <span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span>
                        </h1>

                        <p>A responsive sidebar for mapping libraries like <a href="http://leafletjs.com/">Leaflet</a> or <a href="http://openlayers.org/">OpenLayers</a>.</p>

                        <p className="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

                        <p className="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

                        <p className="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>

                        <p className="lorem">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p>
                    </div>

                    <div className="leaflet-sidebar-pane" id="profile">
                        <h1 className="leaflet-sidebar-header">Profile<span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
                    </div>

                    <div className="leaflet-sidebar-pane" id="messages">
                        <h1 className="leaflet-sidebar-header">Messages<span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
                    </div>

                    <div className="leaflet-sidebar-pane" id="settings">
                        <h1 className="leaflet-sidebar-header">Settings<span className="leaflet-sidebar-close"><i className="fa fa-caret-left"></i></span></h1>
                    </div>
                </div>
            </div>
        );
    }
}

export default Sidebar;
