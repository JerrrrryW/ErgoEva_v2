import React from 'react';
import './DetailView.css';

function DetailView({ detail, onBack }) {
  return (
    <div className="details-container">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>返回</button>
        <div className="title">
          <img src={detail.icon || './icon/default.png'} alt="icon" />
          <h3>{detail.title}</h3>
        </div>
      </div>
      <div className="detail-content">
        {/* 占位符：大标题 */}
        <div className="placeholder title-placeholder"></div>
        {/* 占位符：文本段落 */}
        <div className="placeholder text-placeholder"></div>
        <div className="placeholder text-placeholder"></div>
        {/* 占位符：卡片 */}
        <div className="card-placeholder">
          <div className="placeholder card-item"></div>
          <div className="placeholder card-item"></div>
          <div className="placeholder card-item"></div>
        </div>
        {/* 占位符：图片 */}
        <div className="placeholder image-placeholder"></div>
      </div>
    </div>
  );
}

export default DetailView;