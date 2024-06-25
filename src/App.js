import React from 'react';
import './App.css';

const Toolbar = () => {
  return (
    <div className="toolbar">
      <button>保存</button>
      <button>撤销</button>
      <button>重做</button>
      <button>导入</button>
      <button>导出</button>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3>组件列表</h3>
      <ul>
        <li>组件1</li>
        <li>组件2</li>
        <li>组件3</li>
      </ul>
    </div>
  );
};

const Canvas = () => {
  return (
    <div className="canvas">
      预留画布区域
    </div>
  );
};

const PropertyPanel = () => {
  return (
    <div className="property-panel">
      <h3>属性面板</h3>
      <div className="property">
        <label>ID:</label>
        <span>208:71311</span>
      </div>
      <div className="property">
        <label>宽度:</label>
        <span>120</span>
      </div>
      <div className="property">
        <label>高度:</label>
        <span>225</span>
      </div>
      <div className="property">
        <label>X:</label>
        <span>347</span>
      </div>
      <div className="property">
        <label>Y:</label>
        <span>2712</span>
      </div>
      <div className="property">
        <label>字体大小:</label>
        <span>18 pt</span>
      </div>
      <div className="property">
        <label>字体类型:</label>
        <span>等方</span>
      </div>
      <div className="property">
        <label>字重:</label>
        <span>常规</span>
      </div>
      <div className="property">
        <label>行间距:</label>
        <span>25 pt</span>
      </div>
      <div className="property">
        <label>段间距:</label>
        <span>40 pt</span>
      </div>
      <div className="property">
        <label>文字颜色:</label>
        <span>RGB 0,0,0</span>
      </div>
      <div className="property">
        <label>背景颜色:</label>
        <span>RGB 253,253,95</span>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="app">
      <div className='header'>
        复杂信息系统界面工效学评估与优化软件平台
      </div>
      <Toolbar />
      <div className="main">
        <Sidebar />
        <Canvas />
        <PropertyPanel />
      </div>
    </div>
  );
};

export default App;
