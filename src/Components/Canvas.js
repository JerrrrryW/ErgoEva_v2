import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';
import TagSelector from './TagSelector';

const Canvas = ({ imageUrl, canvasMode }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 });
  const [selectionRect, setSelectionRect] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [showTagSelector, setShowTagSelector] = useState(null);

  useEffect(() => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const canvasWidth = canvas.offsetWidth;
        const canvasHeight = canvas.offsetHeight;
        const imgWidth = image.width;
        const imgHeight = image.height;
        const scaleFit = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);

        setScale(scaleFit);
        setPosition({
          x: (canvasWidth - imgWidth * scaleFit) / 2,
          y: (canvasHeight - imgHeight * scaleFit) / 2,
        });
      }
    };
  }, [imageUrl]);

  // 处理鼠标按下事件
  const handleMouseDown = (e) => {
    e.preventDefault(); // 阻止默认的拖拽行为
    if (canvasMode === 'annotate' || canvasMode === 'subdivision') {
      // 开始选择区域
      setIsSelecting(true);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setSelectionStart({
        x: Math.max((e.clientX - rect.left - position.x) / scale, 0),
        y: Math.max((e.clientY - rect.top - position.y) / scale, 0),
      });
    } else if (canvasMode === 'browse') {
      // 开始拖拽画布
      setIsDragging(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // 处理鼠标松开事件
  const handleMouseUp = (e) => {
    if (isSelecting) {
      // 完成区域选择
      setIsSelecting(false);
      if (selectionRect) {
        const { x, y, width, height } = selectionRect;
        if (width > 0 && height > 0) {
          // 添加新的标注
          setAnnotations((prevAnnotations) => [
            ...prevAnnotations,
            { x, y, width, height, label: '未标注' },
          ]);
          // 显示标注类型选择框
          const canvas = canvasRef.current;
          const rect = canvas.getBoundingClientRect();
          setShowTagSelector({
            x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width),
            y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height),
          });
        }
        setSelectionRect(null);
      }
    } else if (isDragging) {
      // 完成画布拖拽
      setIsDragging(false);
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (isSelecting) {
      // 更新选择矩形的大小
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const startX = selectionStart.x;
      const startY = selectionStart.y;
      const currentX = Math.min(Math.max((e.clientX - rect.left - position.x) / scale, 0), rect.width / scale);
      const currentY = Math.min(Math.max((e.clientY - rect.top - position.y) / scale, 0), rect.height / scale);
      setSelectionRect({
        x: Math.min(startX, currentX),
        y: Math.min(startY, currentY),
        width: Math.abs(currentX - startX),
        height: Math.abs(currentY - startY),
      });
    } else if (isDragging) {
      // 更新画布的位置
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      setPosition((prevPosition) => ({
        x: prevPosition.x + deltaX,
        y: prevPosition.y + deltaY,
      }));
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // 处理滚轮缩放事件
  const handleWheel = (e) => {
    if (canvasMode === 'browse' || canvasMode === 'annotate' || canvasMode === 'subdivision') {
      e.preventDefault();
      const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
      setScale((prevScale) => {
        const newScale = Math.min(Math.max(prevScale * scaleAmount, 0.1), 5);
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const offsetX = (mouseX - rect.left - position.x) / prevScale;
        const offsetY = (mouseY - rect.top - position.y) / prevScale;

        setPosition((prevPosition) => ({
          x: mouseX - rect.left - offsetX * newScale,
          y: mouseY - rect.top - offsetY * newScale,
        }));
        return newScale;
      });
    }
  };

  // 处理标注类型选择
  const handleLabelSelect = (label) => {
    setAnnotations((prevAnnotations) => {
      const lastAnnotation = { ...prevAnnotations[prevAnnotations.length - 1], label };
      return [...prevAnnotations.slice(0, -1), lastAnnotation];
    });
    setShowTagSelector(null);
  };

  // 处理取消标注类型选择
  const handleCancelSelect = () => {
    setAnnotations((prevAnnotations) => prevAnnotations.slice(0, -1));
    setShowTagSelector(null);
  };

  return (
    <div
      ref={canvasRef}
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
    >
      <img
        src={imageUrl}
        alt="Draggable"
        className="canvas-image"
        draggable="false" // 禁止默认的图片拖拽行为
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: 'top left',
          cursor: canvasMode === 'browse' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair',
        }}
      />
      {/* 绘制选择矩形 */}
      {selectionRect && (
        <div
          className="selection-rect"
          style={{
            left: selectionRect.x * scale + position.x,
            top: selectionRect.y * scale + position.y,
            width: selectionRect.width * scale,
            height: selectionRect.height * scale,
          }}
        ></div>
      )}
      {/* 绘制标注矩形 */}
      {annotations.map((annotation, index) => (
        <div
          key={index}
          className="annotation-rect"
          style={{
            left: annotation.x * scale + position.x,
            top: annotation.y * scale + position.y,
            width: annotation.width * scale,
            height: annotation.height * scale,
          }}
        >
          <span className="annotation-label-top">{annotation.label}</span>
        </div>
      ))}
      {/* 显示标注类型选择框 */}
      {showTagSelector && (
        <div
          style={{
            position: 'absolute',
            left: showTagSelector.x,
            top: showTagSelector.y,
            zIndex: 1000,
            transform: 'scale(0.8)', // 缩小选择框的大小
          }}
        >
          <TagSelector initialHighlight={null} onTagSelect={handleLabelSelect} onCancel={handleCancelSelect} />
        </div>
      )}
    </div>
  );
};

export default Canvas;
