import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import lodashUniq from 'lodash.uniq';
import ElementController from 'element-controller';
import { Model } from 'mozy';

import { withModel, withController } from './mvc-hoc';
import { FormSelect } from './form-components';
import mockComments from './comments.json';
import './style.scss';

const ESC_KEY = 27;

// No jquery dependency. Prevents eslint errors.
const $ = {};

/**
 * CommentListController
 */
export class CommentListController extends ElementController {

  constructor(component) {
    // Pass HTMLElement to super
    super(ReactDOM.findDOMNode(component));
    // component ref
    this.component = component;
    // Load comments
    this.loadComments(this.component.props.url).then(comments => {
      this.model.comments = comments;
    });
  }

  get model() {
    return this.component.model || this.component.props.model;
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

  getDOMEventHandlerStrings() {
    return [
      'click .comment > .author: onCommentAuthorClick',
      'change .filter-author: onAuthorFilterChange',
      'keydown .filter-author: onAuthorFilterKeyDown'
    ];
  }

  onCommentAuthorClick(event) {
    this.model.selectedAuthor = event.target.innerText;
  }

  onAuthorFilterChange(event) {
    this.model.selectedAuthor = event.target.value;
  }

  onAuthorFilterKeyDown(event) {
    if (event.keyCode === ESC_KEY) {
      this.model.selectedAuthor = undefined;
    }
  }

}

/**
 * MockCommentListController
 */
export class MockCommentListController extends CommentListController {

  loadComments(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(mockComments);
      }, 2000);
    });
  }

}

/**
 * CommentListControlbar
 */
export function CommentListControlbar(props) {
  const { authors, selectedAuthor, ...restProps } = props;
  restProps.className = classNames('control-bar', restProps.className);
  return (
    <div {...restProps}>
      <FormSelect
        className="filter-author d-inline-block w-auto"
        value={selectedAuthor || ''}
      >
        <option value="">--- Filter author ---</option>
        {authors.map(author => (
          <option key={author}>{author}</option>
        ))}
      </FormSelect>
    </div>
  );
}
CommentListControlbar.propTypes = {
  authors: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedAuthor: PropTypes.string
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

/**
 * CommentListView
 */
export class CommentListView extends React.Component {

  constructor(...args) {
    super(...args);
    // Bind
    this.onModelChange = this.onModelChange.bind(this);
  }

  render() {
    const { model, url, ...restProps } = this.props;
    restProps.className = classNames('comments', restProps.className);
    return (
      <div {...restProps}>
        <CommentListControlbar
          authors={model.authors}
          selectedAuthor={model.selectedAuthor}
        />
        <CommentList comments={model.filteredComments} />
      </div>
    );
  }

  componentDidMount() {
    this.props.model
      .addListener('change comments', this.onModelChange)
      .addListener('change selectedAuthor', this.onModelChange);
  }

  componentWillUnmount() {
    this.props.model.removeListeners();
  }

  onModelChange() {
    this.setState({});
  }

}
CommentListView.propTypes = {
  model: PropTypes.shape({
    filteredComments: PropTypes.array,
    authors: PropTypes.array,
    selectedAuthor: PropTypes.string,
    addListener: PropTypes.func,
    removeListener: PropTypes.func
  }),
  url: PropTypes.string
};

/**
 * CommentListModel
 */
export class CommentListModel extends Model {

  get comments() {
    return this.get('comments');
  }
  set comments(value) {
    this.set('comments', value);
  }

  get filteredComments() {
    if (this.selectedAuthor) {
      return this.comments.filter(c => c.author === this.selectedAuthor);
    }
    return this.comments;
  }

  get selectedAuthor() {
    return this.get('selectedAuthor');
  }
  set selectedAuthor(value) {
    this.set('selectedAuthor', value);
  }

  get authors() {
    return lodashUniq(this.comments.map(c => c.author)).sort();
  }

  _getDefaults(...args) {
    return Object.assign(super._getDefaults(...args), {
      comments: []
    });
  }

}

// CommentListContainer
export const CommentListContainer = withController(
  withModel(CommentListView, () => new CommentListModel()),
  comp => new MockCommentListController(comp)
);
CommentListContainer.displayName = 'CommentListContainer';

export { CommentListContainer as default };
