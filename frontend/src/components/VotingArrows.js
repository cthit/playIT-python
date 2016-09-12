import React from "react";
import classNames from "classnames";

const VotingArrows = ({ value, user_vote, onUpvote, onDownvote }) => (
  <div className="vote">
      <div className={classNames("upvote", "vote-arrow", {upvoted: user_vote === 1})} onClick={user_vote === 1 ? null : onUpvote}>
        <i className="fa fa-arrow-up"></i>
      </div>
      <div className="rating">{value}</div>
      <div className={classNames("downvote", "vote-arrow", {downvoted: user_vote === -1})} onClick={user_vote === -1 ? null : onDownvote}>
        <i className="fa fa-arrow-down"></i>
      </div>
  </div>
)

VotingArrows.propTypes = {
  value: React.PropTypes.number.isRequired,
  user_vote: React.PropTypes.number,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired
}


export default VotingArrows
