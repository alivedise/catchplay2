import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import ShadowWindow from 'shadow_window';

export default class XWindow extends BaseClass {
	getChildContext() {
    return {
      transition: this.state.transition,
      hidden: this.state.transition === 'opened',
      isHidden: this.isHidden.bind(this)
    };
	};
	isHidden() {
		return this.state.transition === 'opened';
	};
  constructor(props) {
    super(props);
    this.state = {
			transition: 'closed',
			animation: 'immediate'
    }
  };
	isActive() {
		return this.state.transition === 'opened' ||
					 this.state.transition === 'opening';
	};
	isTransitioning() {
		return this.state.transition === 'opening' ||
					 this.state.transition === 'closing';
	};
	onAnimationEnd() {
		switch (this.state.transition) {
			case 'opening':
				this.setState({transition: 'opened', animation: ''});
				break;
			case 'closing':
				this.setState({transition: 'closed', animation: ''});
				break;
		}
	};
	componentDidMount() {
		ReactDOM.findDOMNode(this).addEventListener('animationend', this.onAnimationEnd.bind(this), false);
	};
	componentDidUpdate() {
		var xDocument = ReactDOM.findDOMNode(this.refs.document);
		var xWindow = this.refs.document;
		if (!xDocument) {
			return;
		}
		if (this.state.transition === 'opened') {
			this.debug('focusing inner content');
			xDocument.focus && xDocument.focus();
		} else if (this.state.transition === 'closing') {
			xWindow.blur && xWindow.blur();
		}
	};
	shouldComponentUpdate(nextProps, nextState) {
		return (nextState.transition !== this.state.transition) ||
					 (nextState.animation !== this.state.animation) ||
					 (nextProps.url !== this.props.url);
	};
	/**
	 * Public open method. This will be used by the WindowManager.
	 * @param  {String} [animation] The className of the open animation.
	 */
	open(animation) {
		this.debug('opening animation:', animation, this.state.transition);
		switch (this.state.transition) {
			case 'opened':
			case 'opening':
			case 'closing':
				break;
			case 'closed':
				if ('immediate' === animation || !animation) {
					this.setState({transition: 'opened', animation: ''});
				} else {
					this.setState({transition: 'opening', animation: animation});
				}
				break;
		}
	};
	/**
	 * Public close method. This will be used by the WindowManager.
	 * @param  {String} [animation] The className of the close animation.
	 */
	close(animation) {
		this.debug('closing animation:', animation, this.state.transition);
		switch (this.state.transition) {
			case 'closed':
			case 'opening':
			case 'closing':
				break;
			case 'opened':
				if ('immediate' === animation || !animation) {
					this.setState({transition: 'closed', animation: ''});
				} else {
					this.setState({transition: 'closing', animation: animation});
				}
				break;
		}
	};
	render() {
		var child = this.props.children;
		var xchild = React.cloneElement(child, {ref: 'document', key: 'document'});
		return <div id={this.props.url + '-window'} tabIndex="-1" className={"x-window " + this.state.animation} data-transition-state={this.state.transition}>
						<ShadowWindow ref='shadow' key={this.props.url + '-shadow-window'} transition={this.state.transition} animation={this.state.animation}>{xchild}</ShadowWindow>
					 </div>;
	}
};

XWindow.childContextTypes = {
  transition: React.PropTypes.string,
  hidden: React.PropTypes.bool,
  isHidden: React.PropTypes.func
};
