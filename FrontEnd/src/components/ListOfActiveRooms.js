import React, {Component} from 'react';
import '../css/ListOfRooms.css';
import {Container, Row, Col, ButtonGroup, Button, Input} from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash, faPen, faPlus, faBook} from "@fortawesome/free-solid-svg-icons";
import logo from '../flat.jpg';
import { connect } from 'react-redux'
import {flatDeleted, flatsLoaded} from '../redux/actions/flatsActions'
import { withRouter } from 'react-router-dom'

import {idUser} from "./AuthHelperMethods"

class ListOfActiveRooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filtered : []
        };
        this.onDetailClick = this.onDetailClick.bind(this);
        this.onDeleteClick = this.onDeleteClick.bind(this);
        this.onClickNewOffer = this.onClickNewOffer.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    componentDidMount() {
        if (this.props.flats === undefined) {
            //http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats?id=1
            fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats?id=${idUser}`)
                .then((data) => data.json())
                .then((flats) => {
                    this.props.flatsLoaded(flats);
                    this.setState({
                        filtered: flats
                    });
                });
        } else {
            this.setState({
                filtered: this.props.flats
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

    handleSearch(e) {
        let currentList = [];
        let newList = [];

        if (e.target.value !== "") {
            currentList = this.props.flats;
            newList = currentList.filter(item => {
                // change to lowercase
                const lc = item.name_of_room.toLowerCase();
                const lc2 = item.city.toLowerCase();
                const filter = e.target.value.toLowerCase();
                return lc.includes(filter) || lc2.includes(filter);
            });
        } else {
            newList = this.props.flats;
        }
        this.setState({
            filtered: newList
        });
    }

    render() {
        return (
            <div className="App-header">
                <div className="nameOfPage">

                    <Row>
                        <Col md={2}>
                            <Button value="" className='icon-add icon-offer-manage' onClick={this.onClickNewOffer}>
                                <FontAwesomeIcon icon={faPlus}/>
                            </Button>
                        </Col>
                        <Col>
                            <h2>My offers &nbsp; </h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Input type="text" className='search-input' onChange={this.handleSearch} placeholder="Search by name or city..." />
                        </Col>
                    </Row>

                </div>
                <br/>
                <Container>
                    <Row>
                        {this.state.filtered && this.state.filtered.map(r =>
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
        fetch("http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats/delete/" + id, {
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
            )
            .then(() => {
                this.setState({
                    filtered: this.props.flats
                });
            });
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ListOfActiveRooms))