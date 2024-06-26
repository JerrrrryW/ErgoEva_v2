import React, { useState } from 'react';
import './TagSelector.css'; // Assuming you have a CSS file for styling

const TagSelector = () => {
  const [isControlDropdownOpen, setIsControlDropdownOpen] = useState(false);

  const toggleControlDropdown = () => {
    setIsControlDropdownOpen(!isControlDropdownOpen);
  };

  return (
    <div className="tag-selector">
      <div className="tag-category">
        <span className="category-title">组件</span>
        <div className="tags">
          <div className="tag">导航栏</div>
          <div className="tag">菜单栏</div>
        </div>
      </div>
      <div className="tag-category">
        <span className="category-title">元素</span>
        <div className="tags">
          <div className="tag">文本</div>
          <div className="tag">图标</div>
          <div className="tag" onClick={toggleControlDropdown}>
            控件
            {isControlDropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-item">按钮</div>
                <div className="dropdown-item">输入框</div>
                <div className="dropdown-item">复选框</div>
                <div className="dropdown-item">单选按钮</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="actions">
        <button className="action-button">确定</button>
        <button className="action-button">取消</button>
      </div>
    </div>
  );
};

export default TagSelector;
