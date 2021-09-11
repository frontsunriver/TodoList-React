import React from 'react';

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      text: '',
      inputValue: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(value) {
    this.setState({
      inputValue: value,
    });
  }

  handleClick() {
    this.setState({
      text: this.state.inputValue,
      inputValue: '',
    });
  }

  render() {
    return (
      <div className={this.state.text}>
        <Title text={this.state.text} />
        <Input handleChange={this.handleChange} value={this.state.inputValue} />
        <Button handleClick={this.handleClick} />
      </div>
    );
  }
}

export const Title = (props) => {
  return(
    <h1>Hello { props.text }</h1>
  );
}

export const Input = (props) => {
  function handleChange(event) {
    props.handleChange(event.target.value);
  }

  return (
    <input onChange={handleChange} value={props.value} />
  );
}

export const Button = (props) => {
  const handleClick = () => {
    props.handleClick();
  }
  return (
    <button onClick={handleClick}>送信</button>
  );
}
