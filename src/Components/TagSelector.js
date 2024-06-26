import React, { useState } from 'react';
import './TagSelector.css'; // 假设你有一个 CSS 文件用于样式

const TagSelector = ({ initialHighlight }) => {
  const [isControlDropdownOpen, setIsControlDropdownOpen] = useState(false);
  const [highlightedTag, setHighlightedTag] = useState(initialHighlight);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('');

  const toggleControlDropdown = () => {
    setIsControlDropdownOpen(!isControlDropdownOpen);
  };

  const handleTagClick = (tag) => {
    setHighlightedTag(tag);
    setIsControlDropdownOpen(false);
  };

  const handleDropdownItemClick = (item) => {
    setSelectedDropdownItem(item);
    setHighlightedTag(item);
    setIsControlDropdownOpen(false);
  };

  return (
    <div className="tag-selector">
      <div className="tag-category">
        <span className="category-title">组件</span>
        <div className="tags">
          <div
            className={`tag ${highlightedTag === '导航栏' ? 'highlight' : ''}`}
            onClick={() => handleTagClick('导航栏')}
          >
            导航栏
          </div>
          <div
            className={`tag ${highlightedTag === '菜单栏' ? 'highlight' : ''}`}
            onClick={() => handleTagClick('菜单栏')}
          >
            菜单栏
          </div>
        </div>
      </div>
      <div className="tag-category">
        <span className="category-title">元素</span>
        <div className="tags">
          <div
            className={`tag ${highlightedTag === '文本' ? 'highlight' : ''}`}
            onClick={() => handleTagClick('文本')}
          >
            文本
          </div>
          <div
            className={`tag ${highlightedTag === '图标' ? 'highlight' : ''}`}
            onClick={() => handleTagClick('图标')}
          >
            图标
          </div>
          <div className={`tag ${highlightedTag === selectedDropdownItem ? 'highlight' : ''}`} onClick={toggleControlDropdown}>
            控件
            {isControlDropdownOpen && (
              <div className="dropdown">
                {['按钮', '输入框', '复选框', '单选按钮'].map((item) => (
                  <div
                    key={item}
                    className="dropdown-item"
                    onClick={() => handleDropdownItemClick(item)}
                  >
                    {item}
                  </div>
                ))}
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
