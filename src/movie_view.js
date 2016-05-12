import React from 'react';
import ReactDOM from 'react-dom';
import BaseClass from 'base_class';
import MovieStore from 'movie_store';
import Service from 'service';

export default class MovieView extends BaseClass {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      img: '',
      actors: [],
      director: '',
      outline: '',
      id: ''
    }
  };

  componentDidMount() {
    MovieStore.get(this.props.id).then((result) => {
      this.setState(result);
    });
  };

  render() {
    return <div className="movie-item">
            <img src={this.state.img} />
            <div className="name">{this.state.name}</div>
           </div>
  }
};

MovieView.defaultProps = {
  id: ''
};