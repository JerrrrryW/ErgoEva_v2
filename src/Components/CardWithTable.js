// src/components/CardWithTable.js
import React from 'react';
import './CardWithTable.css';

function CardWithTable({ 
    icon='./icon/icon.png',
    title='标题', 
    data=[
        { type: '类型1', quantity: '数量1', parameter: '参数1', icon: icon },
        { type: '类型2', quantity: '数量2', parameter: '参数2', icon: icon },
        { type: '类型3', quantity: '数量3', parameter: '参数3', icon: icon },
      ],
    onDetailsClick
}) {
  return (
    <div className="card-container">
      <div className="card-header">
        <div className="title">
          {icon && <img src={icon} alt="icon" />}
          <h2>{title}</h2>
        </div>
        <div className="details-link" onClick={() => onDetailsClick(title, icon)}>
          查看详情 &gt;
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>类型</th>
            <th>数量</th>
            <th>具体参数</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>
                {item.icon && <img src={item.icon} alt="icon" />}
                {item.type}
              </td>
              <td>{item.quantity}</td>
              <td>{item.parameter}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CardWithTable;
