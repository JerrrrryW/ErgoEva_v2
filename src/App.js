import React, { useEffect, useState } from 'react';
import Canvas from './Components/Canvas';
import Sidebar from './Components/Sidebar';
import TagSelector from './Components/TagSelector';
import './App.css';
import useUIModel from './data/UIDataModel';

const Toolbar = ({ setCanvasMode, canvasMode }) => {
  return (
    <div className="toolbar">
      {/* 工具栏按钮，根据当前的画布模式显示不同的工具 */}
      <button>保存</button>
      <button>撤销</button>
      <button>重做</button>
      <button>导入</button>
      <button>导出</button>
      {/* 根据画布模式显示不同的操作按钮 */}
      {canvasMode === 'browse' && (
        <button onClick={() => setCanvasMode('annotate')}>标注</button>
      )}
      {canvasMode === 'annotate' && (
        <>
          <button onClick={() => setCanvasMode('browse')}>退出标注</button>
          <button onClick={() => setCanvasMode('subdivision')}>子分区</button>
        </>
      )}
      {canvasMode === 'edit' && (
        <button onClick={() => setCanvasMode('browse')}>完成编辑</button>
      )}
      {canvasMode === 'subdivision' && (
        <button onClick={() => setCanvasMode('annotate')}>返回</button>
      )}
    </div>
  );
};

const PropertyPanel = ({ updateComponent, deleteComponent }) => {
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
      {/* 更新组件按钮 */}
      <button onClick={() => updateComponent('1', { name: 'Updated Component' })}>更新组件</button>
      {/* 删除组件按钮 */}
      <button onClick={() => deleteComponent('1')}>删除组件</button>
    </div>
  );
};

const App = () => {
  // 标注模式选择和画布交互控制状态
  const [popupTagSelector, setPopupTagSelector] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [canvasMode, setCanvasMode] = useState('browse'); // 画布的当前交互模式

  // 使用自定义的 UI 数据管理钩子
  const { uiData, addComponent, updateComponent, deleteComponent, findComponent } = useUIModel({
    id: '1',
    name: 'Root',
    type: 'root',
    children: []
  });

  // 加载 JSON 文件中的初始数据
  useEffect(() => {
    fetch('/data/sampleLabeledUI.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('Load sample data success', data);
        // 初始化 UI 数据，将加载的 JSON 数据添加为根节点的子节点
        addComponent(null, data);
      })
      .catch((error) => console.error('Load sample data failed', error));
  }, []);

  return (
    <div className="app">
      {/* 头部标题部分 */}
      <div className='header'>
        复杂信息系统界面工效学评估与优化软件平台
      </div>
      {/* 工具栏，包括保存、撤销、导入等操作 */}
      <Toolbar setCanvasMode={setCanvasMode} canvasMode={canvasMode} />
      <div className="main">
        {/* 侧边栏，显示当前标注的层级结构 */}
        {uiData && <Sidebar data={uiData} />}
        {/* 画布区域，支持多种交互模式 */}
        <Canvas imageUrl={require('./data/test.png')} canvasMode={canvasMode} />
        {/* 右侧的工具面板，包含标签选择和属性显示 */}
        <div className='right-sidebar'>
          <TagSelector />
          <PropertyPanel updateComponent={updateComponent} deleteComponent={deleteComponent} />
        </div>
      </div>
    </div>
  );
};

export default App;
