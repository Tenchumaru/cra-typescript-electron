import React from 'react';
import ReactDOM from 'react-dom';
import { mount, shallow } from 'enzyme';
import { Hello } from './Hello';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hello name="test" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('shallow-renders without crashing', () => {
  shallow(<Hello name="test" />);
});

it('mounts without crashing', () => {
  mount(<Hello name="test" />);
});
