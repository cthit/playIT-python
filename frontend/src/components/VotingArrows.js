import React from "react";

const getVoteValue = (upvoted, downvoted) => {
  if (upvoted || downvoted) {
    return upvoted ? 1 : -1
  } else {
    return 0
  }
}

const VotingArrows = ({ value, upvoted, downvoted, onUpvote, onDownvote }) => (
  <div className="vote">
      <span className={"upvote vote-arrow" + (upvoted ? ' upvoted' : '')} onClick={onUpvote}>
        <i className="fa fa-arrow-up"></i>
      </span>
      <span className="rating">{value + getVoteValue(upvoted, downvoted)}</span>
      <span className={"downvote vote-arrow" + (downvoted ? ' downvoted' : '')} onClick={onDownvote}>
        <i className="fa fa-arrow-down"></i>
      </span>
  </div>
)

VotingArrows.propTypes = {
  value: React.PropTypes.number.isRequired,
  upvoted: React.PropTypes.bool,
  downvoted: React.PropTypes.bool,
  onUpvote: React.PropTypes.func.isRequired,
  onDownvote: React.PropTypes.func.isRequired
}


export default VotingArrows
