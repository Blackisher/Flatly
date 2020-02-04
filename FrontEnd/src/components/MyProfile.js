import React, {Component} from 'react';
import "../css/MyProfile.css";
import {Row, Input, Button, FormGroup, Label}
    from 'reactstrap';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {userDetailLoaded} from "../redux/actions/usersActions";

import {idUser} from "./AuthHelperMethods"

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.state =  {
            userDetail: {
                id: undefined,
                login: "",
                password: "",
                first_name: "",
                last_name: ""
            }
        };
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleSurnameChange = this.handleSurnameChange.bind(this);
        this.changeUserInfo = this.changeUserInfo.bind(this);
    }

    componentDidMount() {
        const passwordHash = require('password-hash');
        const hashedPassword = passwordHash.generate('password123');
        console.log(hashedPassword);

        fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/users/${idUser}`)
            .then((data) => data.json())
            .then((users) => {
                this.props.userDetailLoaded(users);
            })
            .then(() => { this.setState({userDetail: this.props.userDetail});
            });
    }

    render() {
        return (
            <form className='form'>
                {this.state.userDetail &&
                <>
                    <FormGroup>
                        <h2 className='nameOfPage'>
                            My profile
                        </h2>
                    </FormGroup>
                    <Row form>
                        <FontAwesomeIcon className='icon-user' icon={faUser}/>
                        <Label>
                            <br/>
                            Login: { this.state.userDetail.login}
                        </Label>
                    </Row>
                    <FormGroup>
                        <Label>First name
                            <Input type="text" value={ this.state.userDetail.first_name} onChange={this.handleNameChange}/>
                        </Label>
                    </FormGroup>
                    <FormGroup>
                        <Label>Last name
                            <Input type="text" value={ this.state.userDetail.last_name} onChange={this.handleSurnameChange}/>
                        </Label>
                    </FormGroup>
                    <FormGroup className='btns'>
                        <Button className='btn-green-hover' onClick={this.changeUserInfo}> Change </Button>
                    </FormGroup>
                </>
                    }
            </form>

        )
    }

    handleNameChange(e) {
        this.setState({userDetail :
                {...this.state.userDetail, first_name: e.target.value}});
    }

    handleSurnameChange(e) {
        this.setState({userDetail :
                {...this.state.userDetail, last_name: e.target.value}});
    }

    changeUserInfo() {
        console.log(this.state.userDetail);
        //http://flatly-thursday.us-east-1.elasticbeanstalk.com/users/1
        fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/users/${idUser}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(this.state.userDetail)
        }).then(res => {
            console.log(res)
        });
    }
}

const mapStateToProps = (state) => {
    return {
        userDetail: state.userDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    userDetailLoaded: userDetail => dispatch(userDetailLoaded(userDetail))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(MyProfile))
