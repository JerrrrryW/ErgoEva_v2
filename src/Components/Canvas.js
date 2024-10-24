import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';
import TagSelector from './TagSelector';

const Canvas = ({ imageUrl, canvasMode }) => {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // 是否正在拖拽画布
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 }); // 记录上一次鼠标的位置
  const [scale, setScale] = useState(1); // 图片缩放比例
  const [position, setPosition] = useState({ x: 0, y: 0 }); // 图片在画布中的位置
  const [isSelecting, setIsSelecting] = useState(false); // 是否正在选择区域
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 }); // 选择区域的起始点
  const [selectionRect, setSelectionRect] = useState(null); // 当前选择的矩形区域
  const [annotations, setAnnotations] = useState([]); // 存储标注信息
  const [showTagSelector, setShowTagSelector] = useState(null); // 是否显示标注选择框
  const [editingAnnotation, setEditingAnnotation] = useState(null); // 当前正在编辑的标注
  const [isHoveringLabel, setIsHoveringLabel] = useState(false); // 是否悬浮在标注标签上
  const [hoveredAnnotation, setHoveredAnnotation] = useState(null); // 当前悬浮的标注

  // 加载图片并初始化画布
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
        const scaleFit = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight); // 计算适合画布的缩放比例

        setScale(scaleFit);
        setPosition({
          x: (canvasWidth - imgWidth * scaleFit) / 2, // 水平方向居中
          y: (canvasHeight - imgHeight * scaleFit) / 2, // 垂直方向居中
        });
      }
    };
  }, [imageUrl]);

  // 处理鼠标按下事件
  const handleMouseDown = (e) => {
    e.preventDefault(); // 阻止默认的拖拽行为
    if (isHoveringLabel) return; // 如果悬浮在标注标签上，则不执行选择或拖拽操作

    if (canvasMode === 'annotate' || canvasMode === 'subdivision') {
      // 开始选择区域
      setIsSelecting(true);
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      setSelectionStart({
        x: Math.max((e.clientX - rect.left - position.x) / scale, 0), // 计算选择起点的x坐标
        y: Math.max((e.clientY - rect.top - position.y) / scale, 0), // 计算选择起点的y坐标
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
            x: Math.min(Math.max(e.clientX - rect.left, 0), rect.width), // 标注选择框的x坐标
            y: Math.min(Math.max(e.clientY - rect.top, 0), rect.height), // 标注选择框的y坐标
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
        x: Math.min(startX, currentX), // 确定选择矩形的x坐标
        y: Math.min(startY, currentY), // 确定选择矩形的y坐标
        width: Math.abs(currentX - startX), // 选择矩形的宽度
        height: Math.abs(currentY - startY), // 选择矩形的高度
      });
    } else if (isDragging) {
      // 更新画布的位置
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      setPosition((prevPosition) => ({
        x: prevPosition.x + deltaX, // 更新画布x坐标
        y: prevPosition.y + deltaY, // 更新画布y坐标
      }));
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  // 处理滚轮缩放事件
  const handleWheel = (e) => {
    if (canvasMode === 'browse' || canvasMode === 'annotate' || canvasMode === 'subdivision') {
      e.preventDefault();
      const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1; // 根据滚轮方向设置缩放比例
      setScale((prevScale) => {
        const newScale = Math.min(Math.max(prevScale * scaleAmount, 0.1), 5); // 限制缩放比例范围
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const offsetX = (mouseX - rect.left - position.x) / prevScale;
        const offsetY = (mouseY - rect.top - position.y) / prevScale;

        setPosition((prevPosition) => ({
          x: mouseX - rect.left - offsetX * newScale, // 更新缩放后的x坐标
          y: mouseY - rect.top - offsetY * newScale, // 更新缩放后的y坐标
        }));
        return newScale;
      });
    }
  };

  // 处理标注类型选择
  const handleLabelSelect = (label) => {
    setAnnotations((prevAnnotations) => {
      if (editingAnnotation !== null) {
        // 更新正在编辑的标注
        const updatedAnnotations = [...prevAnnotations];
        updatedAnnotations[editingAnnotation] = {
          ...updatedAnnotations[editingAnnotation],
          label,
        };
        setEditingAnnotation(null); // 结束编辑
        return updatedAnnotations;
      } else {
        // 更新最后一个标注的标签
        const lastAnnotation = { ...prevAnnotations[prevAnnotations.length - 1], label };
        return [...prevAnnotations.slice(0, -1), lastAnnotation];
      }
    });
    setShowTagSelector(null); // 隐藏标注选择框
  };

  // 处理取消标注类型选择
  const handleCancelSelect = () => {
    if (editingAnnotation !== null) {
      setEditingAnnotation(null); // 取消编辑
    } else {
      setAnnotations((prevAnnotations) => prevAnnotations.slice(0, -1)); // 移除最后一个标注
    }
    setShowTagSelector(null); // 隐藏标注选择框
  };

  // 处理标注标签点击事件
  const handleAnnotationClick = (index) => {
    setEditingAnnotation(index); // 设置当前正在编辑的标注
    const annotation = annotations[index];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setShowTagSelector({
      x: annotation.x * scale + position.x, // 标注选择框的x坐标
      y: annotation.y * scale + position.y, // 标注选择框的y坐标
    });
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
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, // 根据位置和缩放比例调整图片
          transformOrigin: 'top left',
          cursor: canvasMode === 'browse' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair', // 根据模式设置鼠标光标样式
        }}
      />
      {/* 绘制选择矩形 */}
      {selectionRect && (
        <div
          className="selection-rect"
          style={{
            left: selectionRect.x * scale + position.x, // 选择矩形的x坐标
            top: selectionRect.y * scale + position.y, // 选择矩形的y坐标
            width: selectionRect.width * scale, // 选择矩形的宽度
            height: selectionRect.height * scale, // 选择矩形的高度
          }}
        ></div>
      )}
      {/* 绘制标注矩形 */}
      {annotations.map((annotation, index) => (
        <div
          key={index}
          className={`annotation-rect ${hoveredAnnotation === index ? 'hovered' : ''}`} // 如果悬浮则添加hovered类
          style={{
            left: annotation.x * scale + position.x, // 标注矩形的x坐标
            top: annotation.y * scale + position.y, // 标注矩形的y坐标
            width: annotation.width * scale, // 标注矩形的宽度
            height: annotation.height * scale, // 标注矩形的高度
            cursor: canvasMode === 'browse' ? 'pointer' : 'default', // 在浏览模式下显示指针
          }}
          onClick={() => handleAnnotationClick(index)} // 点击标注矩形时弹出标注选择框
          onMouseEnter={() => setHoveredAnnotation(index)} // 鼠标悬浮在标注标签上时
          onMouseLeave={() => setHoveredAnnotation(null)} // 鼠标移出标注标签时
        >
          <span className="annotation-label-top" onClick={() => handleAnnotationClick(index)}>{annotation.label}</span> {/* 点击标注标签时弹出标注类型选择框 */}
        </div>
      ))}
      {/* 显示标注类型选择框 */}
      {showTagSelector && (
        <div
          style={{
            position: 'absolute',
            left: showTagSelector.x, // 标注选择框的x坐标
            top: showTagSelector.y, // 标注选择框的y坐标
            zIndex: 1000,
            transform: 'scale(0.8)', // 缩小选择框的大小
          }}
        >
          <TagSelector
            initialHighlight={editingAnnotation !== null ? annotations[editingAnnotation].label : null} // 初始化高亮的标签
            onTagSelect={handleLabelSelect}
            onCancel={handleCancelSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Canvas;
