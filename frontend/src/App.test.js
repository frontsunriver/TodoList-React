import React from 'react';
import ReactDOM from 'react-dom';
import { App, Title, Input, Button } from './App2';
import  { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

/**
 * Appコンポーネントのテスト
 */
describe('<App />', () => {
  it('子コンポーネントが存在すること', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Title).length).toBe(1);
    expect(wrapper.find(Input).length).toBe(1);
    expect(wrapper.find(Button).length).toBe(1);
  });

  it('this.state.textを更新した時にclass名に反映されること', () => {
    const wrapper = shallow(<App />);
    wrapper.setState({
      text: 'AAA',
    });
    expect(wrapper.find('.AAA').length).toBe(1);
  });

  it('handleChangeを呼び出すと、setStateが呼び出されること', () => {
    const wrapper = shallow(<App />);
    const setStateSpy = jest.spyOn(App.prototype, 'setState');
    wrapper.instance().handleChange('BBB');
    expect(setStateSpy).toHaveBeenCalledWith({
      inputValue: 'BBB',
    });
  });

  it('handleClickを呼び出すと、setStateが呼び出されること', () => {
    const wrapper = shallow(<App />);
    const setStateSpy = jest.spyOn(App.prototype, 'setState');
    wrapper.setState({
      inputValue: 'CCC',
    });
    wrapper.instance().handleClick();
    expect(setStateSpy).toHaveBeenCalledWith({
      text: 'CCC',
      inputValue: '',
    });
  });

  test('<App />のスナップショット', () => {
    const tree = renderer
      .create(<App />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

/**
 * Titleコンポーネントのテスト
 */
describe('<Title />', () => {
  it('h1要素が存在すること', () => {
    const wrapper = shallow(<Title text={'React'} />);
    expect(wrapper.find('h1').length).toBe(1);
  });

  it('受け取ったpropsの値を表示すること', () => {
    const wrapper = shallow(<Title text={'React'} />);
    expect(wrapper.text()).toBe('Hello React');
    wrapper.setProps({ text: 'World' });
    expect(wrapper.text()).toBe('Hello World');
  });

  test('<Title />のスナップショット', () => {
    const tree = renderer
      .create(<Title text={'React'} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

/**
 * Inputコンポーネントのテスト
 */
describe('<Input />', () => {
   it('input要素が存在すること', () => {
    const wrapper = shallow(<Input />);
    expect(wrapper.find('input').length).toBe(1);
  });

  it('changeイベント発火時にコールバック関数が呼び出されること', () => {
    const handleChangeSpy = jest.fn();
    const wrapper = shallow(<Input handleChange={handleChangeSpy} />);

    const event = { target: { value: 'aaa' } };
    wrapper.find('input').simulate('change', event);
    expect(handleChangeSpy).toHaveBeenCalledWith('aaa');
  });

  test('<Input />のスナップショット', () => {
    const handleChangeSpy = jest.fn();
    const value = 'XXX';
    const tree = renderer
      .create(<Input onChange={handleChangeSpy} value={value} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

/**
 * Buttonコンポーネントのテスト
 */
describe('<Button />', () => {
  it('button要素が存在すること', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper.find('button').length).toBe(1);
  });
  
  it('clickイベント発火時にコールバック関数が呼び出されること', () => {
    const handleClickSpy = jest.fn();
    const wrapper = shallow(<Button handleClick={handleClickSpy} />);
    wrapper.find('button').simulate('click');
    expect(handleClickSpy).toHaveBeenCalled();
  });

  test('<Button />のスナップショット', () => {
    const handleClickSpy = jest.fn();
    const tree = renderer
      .create(<Button handleClick={handleClickSpy} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
