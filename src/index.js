import React from 'react';
// import ReactDOM from 'react-dom';
// import List from './list';
import ReactDOM from './react-dom'
import Component from './Component'
import './index.css'

class ClassComponent extends Component {
  render() {
    return (
      <div className="box">
        <p>{this.props.name}</p>
      </div>
    );
  }
}
function FunctionComponent(props) {
  return (
    <div className="box">
      <p>{props.name}</p>
    </div>
  );
}

const JSX = (
  <div className='box'>
    <h1>飞雪连天射白鹿，笑书神侠倚碧鸳</h1>
    <a href='https://juejin.cn/post/6995918802546343973' >my world</a>
    <FunctionComponent name='函数组件' />
    {/*  <ClassComponent name='类组件'/> */}
  </div>
)

ReactDOM.render(
  JSX,
  document.getElementById('root')
);

