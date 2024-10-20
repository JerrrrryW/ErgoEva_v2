import React, { useState } from 'react';
import './Sidebar.css';

const iconMap = {
    'navigation': '📂',
    'link': '🔗',
    'image-slider': '🖼️',
    'recommendation': '🔥',
    'sidebar': '📂',
    'user-info': '👤',
    'settings': '⚙️',
    'appearance': '🎨',
    'security': '🔒',
    'content-management': '📂',
    'articles': '📝',
    'categories': '📑',
    'tags': '🏷️',
    'media-library': '🎥',
};

const Sidebar = ({ data }) => {
    const [expandedItems, setExpandedItems] = useState([]);
    const [activeItem, setActiveItem] = useState(null);

    const handleToggle = (itemId) => {
        if (expandedItems.includes(itemId)) {
            setExpandedItems(expandedItems.filter((id) => id !== itemId));
        } else {
            setExpandedItems([...expandedItems, itemId]);
        }
    };

    const handleSelect = (itemId) => {
        setActiveItem(itemId);
    };

    const renderList = (items) => {
        if (!Array.isArray(items)) {
            items = Object.values(items); // Convert children object to array
        }

        return (
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        <div
                            onClick={() => {
                                handleToggle(item.id);
                                handleSelect(item.id);
                            }}
                            className={activeItem === item.id ? 'active' : ''}
                        >
                            <span>{item.name}</span>
                            <span>{iconMap[item.type] || '📁'}</span>
                        </div>
                        {expandedItems.includes(item.id) && item.children && renderList(item.children)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="sidebar">
            <div className="search">
                <input type="text" placeholder="搜索" />
                <span>🔍</span>
            </div>
            {renderList(data.children)}
        </div>
    );
};

export default Sidebar;
