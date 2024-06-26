import React from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import TagSelector from './Components/TagSelector';

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

const sampleJson = {
  "id": "root",
  "name": "组件根目录",
  "children": [
    {
      "id": "1",
      "name": "导航栏",
      "type": "navigation",
      "children": [
        {
          "id": "1-1",
          "name": "首页",
          "type": "link",
          "children": [
            {
              "id": "1-1-1",
              "name": "轮播图",
              "type": "image-slider",
              "children": []
            },
            {
              "id": "1-1-2",
              "name": "热门推荐",
              "type": "recommendation",
              "children": []
            }
          ]
        },
        {
          "id": "1-2",
          "name": "关于我们",
          "type": "link",
          "children": []
        }
      ]
    },
    {
      "id": "2",
      "name": "侧边栏",
      "type": "sidebar",
      "children": [
        {
          "id": "2-1",
          "name": "用户信息",
          "type": "user-info",
          "children": []
        },
        {
          "id": "2-2",
          "name": "设置",
          "type": "settings",
          "children": [
            {
              "id": "2-2-1",
              "name": "外观",
              "type": "appearance",
              "children": []
            },
            {
              "id": "2-2-2",
              "name": "安全",
              "type": "security",
              "children": []
            }
          ]
        }
      ]
    },
    {
      "id": "3",
      "name": "内容管理",
      "type": "content-management",
      "children": [
        {
          "id": "3-1",
          "name": "文章",
          "type": "articles",
          "children": [
            {
              "id": "3-1-1",
              "name": "分类",
              "type": "categories",
              "children": []
            },
            {
              "id": "3-1-2",
              "name": "标签",
              "type": "tags",
              "children": []
            }
          ]
        },
        {
          "id": "3-2",
          "name": "媒体库",
          "type": "media-library",
          "children": []
        }
      ]
    }
  ]
}


const App = () => {
  const [popupTagSelector, setPopupTagSelector] = useState({
    visible: false,
    x: 0,
    y: 0,
  });

  const handlePopupTagSelector = (event) => {
    setPopupTagSelector({
      visible: true,
      x: event.clientX,
      y: event.clientY,
    });
  }

  const handleClick = () => {
    setPopupTagSelector({...popupTagSelector, visible: false});
  }

  return (
    <div className="app">
      <div className='header'>
        复杂信息系统界面工效学评估与优化软件平台
      </div>
      <Toolbar />
      <div className="main">
        <Sidebar data = {sampleJson}/>
        <Canvas />
        <div onContextMenu={handlePopupTagSelector} onClick={handleClick} className={`tag-selector-popup ${popupTagSelector.visible ? 'visible' : ''}`} style={{top: popupTagSelector.y, left: popupTagSelector.x}}>
          <TagSelector/>
        </div>
        <div className='right-sidebar'>
          <TagSelector />
          <PropertyPanel /> 
        </div>
      </div>
    </div>
  );
};

export default App;
