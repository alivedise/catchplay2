import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';

export default class ShadowWindow extends BaseClass {
  _DEBUG = true;
  isOpening(nextProps) {
    var props = nextProps || this.props;
    return props.transition === 'opening' ||
           (props.transition === 'opened' && props.animation === 'immediate');
  };
  isClosed(nextProps) {
    var props = nextProps || this.props;
    return props.transition === 'closed';
  };
  shouldComponentUpdate(nextProps, nextState) {
    this.debug(nextProps.transition);
    // We are the gap river between XWindow and the content.
    // We will never update whenever XWindow got updated by the XWindowManager.
    if (this.props.children.type.displayName !== 'Inbox' &&
        this.isOpening(nextProps)) {
      this.debug('inbox or opening, will update!');
      return true;
    } else {
      return false;
    }
  };
  render() {
    return <div className="shadow-window">{this.props.children}</div>;
  }
};

ShadowWindow.propTypes = {
  transition: React.PropTypes.string,
  animation: React.PropTypes.string
};
ShadowWindow.defaultProps = { 
  transition: '',
  animation: ''
};
