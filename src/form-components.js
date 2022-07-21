import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

/**
 * AbstractInput
 */
export class AbstractInput extends React.Component {

  constructor(props, ...args) {
    super(props, ...args);
    this.state = {};
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.value !== nextProps.value) {
      this.setState({ value: nextProps.value });
    }
  }

  onChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    this.setState({ value: event.target.value });
  }

}

/**
 * FormTextInput
 */
export class FormTextInput extends AbstractInput {

  render() {
    const { value, ...attrs } = this.props;
    attrs.className = classNames('form-control', attrs.className);
    return (
      <input
        value={value}
        {...attrs}
        {...this.state}
        onChange={this.onChange}
      />
    );
  }

}
FormTextInput.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};
FormTextInput.defaultProps = {
  value: '',
  type: 'text'
};

/**
 * FormPasswordInput
 */
export function FormPasswordInput(props) {
  return (
    <FormTextInput
      {...props}
      type="password"
    />
  );
}

/**
 * FormCheckbox
 */
export class FormCheckbox extends AbstractInput {

  render() {
    const { children, checked, labelProps, inputProps, ...attrs } = this.props;
    attrs.className = classNames('checkbox', attrs.className);
    return (
      <div {...attrs}>
        <label {...labelProps}>
          <input
            type="checkbox"
            checked={checked}
            onChange={this.onChange}
            {...inputProps}
          />
          {children}
        </label>
      </div>
    );
  }

}
FormCheckbox.propTypes = {
  children: PropTypes.node,
  checked: PropTypes.bool,
  labelProps: PropTypes.object,
  inputProps: PropTypes.object
};
FormCheckbox.defaultProps = {
  labelProps: {},
  inputProps: {}
};

/**
 * FormSelect
 */
export class FormSelect extends AbstractInput {

  render() {
    const { value, children, ...attrs } = this.props;
    attrs.className = classNames('form-select', attrs.className);
    return (
      <select
        value={value}
        {...attrs}
        {...this.state}
        onChange={this.onChange}
      >
        {children}
      </select>
    );
  }

}
FormSelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  children: PropTypes.node
};
FormSelect.defaultProps = {
  value: ''
};
