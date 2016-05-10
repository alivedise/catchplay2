import React from 'react';
import ReactDOM from 'react-dom';
export default class BaseClass extends React.Component {
  setHierarchy(active) {
    if (active) {
      ReactDOM.findDOMNode(this).focus();
    }
  };

  handleEvent(evt) {
    if (typeof(this._pre_handleEvent) == 'function') {
      var shouldContinue = this._pre_handleEvent(evt);
      if (shouldContinue === false) {
        return;
      }
    } else {
      this.debug('no handle event pre found. skip');
    }
    if (typeof(this['_handle_' + evt.type]) == 'function') {
      this.debug('handling ' + evt.type);
      this['_handle_' + evt.type](evt);
    }
    if (typeof(this._post_handleEvent) == 'function') {
      this._post_handleEvent(evt);
    }
  }

  open(animation) {
    this.transitionController && this.transitionController.requireOpen(animation);
  }

  close(animation) {
    this.transitionController && this.transitionController.requireClose(animation);
  };

  respondToHierarchyEvent(e) {
    if (this.isActive()) {
      console.log(e.type, 'stoping');
      return false;
    }
    console.log(e.type, 'passing');
    return true;
  };

  _changeState(type, state) {
    ReactDOM.findDOMNode(this).setAttribute(type + '-state', state.toString());
  };


  isActive() {
    return this.transitionController && this.transitionController._transitionState === 'opened';
  };

  publish(event, detail) {
    // Dispatch internal event before external events.
    this.broadcast(event, detail);
    var evt = new CustomEvent(this.EVENT_PREFIX + event,
                {
                  bubbles: true,
                  detail: detail || this
                });

    this.debug('publishing external event: ' + event +
      (detail ? JSON.stringify(detail) : ''));

    ReactDOM.findDOMNode(this).dispatchEvent(evt);
  };

  broadcast(event, detail) {
    // Broadcast internal event.
    if (ReactDOM.findDOMNode(this)) {
      var internalEvent = new CustomEvent('_' + event,
                            {
                              bubbles: false,
                              detail: detail || this
                            });

      //this.debug('publishing internal event: ' + event);
      ReactDOM.findDOMNode(this).dispatchEvent(internalEvent);
    }
  };


  debug() {
    if (this.DEBUG) {
      console.log('[' + this.name + ']' +
        '[' + Service.currentTime() + '] ' +
          Array.slice(arguments).concat());
      if (this.TRACE) {
        console.trace();
      }
    } else if (window.DUMP) {
      DUMP('[' + this.name + ']' +
        '[' + Service.currentTime() + '] ' +
          Array.slice(arguments).concat());
    }
  };
}