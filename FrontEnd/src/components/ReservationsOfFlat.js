import React from 'react';
import '../css/ListOfReservations.css'
import {connect} from "react-redux";
import {withRouter} from "react-router";
import ListOfReservations from "./ListOfReservations";
import {bookingsLoaded} from "../redux/actions/bookingsActions";

class ReservationsOfFlat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idFlat : null
        }
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        this.setState({idFlat: id});
        console.log(id)
        //http://flatly-thursday.us-east-1.elasticbeanstalk.com/bookings/flat/1
        fetch(`http://flatly-thursday.us-east-1.elasticbeanstalk.com/bookings/flat/${id}`)
            .then((data) => data.json())
            .then((reservations) => {
                console.log(reservations)
                this.props.bookingsLoaded(reservations);
            });
    }

    render() {
        const bookings = this.props.bookings;
        let idFlat = this.state.idFlat;
        return (
            <div>
                {bookings && <ListOfReservations reservations={bookings} forCurrentFlat={1} nameOfFlat={idFlat}/>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        bookings: state.bookings
    }
};

const mapDispatchToProps = (dispatch) => ({
    bookingsLoaded: bookings => dispatch(bookingsLoaded(bookings)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReservationsOfFlat))
