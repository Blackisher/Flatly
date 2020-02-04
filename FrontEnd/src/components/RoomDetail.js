import React, {Component} from 'react';
import "../css/RoomDetail.css";
import "../css/Login.css";
import {
    Container, Col, Row, Form, CustomInput, ButtonGroup,
    FormGroup, Label, Input,
    Button,
} from 'reactstrap';
import {flatDetailLoaded, flatSaved, flatUpdated} from "../redux/actions/flatsActions";
import {connect} from "react-redux";
import { withRouter } from 'react-router-dom'
import {commonUnloadAction} from "../redux/actions/commonActions";
import {UNLOAD_FLAT_DETAIL} from "../redux/constants/appConstaints";
import * as moment from 'moment'
import logo from "../flat.jpg";

import {idUser} from "./AuthHelperMethods"

class RoomDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flatDetail: {
                name_of_room: undefined,
                owner_of_room: idUser,
                description: undefined,
                start_date: moment().format('YYYY-MM-DD'),
                price: undefined,
                limit_of_quests: undefined,
                check_in_from: undefined,
                check_in_to: undefined,
                check_out: undefined,
                country: undefined,
                city: undefined,
                street: undefined,
                number_of_street: undefined,
                zip_code: undefined,
                room_image: undefined,
                active: "T",
                end_date: null,
                payment_methods: undefined
            },
            selectedFile: undefined,
            all_payment_methods: undefined
        };
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeStartDate = this.onChangeStartDate.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeLimitOfGuests = this.onChangeLimitOfGuests.bind(this);
        this.onChangeCheckInFrom = this.onChangeCheckInFrom.bind(this);
        this.onChangeCheckInTo = this.onChangeCheckInTo.bind(this);
        this.onChangeCheckOut = this.onChangeCheckOut.bind(this);
        this.onChangeCountry = this.onChangeCountry.bind(this);
        this.onChangeCity = this.onChangeCity.bind(this);
        this.onChangeStreet = this.onChangeStreet.bind(this);
        this.onChangeNumberOfStreet = this.onChangeNumberOfStreet.bind(this);
        this.onChangeZipCode = this.onChangeZipCode.bind(this);
        this.onChangeImage = this.onChangeImage.bind(this);
        this.onChangePaymentMethod = this.onChangePaymentMethod.bind(this);
    }

    onChangeName(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, name_of_room: e.target.value}
        });
        console.log(this.state.flatDetail)
    }

    onChangeDescription(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, description: e.target.value}
        });
    }

    onChangeStartDate(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, start_date: e.target.value}
        });
    }

    onChangePrice(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, price: e.target.value}
        });
    }

    onChangeLimitOfGuests(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, limit_of_quests: e.target.value}
        });
    }

    onChangeCheckInFrom(e) {
        let value = e.target.value + ":00";
        this.setState({
            flatDetail:
                {...this.state.flatDetail, check_in_from: value}
        });
    }

    onChangeCheckInTo(e) {
        let value = e.target.value + ":00";
        this.setState({
            flatDetail:
                {...this.state.flatDetail, check_in_to: value}
        });
    }

    onChangeCheckOut(e) {
        let value = e.target.value + ":00";
        this.setState({
            flatDetail:
                {...this.state.flatDetail, check_out: value}
        });
    }

    onChangeCountry(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, country: e.target.value}
        });
    }

    onChangeCity(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, city: e.target.value}
        });
    }

    onChangeStreet(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, street: e.target.value}
        });
    }

    onChangeNumberOfStreet(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, number_of_street: e.target.value}
        });
    }

    onChangeZipCode(e) {
        this.setState({
            flatDetail:
                {...this.state.flatDetail, zip_code: e.target.value}
        });
    }

    onChangeImage(e) {
        e.preventDefault();
        if (e.target.files)  {
            const file = e.target.files[0];
            console.log(file);
            this.setState({ selectedFile: file.content }, () => console.log(this.state.selectedFile))
        }
    }

    onChangePaymentMethod(e) {
        const { options } = e.target;
        let result = null;
        let chosenMethods = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                result = this.state.all_payment_methods.find(t => (t.id == options[i].value));
                chosenMethods.push(result)
            }
        }
        this.setState({flatDetail: {...this.state.flatDetail, payment_methods: chosenMethods}});
     }

    componentDidMount() {
        //fetch roomdetail if edit
        if (this.props.mode === "edit") {
            let id = this.props.id;
            //http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats/1
            fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats/${id}`)
                .then((data) => data.json())
                .then((flat) => {
                    this.props.flatDetailLoaded(flat);
                })
                .then(() => {
                    this.setState({flatDetail: this.props.flatDetail})
                });
        }
        //
        fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/payment`)
            .then((data) => data.json())
            .then((methods) => {
                this.setState({all_payment_methods: methods}, () => {
                    console.log(this.state)})
            });
    }

    componentWillUnmount() {
        this.props.dispatchUnload();
    }

    renderImage() {
        let room_image = this.state.flatDetail.room_image;
        console.log(room_image)
        if (room_image !== undefined) {
            if (room_image !== null) {
                if (room_image.content !== "") {
                    let base64 = require('base-64');
                    let decoded = base64.decode(room_image.content);
                    return <img src={`${decoded}`} className="offer-pic"/>
                }
            }
        }
        return <img src={logo} className="offer-pic"/>;
    }

    renderSelectedPaymentMethods(method) {
        let selected = false;
        if (this.state.flatDetail.payment_methods !== undefined) {
            selected = this.state.flatDetail.payment_methods.some(el => el.id === method.id)
        }
        return (<option key={method.id} value={method.id} selected={selected}>{method.name_of_method}</option>);
    }

    render() {
        const {mode} = this.props;
        let flatDetail = this.state.flatDetail;
        console.log(flatDetail)
        const isEdit = mode === 'edit';
        const title =
            (isEdit && 'Editing of existing offer') || 'Adding new offer';
        return (
            <Form className='form'>
                <Container>
                    <FormGroup>
                        <h2 className={'nameOfPage'}>
                            {title}
                        </h2>
                    </FormGroup>
                    <Col>
                        <Container>
                            <Row>
                                <Col md={5}>
                                    <FormGroup>
                                        <Row>
                                            {this.renderImage()}
                                        </Row>
                                    </FormGroup>
                                </Col>
                                <Col md={7}>
                                    <Row> &nbsp; </Row>
                                    <Row> &nbsp; </Row>
                                    <Row>
                                        <Label>Room image
                                            <CustomInput id="file" type="file" accept=".jpg, .jpeg, .png"
                                                         onChange={this.onChangeImage}/>
                                        </Label>
                                    </Row>
                                </Col>
                            </Row>
                        </Container>
                    </Col>

                    <Col>
                        <Label>Name of offer
                            <Input type="text" onChange={this.onChangeName} value={flatDetail.name_of_room}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Description of offer
                            <Input type="textarea" onChange={this.onChangeDescription} name="text"
                                   value={flatDetail.description}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Available from
                            <Input type="date" onChange={this.onChangeStartDate}
                                   value={moment(flatDetail.start_date).format('YYYY-MM-DD')}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Price per night [€]
                            <Input type="number" onChange={this.onChangePrice} value={flatDetail.price}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Limit of guests
                            <Input type="number" onChange={this.onChangeLimitOfGuests}
                                   value={flatDetail.limit_of_quests}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Check in from
                            <Input
                                type="time"
                                value={flatDetail.check_in_from}
                                onChange={this.onChangeCheckInFrom}
                            />
                        </Label>
                    </Col>
                    <Col>
                        <Label>Check in to
                            <Input
                                type="time"
                                value={flatDetail.check_in_to}
                                onChange={this.onChangeCheckInTo}
                            />
                        </Label>
                    </Col>
                    <Col>
                        <Label>Check out
                            <Input
                                type="time"
                                value={flatDetail.check_out}
                                onChange={this.onChangeCheckOut}
                            />
                        </Label>
                    </Col>
                    <Col>
                        <Label>Payment method
                            <Input type="select" multiple onChange={this.onChangePaymentMethod}>
                                {this.state.all_payment_methods &&
                                    this.state.all_payment_methods.map(method => {
                                        return this.renderSelectedPaymentMethods(method)
                                    })
                                }
                            </Input>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Country
                            <Input type="text" value={flatDetail.country} onChange={this.onChangeCountry}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Town
                            <Input type="text" value={flatDetail.city} onChange={this.onChangeCity}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Street
                            <Input type="text" value={flatDetail.street} onChange={this.onChangeStreet}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Street No.
                            <Input type="text" value={flatDetail.number_of_street}
                                   onChange={this.onChangeNumberOfStreet}/>
                        </Label>
                    </Col>
                    <Col>
                        <Label>Zip code
                            <Input type="text" value={flatDetail.zip_code} onChange={this.onChangeZipCode}/>
                        </Label>
                    </Col>

                    {isEdit &&
                    <Col>
                        {/*TODO change link*/}
                        <Button href={`/reservations/flat/${flatDetail.id}`} color="success" block size="lg"> Reservations </Button>
                    </Col>
                    }
                    <Col>
                        {/*{!this.validate() && <div className="message">You must fill all fields.</div>}*/}
                    </Col>
                    <Col className='btns'>
                        <FormGroup>
                            <ButtonGroup>
                                <Button className='btn-green-hover'
                                        onClick={() => this.onClickSave(this.props.mode)}> Save </Button>
                                <Button href='/offers' className='btn-green-hover'> Cancel </Button>
                            </ButtonGroup>
                        </FormGroup>
                    </Col>
                </Container>
            </Form>
        );
    }

    onClickSave(mode) {
        // if (this.validate()) {
        const idFlat = (mode === "create") ? Date.now() : this.state.flatDetail.id;
        let base64 = require('base-64');
        let encoded = base64.encode(this.state.selectedFile);
        let imageFile = {id: Date.now(), content: encoded, room_id: idFlat};
        let flat = {...this.state.flatDetail, room_image: imageFile}
        this.setState({flatDetail: flat})
        console.log(imageFile)

        console.log(flat)
        if (mode === "create") {
            flat = {...flat, id: idFlat}

            fetch("http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(flat)
            }).then((res) => {
                console.log(res)
                if (res.status !== 200) {
                    this.setState({
                        error: `Saving returned status ${res.status}`
                    });
                } else {
                    this.props.flatSaved(flat);
                    this.props.history.push("/offers");
                }
            });
        } else {

            fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/flats/${idFlat}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(flat)
            }).then(res => {
                if (res.status !== 200) {
                    this.setState({
                        error: `Updating returned status ${res.status}`
                    });
                } else {
                    this.props.flatUpdated(flat);
                    this.props.history.push("/offers");
                }
            });
        }
        //}
    }

    validate() {
        console.log(!Object.values(this.state.flatDetail).some(x => (x === undefined || x === '')))
        return !Object.values(this.state.flatDetail).some(x => (x === undefined || x === ''));
    }
}

const mapStateToProps = (state) => {
    return {
        flatDetail: state.flatDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    flatDetailLoaded: flatDetail => dispatch(flatDetailLoaded(flatDetail)),
    dispatchUnload: () => dispatch(commonUnloadAction(UNLOAD_FLAT_DETAIL)),
    flatSaved: flatDetail => dispatch(flatSaved(flatDetail)),
    flatUpdated: flatDetail => dispatch(flatUpdated(flatDetail)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(RoomDetail))
