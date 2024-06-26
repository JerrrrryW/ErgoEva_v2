import React, { useEffect } from 'react';
import './App.css';
import Sidebar from './Components/Sidebar';
import TagSelector from './Components/TagSelector';
import { useState } from 'react';

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

const sampleLabeledUI = {
  "id": "1",
  "name": "Information Management System",
  "type": "root",
  "children": {
    "navigationBar": {
      "id": "1-1",
      "name": "Navigation Bar",
      "type": "navigation",
      "coordinates": [0, 0],
      "size": [1280, 50],
      "layout": "horizontal",
      "children": [
        {
          "id": "1-1-1",
          "name": "Home",
          "type": "button",
          "coordinates": [0, 0],
          "size": [100, 50]
        },
        {
          "id": "1-1-2",
          "name": "Information Management",
          "type": "button",
          "coordinates": [100, 0],
          "size": [200, 50]
        },
        {
          "id": "1-1-3",
          "name": "Data Analysis",
          "type": "button",
          "coordinates": [300, 0],
          "size": [150, 50]
        },
        {
          "id": "1-1-4",
          "name": "User Management",
          "type": "button",
          "coordinates": [450, 0],
          "size": [150, 50]
        },
        {
          "id": "1-1-5",
          "name": "Settings",
          "type": "button",
          "coordinates": [600, 0],
          "size": [100, 50]
        }
      ]
    },
    "toolbar": {
      "id": "1-2",
      "name": "Toolbar",
      "type": "menu",
      "coordinates": [0, 50],
      "size": [1280, 50],
      "layout": "horizontal",
      "children": [
        {
          "id": "1-2-1",
          "name": "Search Box",
          "type": "input",
          "inputType": "text",
          "coordinates": [0, 0],
          "size": [300, 50]
        },
        {
          "id": "1-2-2",
          "name": "Filter Button",
          "type": "button",
          "coordinates": [310, 0],
          "size": [100, 50]
        },
        {
          "id": "1-2-3",
          "name": "New Information Button",
          "type": "button",
          "coordinates": [420, 0],
          "size": [150, 50]
        },
        {
          "id": "1-2-4",
          "name": "Batch Operation Button",
          "type": "button",
          "coordinates": [580, 0],
          "size": [150, 50]
        },
        {
          "id": "1-2-5",
          "name": "Export Button",
          "type": "button",
          "coordinates": [740, 0],
          "size": [100, 50]
        }
      ]
    },
    "informationManagementArea": {
      "id": "1-3",
      "name": "Information Management Area",
      "type": "contentArea",
      "coordinates": [0, 100],
      "size": [1280, 700],
      "layout": "vertical",
      "children": [
        {
          "id": "1-3-1",
          "name": "Information List",
          "type": "list",
          "coordinates": [0, 0],
          "size": [1280, 300],
          "children": [
            {
              "id": "1-3-1-1",
              "name": "Information Title",
              "type": "text",
              "coordinates": [0, 0],
              "size": [400, 50],
              "fontSize": "20px",
              "color": "#0000FF"
            },
            {
              "id": "1-3-1-2",
              "name": "Publication Time",
              "type": "text",
              "coordinates": [400, 0],
              "size": [200, 50],
              "fontSize": "16px",
              "color": "#000000"
            },
            {
              "id": "1-3-1-3",
              "name": "Status",
              "type": "text",
              "coordinates": [600, 0],
              "size": [100, 50],
              "fontSize": "16px",
              "color": "#000000"
            },
            {
              "id": "1-3-1-4",
              "name": "Operation Buttons",
              "type": "menu",
              "coordinates": [700, 0],
              "size": [580, 50],
              "children": [
                {
                  "id": "1-3-1-4-1",
                  "name": "Edit",
                  "type": "button",
                  "coordinates": [0, 0],
                  "size": [100, 50],
                  "fontColor": "#0000FF",
                  "backgroundColor": "#FFFFFF",
                  "fontSize": "16px"
                },
                {
                  "id": "1-3-1-4-2",
                  "name": "Delete",
                  "type": "button",
                  "coordinates": [110, 0],
                  "size": [100, 50],
                  "fontColor": "#0000FF",
                  "backgroundColor": "#FFFFFF",
                  "fontSize": "16px"
                },
                {
                  "id": "1-3-1-4-3",
                  "name": "View",
                  "type": "button",
                  "coordinates": [220, 0],
                  "size": [100, 50],
                  "fontColor": "#0000FF",
                  "backgroundColor": "#FFFFFF",
                  "fontSize": "16px"
                }
              ]
            }
          ]
        },
        {
          "id": "1-3-2",
          "name": "Detailed Information Area",
          "type": "detail",
          "coordinates": [0, 310],
          "size": [1280, 390],
          "children": [
            {
              "id": "1-3-2-1",
              "name": "Title",
              "type": "input",
              "inputType": "text",
              "coordinates": [0, 0],
              "size": [1280, 50]
            },
            {
              "id": "1-3-2-2",
              "name": "Content",
              "type": "textarea",
              "coordinates": [0, 60],
              "size": [1280, 200]
            },
            {
              "id": "1-3-2-3",
              "name": "Attachments",
              "type": "fileUpload",
              "coordinates": [0, 270],
              "size": [1280, 50],
              "children": [
                {
                  "id": "1-3-2-3-1",
                  "name": "Image",
                  "type": "file",
                  "fileType": "image",
                  "coordinates": [0, 0],
                  "size": [640, 50]
                },
                {
                  "id": "1-3-2-3-2",
                  "name": "File",
                  "type": "file",
                  "fileType": "document",
                  "coordinates": [640, 0],
                  "size": [640, 50]
                }
              ]
            },
            {
              "id": "1-3-2-4",
              "name": "Publication Status Selection",
              "type": "dropdown",
              "coordinates": [0, 330],
              "size": [300, 50],
              "options": ["Published", "Draft", "Under Review"]
            },
            {
              "id": "1-3-2-5",
              "name": "Save Button",
              "type": "button",
              "coordinates": [310, 330],
              "size": [100, 50]
            }
          ]
        }
      ]
    },
    "pagination": {
      "id": "1-4",
      "name": "Pagination",
      "type": "pagination",
      "coordinates": [0, 800],
      "size": [1280, 50],
      "layout": "horizontal",
      "children": [
        {
          "id": "1-4-1",
          "name": "Previous Page",
          "type": "button",
          "coordinates": [0, 0],
          "size": [100, 50]
        },
        {
          "id": "1-4-2",
          "name": "Next Page",
          "type": "button",
          "coordinates": [110, 0],
          "size": [100, 50]
        },
        {
          "id": "1-4-3",
          "name": "Jump to Page Input",
          "type": "input",
          "inputType": "number",
          "coordinates": [220, 0],
          "size": [100, 50]
        }
      ]
    },
    "sidebar": {
      "id": "1-5",
      "name": "Sidebar",
      "type": "sidebar",
      "coordinates": [1280, 100],
      "size": [300, 700],
      "layout": "vertical",
      "children": [
        {
          "id": "1-5-1",
          "name": "Category Filter",
          "type": "filter",
          "coordinates": [0, 0],
          "size": [300, 300],
          "children": [
            {
              "id": "1-5-1-1",
              "name": "By Date",
              "type": "filterOption",
              "coordinates": [0, 0],
              "size": [300, 100]
            },
            {
              "id": "1-5-1-2",
              "name": "By Status",
              "type": "filterOption",
              "coordinates": [0, 110],
              "size": [300, 100],
              "options": ["Published", "Draft", "Under Review"]
            },
            {
              "id": "1-5-1-3",
              "name": "By Tag",
              "type": "filterOption",
              "coordinates": [0, 220],
              "size": [300, 100]
            }
          ]
        },
        {
          "id": "1-5-2",
          "name": "Quick Actions",
          "type": "actions",
          "coordinates": [0, 310],
          "size": [300, 100],
          "children": [
            {
              "id": "1-5-2-1",
              "name": "New Information",
              "type": "button",
              "coordinates": [0, 0],
              "size": [150, 50]
            },
            {
              "id": "1-5-2-2",
              "name": "Batch Delete",
              "type": "button",
              "coordinates": [160, 0],
              "size": [150, 50]
            }
          ]
        }
      ]
    }
  }
}



const App = () => {
  const [popupTagSelector, setPopupTagSelector] = useState({
    visible: false,
    x: 0,
    y: 0,
  });
  const [sampleJson, setSampleJson] = useState(sampleLabeledUI);

  // useEffect(() => {
  //   fetch('/data/sampleLabeledUI.json')
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setSampleJson(data);
  //       console.log('Load sample data success', data);
  //     })
  //     .catch((error) => console.error('Load sample data failed', error));
  // });

  return (
    <div className="app">
      <div className='header'>
        复杂信息系统界面工效学评估与优化软件平台
      </div>
      <Toolbar />
      <div className="main">
        <Sidebar data = {sampleJson}/>
        <Canvas />
        <div className='right-sidebar'>
          <TagSelector />
          <PropertyPanel /> 
        </div>
      </div>
    </div>
  );
};

export default App;
