import React from 'react';
import ReactDOM from 'react-dom';
import MovieList from 'movie_list';
import MovieView from 'movie_view';
import FavoriteView from 'favorite_view';
import BaseClass from 'base_class';
import XWindow from 'x_window';
import router from 'router';
import Service from 'service';

export default class App extends BaseClass {
  DEBUG = true;
  name = 'App';
  componentDidMount() {
    router.addRoute('', function() {
      this.debug('default');
      router.load('all');
    }.bind(this));
    router.addRoute('all', function() {
      this.debug('all');
      this.openXWindow(<MovieList key="movieList" />);
    }.bind(this));
    router.addRoute('favorite', function() {
      this.debug('favorite');
      this.openXWindow(<FavoriteView key="favoriteView" />);
    }.bind(this));
    router.addRoute('movie/:id', function(id) {
      this.debug('movie');
      this.openXWindow(<MovieView key="movie" id={id} />);
    }.bind(this));
    router.start();

    window.app = this;
  }

  constructor(props) {
    super(props);
    Service.registerState('isTransitioning', this);
    this.PREDEFINED_ORDERING = ['inbox', 'compose' , 'thread', 'message', 'report'];
    this.state = {
      history: [],
      page: null,
      currentIndex: -1,
      lastIndex: -1
    }
  };

  isForward(a, b) {
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
  };
  isTransitioning() {
    return this.animating;
  };
  onAnimationEnd() {
    this.animating = false;
  };
  onAnimationStart() {
    this.animating = true;
  };
  componentDidUpdate(prop, state) {
    // Debug purpose.
    this.debug('updated', prop, state);
    if (!this.binded) {
      this.binded = true;
      ReactDOM.findDOMNode(this).addEventListener('animationend', this.onAnimationEnd, false);
    }

    var openingTransition = 'immediate';
    var closingTransition = 'immediate';

    var currentHandler = this.state.history[this.state.lastIndex];
    var handler = this.getHandlerByHash();
    var isForward = this.isForward(currentHandler, handler);

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
  };

  openXWindow(page) {
    this.setState({
      page: page
    });
  };
  onChange() {

  };
  render() {
    this.debug('rendering', this.state.pages);
    // React prevents us to add ref when not calling render(),
    // so we need to clone and add the ref here.
    // var refPages = this.state.pages.map(function(page) {
    //  return <XWindow key={page.key + '-window'} ref={page.key} url={page.key}>{page}</XWindow>
    // }, this);
    var refPages;
    if (this.state.page) {
      refPages = <XWindow key={this.state.page.key + '-window'} ref={this.state.page.key} url={this.state.page.key}>{this.state.page}</XWindow>
    }
    this.debug('before rendering...');
    var fakekey = '';
    return (
        <div className={"x-window-container " + (this.slowAnimation ? 'slow-animation' : '')} ref="element">
          <div>
            <a href="#all">All</a>
            <a href="#favorite">Favorite</a>
            <div className="search-bar">
              <input type="text" onChange={(evt) => this.onChange(evt)} />
            </div>
          </div>
          {refPages}
        </div>
    );
  }
};


ReactDOM.render(<App />, document.getElementById('root'));
