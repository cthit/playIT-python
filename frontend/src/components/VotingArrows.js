import React from "react";

const VotingArrows = ({ value, user_vote, onUpvote, onDownvote }) => (
  <div className="vote">
      <span className={"upvote vote-arrow" + (user_vote === 1 ? ' upvoted' : '')} onClick={user_vote === 1 ? null : onUpvote}>
        <i className="fa fa-arrow-up"></i>
      </span>
      <span className="rating">{value}</span>
      <span className={"downvote vote-arrow" + (user_vote === -1 ? ' downvoted' : '')} onClick={user_vote === -1 ? null : onDownvote}>
        <i className="fa fa-arrow-down"></i>
      </span>
  </div>
)

VotingArrows.propTypes = {
  value: React.PropTypes.number.isRequired,
  user_vote: React.PropTypes.number,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired
}


export default VotingArrows
