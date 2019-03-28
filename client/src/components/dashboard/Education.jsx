import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import { deleteEdu } from '../../providers/actions/profileActions';

class Education extends Component {
    onDelete(id) {
        this.props.deleteEdu(id);
    }
    render() {
        const education = this.props.education.map(edu => (
            <tr key={edu._id}>
                <td>{edu.school}</td>
                <td>{edu.degree}</td>
                <td>
                    <Moment format="DD/MM/YYYY">{edu.from}</Moment> - {' '}
                    {
                        edu.to === null ? ('Now') : <Moment format="DD/MM/YYYY">{edu.to}</Moment>
                    }
                </td>
                <td>
                    <button
                        className="btn btn-danger btn-md"
                        onClick={this.onDelete.bind(this, edu._id)}
                    >Delete</button>
                </td>
            </tr>
        )
        );

        return (
            <div>
                <h4 className="mb-4">Education</h4>
                <table className="table">
                    <thead>
                        <tr>
                            <th>School</th>
                            <th>Degree/Certificate</th>
                            <th>Years</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {education}
                    </tbody>
                </table>
            </div>
        )
    }
}

Education.propTypes = {
    deleteEdu: PropTypes.func.isRequired
}

export default connect(null, { deleteEdu })(Education);