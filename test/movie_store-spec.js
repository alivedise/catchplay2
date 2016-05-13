import test from 'ava';
import React from 'react';
import { shallow } from 'enzyme';
import MovieStore from '../src/movie_store';

test('getAll', t => {
  MovieStore._map = ['a', 'b', 'c']
  t.deepEqual(MovieStore.getAll(), ['a', 'b', 'c']);
});
