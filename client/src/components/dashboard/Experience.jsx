import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteExp } from '../../providers/actions/profileActions';

class Experience extends Component {
    onDelete(id) {
        this.props.deleteExp(id);
    }
    render() {
        const experience = this.props.experience.map(exp => (
            <tr key={exp._id}>
                <td>{exp.company}</td>
                <td>{exp.title}</td>
                <td>
                    <Moment format="DD/MM/YYYY">{exp.from}</Moment> - {' '}
                    {
                        exp.to === null ? ('Now') : <Moment format="DD/MM/YYYY">{exp.to}</Moment>
                    }
                </td>
                <td>
                    <button
                        className="btn btn-danger btn-md"
                        onClick={this.onDelete.bind(this, exp._id)}
                    >Delete</button>
                </td>
            </tr>
        )
        );

        return (
            <div>
                <h4 className="mb-4">Experiences</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Company</th>
                            <th>Title</th>
                            <th>Years</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {experience}
                    </tbody>
                </table>
            </div>
        )
    }
}

Experience.propTypes = {
    deleteExp: PropTypes.func.isRequired
}

export default connect(null, { deleteExp })(Experience);