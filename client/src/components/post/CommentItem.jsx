import React, { Component } from 'react'
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { deleteComment } from '../../providers/actions/postActions';

class CommentItem extends Component {
    onDelete(postId, commentId) {
        this.props.deleteComment(postId, commentId);
    }
    render() {
        const { comment, postId, auth } = this.props;

        return (
            <div className="card card-body mb-3">
                <div className="row">
                    <div className="col-md-2">
                        <Link to="profile.html">
                            <img src={comment.avatar} alt="" className="rounded-circle d-none d-md-block" />
                        </Link>
                        <br />
                        <p className="text-center">{comment.name}</p>
                    </div>
                    <div className="col-md-10">
                        <p className="lead">{comment.text}</p>
                        {
                            comment.user.toString() === auth.user._id ? (
                                <button onClick={this.onDelete.bind(this, postId, comment._id)} type="button" className="btn btn-danger mr-1">
                                    <i className="fas fa-times" />
                                </button>
                            ) : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

CommentItem.propTypes = {
    deleteComment: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired,
    postId: PropTypes.string.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);