import React from 'react';

/**
 * withModel
 */
export function withModel(WrappedComponent, modelFactory) {
  // WithModel
  class WithModel extends React.Component {

    constructor(props) {
      super(props);
      // New model instance
      this.model = modelFactory(props);
    }

    render() {
      return (
        <WrappedComponent
          model={this.model}
          {...this.props}
        />
      );
    }

  }
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithModel.displayName = `WithModel(${displayName})`;
  return WithModel;
}

/**
 * withController
 */
export function withController(WrappedComponent, controllerFactory) {
  // WithController
  class WithController extends React.Component {

    constructor(...args) {
      super(...args);
      this._viewRef = React.createRef();
    }

    get model() {
      return (this.view && this.view.model) || this.props.model;
    }

    get view() {
      return this._viewRef.current;
    }

    render() {
      return (
        <WrappedComponent
          ref={this._viewRef}
          {...this.props}
        />
      );
    }

    componentDidMount() {
      if (controllerFactory) {
        this.controller = controllerFactory(this);
      }
    }

    componentWillUnmount() {
      if (this.controller) {
        if (typeof this.controller.dispose === 'function') {
          this.controller.dispose();
        }
        delete this.controller;
      }
    }

  }
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  WithController.displayName = `WithController(${displayName})`;
  return WithController;
}
