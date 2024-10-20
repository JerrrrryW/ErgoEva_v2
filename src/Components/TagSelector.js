import React, { useState } from 'react';
import './TagSelector.css'; // 假设你有一个 CSS 文件用于样式

const TAGS = {
  FUNCTIONAL: ['工作台', '列表页', '分析页', '表单页', '详情页', '个人中心页', '操作反馈页'],
  ELEMENTS: ['文本', '图标', '图像'],
  CONTROLS: {
    命令: ['按钮', '超链接'],
    选择: ['单选框', '复选框', '开关'],
    列表: ['下拉列表'],
    显示: ['文本框', '滚动条', '分割线'],
    其他: ['进度条', '滑块'],
  },
};

const TagSelector = ({ initialHighlight, onTagSelect, onCancel }) => {
  const [isControlDropdownOpen, setIsControlDropdownOpen] = useState(false);
  const [highlightedTag, setHighlightedTag] = useState(initialHighlight);
  const [selectedDropdownItem, setSelectedDropdownItem] = useState('');
  const [controlCategory, setControlCategory] = useState('');

  const toggleControlDropdown = (category) => {
    setControlCategory(category);
    setIsControlDropdownOpen((prev) => (category === controlCategory ? !prev : true));
  };

  const handleTagClick = (tag) => {
    setHighlightedTag(tag);
    setIsControlDropdownOpen(false);
    if (onTagSelect) {
      onTagSelect(tag); // 通知父组件用户选择了哪个标签
    }
  };

  const handleDropdownItemClick = (item) => {
    setSelectedDropdownItem(item);
    setHighlightedTag(item);
    setIsControlDropdownOpen(false);
    if (onTagSelect) {
      onTagSelect(item); // 通知父组件用户选择了哪个下拉项
    }
  };

  return (
    <div className="tag-selector">
      <div className="tag-category">
        <span className="category-title">功能层次</span>
        <div className="tags">
          {TAGS.FUNCTIONAL.map((tag) => (
            <div
              key={tag}
              className={`tag ${highlightedTag === tag ? 'highlight' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      <div className="tag-category">
        <span className="category-title">基础元素层次</span>
        <div className="tags">
          {TAGS.ELEMENTS.map((tag) => (
            <div
              key={tag}
              className={`tag ${highlightedTag === tag ? 'highlight' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </div>
          ))}
          {Object.keys(TAGS.CONTROLS).map((category) => (
            <div
              key={category}
              className={`tag ${highlightedTag === selectedDropdownItem ? 'highlight' : ''}`}
              onClick={() => toggleControlDropdown(category)}
            >
              {category}
              {isControlDropdownOpen && controlCategory === category && (
                <div className="dropdown">
                  {TAGS.CONTROLS[category].map((item) => (
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
          ))}
        </div>
      </div>
      <div className="actions">
        <button className="action-button" onClick={() => onTagSelect(highlightedTag)}>确定</button>
        <button className="action-button" onClick={onCancel}>取消</button>
      </div>
    </div>
  );
};

export default TagSelector;
