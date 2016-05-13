/* global Service, React */

var PageSlider = {
  slowAnimation: false,
  getInitialState: function () {
    Service.registerState('isTransitioning', this);
    this.animating = false;
    this.PREDEFINED_ORDERING = ['inbox', 'compose' , 'thread', 'message', 'report'];
    return {
      history: [],
      pages: [],
      currentIndex: -1,
      lastIndex: -1
    }
  },
  isForward: function(a, b) {
    if (!a) {
      return false;
    }
    if (b === 'compose') {
      return true;
    } else if (this.PREDEFINED_ORDERING.indexOf(a) > this.PREDEFINED_ORDERING.indexOf(b)) {
      return false;
    } else {
      return true;
    }
  },
  isTransitioning: function() {
    return this.animating;
  },
  onAnimationEnd: function() {
    this.animating = false;
  },
  onAnimationStart: function() {
    this.animating = true;
  },
  componentDidUpdate: function(prop, state) {
    // Debug purpose.
    this.debug('updated', prop, state);
    if (!this.binded) {
      this.binded = true;
      this.getDOMNode().addEventListener('animationend', this.onAnimationEnd, false);
    }

    var openingTransition = 'immediate';
    var closingTransition = 'immediate';

    var currentHandler = this.state.history[this.state.lastIndex];
    var handler = this.getHandlerByHash();
    var isForward = this.isForward(currentHandler, handler);
    if (this.state.pages.length > 1) {
      openingTransition = isForward ? 'right-to-center' : 'left-to-center';
      closingTransition = isForward ? 'center-to-left' : 'center-to-right';
    }

    this.debug(openingTransition, closingTransition);
    window.requestAnimationFrame(function() {
      this.debug('RAF');
      if (this.state.history.length > 1) {
        var currentHandler = this.state.history[this.state.lastIndex];
        if (this.refs[currentHandler] && this.refs[currentHandler].isActive() && currentHandler !== handler) {
          this.refs[currentHandler].close(closingTransition);
          this.refs[handler] && this.refs[handler].open(openingTransition);
          return;
        }
      }
      this.refs[handler] && this.refs[handler].open(openingTransition);
    }.bind(this));
  },

  openXWindow: function(page) {
    var pages = this.state.pages;
    var history = this.state.history;
    var index = 0;
    var currentIndex = this.state.currentIndex;
    var pageAlreadyCreated = pages.some(function(existingPage, id) {
      if (existingPage.key === page.key) {
        this.debug('page existing');
        index = id;
        return true;
      } else {
        return false;
      }
    }, this);

    if (pageAlreadyCreated) {
      pages[index] = page;
      this.setState({currentIndex: index, lastIndex: currentIndex, pages: pages});
      return;
    }

    pages.push(page);
    history.push(page.key);
    index = currentIndex;
    currentIndex = pages.length - 1;
    this.setState({currentIndex: currentIndex, lastIndex: index, pages: pages, history: history});
  },
  render: function () {
    this.debug('rendering', this.state.pages);
    // React prevents us to add ref when not calling render(),
    // so we need to clone and add the ref here.
    var refPages = this.state.pages.map(function(page) {
      return <XWindow key={page.key + '-window'} ref={page.key} url={page.key}>{page}</XWindow>
    }, this);
    this.debug('before rendering...');
    var fakekey = '';
    if (!ScreenLayout.isOnRealDevice()) {
      //fakekey = <FakeSoftkey/>;
    }
    return (
        <div className={"x-window-container " + (this.slowAnimation ? 'slow-animation' : '')} ref="element">
          {refPages}
          {fakekey}
          <ToastManager />
          <LoadingScreen/>
        </div>
    );
  }
};
