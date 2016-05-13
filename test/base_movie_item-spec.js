import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import BaseMovieItem from '../src/base_movie_item';

test('render with container div', t => {
  const wrapper = shallow(React.createElement(BaseMovieItem));

  t.is(wrapper.find('.movie-item').length, 1);
});

test('render with props assigned', t => {
  const wrapper = shallow(React.createElement(BaseMovieItem, {
    name: 'test',
    img: 'where',
    favorite: true,
    id: 'fake'
  }));

  t.is(wrapper.find('.name a').text(), 'test');
});
