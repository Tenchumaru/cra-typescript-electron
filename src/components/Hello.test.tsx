import React from 'react';
import ReactDOM from 'react-dom';
import Hello from './Hello';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Hello name="test" />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('shallow-renders without crashing', () => {
  const wrapper = shallow(<Hello name="test" />);
});
