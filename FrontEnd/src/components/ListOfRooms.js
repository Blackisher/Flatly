import React, {Component} from 'react';
import '../css/ListOfRooms.css';
import {Container, Row, Col, ButtonGroup, Button} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPen, faPlus, faBook} from "@fortawesome/free-solid-svg-icons";
import logo from '../flat.jpg';
import { connect } from 'react-redux'
import {flatDeleted, flatsLoaded} from '../redux/actions/flatsActions'
import { withRouter } from 'react-router-dom'
import ReservationsOfFlat from "./ReservationsOfFlat";
import Layout from "./layout/Layout";

class ListOfRooms extends Component {
    constructor(props) {
        super(props);
        this.onDetailClick = this.onDetailClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onClickNewOffer = this.onClickNewOffer.bind(this);
    }

    componentDidMount() {
        if (this.props.flats === undefined) {
            fetch('http://localhost:8080/flats')
                .then((data) => data.json())
                .then((flats) => {
                    this.props.flatsLoaded(flats);
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
        const {flats} = this.props;
        console.log(flats)
        return (
            <div className="App-header">
                <div className="nameOfPage">
                    <h2>My Offers &nbsp; </h2>
                    <Button value="" className='icon-add' onClick={this.onClickNewOffer}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </Button>
                </div>
                <br/>
                <Container>
                    <Row>
                        {flats && flats.map(r =>
                            <>
                                <Col className='container-offer' key={r.id}>
                                    <div className='small'>{r.name_of_room}</div>
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
                                            <Button value={r.id} onClick={() => {
                                                if (window.confirm('Are you sure you wish to delete this item?')) this.onDeleteClick(r.id)
                                            }} className='icon-offer-manage'>
                                                <FontAwesomeIcon icon={faTrash}/>
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


    onClickNewOffer() {
        this.props.history.push(`/offers/create`);
    }

    onDetailClick(id) {
        this.props.history.push(`/offers/edit/${id}`);
    }

    onDeleteClick(id) {
        fetch("http://localhost:8080/flats/delete/" + id, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id})
        })
            .then(res => {
                    if (res.status === 200) {
                        this.props.dispatchDelete(id);
                    }
                }
            );
    }
}

const mapStateToProps = (state) => {
    return {
        flats: state.flats
    }
};

const mapDispatchToProps = (dispatch) => ({
    flatsLoaded: flats => dispatch(flatsLoaded(flats)),
    dispatchDelete: (id) => dispatch(flatDeleted(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListOfRooms))