import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import lodashUniq from 'lodash.uniq';

import './style.scss';

const ESC_KEY = 27;

// No jquery dependency. Prevents eslint errors.
const $ = {};

/**
 * CommentListContainer
 */
export default class CommentListContainer extends React.Component {

  constructor(props) {
    super(props);
    // State
    this.state = { comments: [] };
    // Binds
    this.onAuthorFilterChange = this.onAuthorFilterChange.bind(this);
    this.onAuthorFilterKeyDown = this.onAuthorFilterKeyDown.bind(this);
  }

  get authors() {
    return lodashUniq(this.state.comments.map(c => c.author)).sort();
  }

  get filteredComments() {
    if (this.state.selectedAuthor) {
      return this.state.comments.filter(c => c.author === this.state.selectedAuthor);
    }
    return this.state.comments;
  }

  loadComments(url) {
    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        dataType: 'json',
        success: comments => { resolve(comments); }
      });
    });
  }

  render() {
    const { ...restProps } = this.props;
    restProps.className = classNames('comments', restProps.className);
    return (
      <div {...restProps}>
        <div className="control-bar">
          <select
            value={this.state.selectedAuthor || ''}
            onChange={this.onAuthorFilterChange}
            onKeyDown={this.onAuthorFilterKeyDown}
          >
            <option value="">--- Filter author ---</option>
            {this.authors.map(author => (
              <option key={author}>{author}</option>
            ))}
          </select>
        </div>
        <CommentList comments={this.filteredComments} />
      </div>
    );
  }

  componentDidMount() {
    this.loadComments(this.props.url).then((comments) => {
      this.setState({ comments });
    });
  }

  onAuthorFilterChange(event) {
    this.setState({ selectedAuthor: event.target.value });
  }

  onAuthorFilterKeyDown(event) {
    if (event.keyCode === ESC_KEY) {
      this.setState({ selectedAuthor: undefined });
    }
  }

}
CommentListContainer.propTypes = {
  url: PropTypes.string
};

/**
 * CommentList
 */
export function CommentList(props) {
  const { comments, ...restProps } = props;
  restProps.className = classNames('comment-list', restProps.className);
  return (
    <ul {...restProps}>
      {comments.map(comment => (
        <li
          key={comment.id}
          data-id={comment.id}
          className="comment"
          tabIndex="0"
        >
          <span className="body">{comment.body}</span>
          <strong className="author">{comment.author}</strong>
        </li>
      ))}
    </ul>
  );
}
CommentList.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    body: PropTypes.string,
    author: PropTypes.string
  })).isRequired
};
