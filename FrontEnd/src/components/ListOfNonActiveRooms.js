import React, {Component} from 'react';
import '../css/ListOfRooms.css';
import {Container, Row, Col, ButtonGroup, Button, Input} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPen, faPlus, faBook} from "@fortawesome/free-solid-svg-icons";
import logo from '../flat.jpg';
import { connect } from 'react-redux'
import {flatDeleted, flatsLoaded, flatsNonactiveLoaded} from '../redux/actions/flatsActions'
import { withRouter } from 'react-router-dom'

import {idUser} from "./AuthHelperMethods"

class ListOfNonActiveRooms extends Component {
    constructor(props) {
        super(props);
        this.onDetailClick = this.onDetailClick.bind(this);
    }

    componentDidMount() {
        if (this.props.flats === undefined) {
         //   http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats?id=1
            fetch(` http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats/nonactive?id=${idUser}`)
                .then((data) => data.json())
                .then((flats) => {
                    this.props.flatsNonactiveLoaded(flats);
                });
        }
    }

    renderImage(room_image) {
        if (room_image !== null) {
            if (room_image.content !== "") {
                let base64 = require('base-64');
                let decoded = base64.decode(room_image.content);
                return <img src={`${decoded}`} className="offer-pic"/>
            }
        }
        return <img src={logo} className="offer-pic"/>
    }

    render() {
        const flatsNonactive = this.props.flatsNonactive;
        return (
            <div>
                <h2 className='nameOfPage'>
                    My nonactive offers
                </h2>
                <br/>
                <Container>
                    <Row>
                        {flatsNonactive && flatsNonactive.map(r =>
                            <>
                                <Col className='container-offer' key={r.id}>
                                    <div>{r.name_of_room}</div>
                                    <Row>
                                        {this.renderImage(r.room_image)}
                                    </Row>
                                    <Row>
                                        <ButtonGroup className={'icon-offer-box'}>
                                            <Button value={r.id} onClick={() => this.onDetailClick(r.id)}
                                                    className='icon-offer-manage'>
                                                <FontAwesomeIcon icon={faPen}/>
                                            </Button>
                                            <Button value={r.id} href={`/reservations/flat/${r.id}`} className='icon-offer-manage'>
                                                <FontAwesomeIcon icon={faBook}/>
                                            </Button>
                                        </ButtonGroup>
                                    </Row>
                                </Col>
                            </>
                        )}
                    </Row>
                </Container>
            </div>
        );
    }

    onDetailClick(id) {
        this.props.history.push(`/offers/edit/${id}`);
    }
}

const mapStateToProps = (state) => {
    return {
        flatsNonactive: state.flatsNonactive
    }
};

const mapDispatchToProps = (dispatch) => ({
    flatsNonactiveLoaded: flats => dispatch(flatsNonactiveLoaded(flats)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListOfNonActiveRooms))