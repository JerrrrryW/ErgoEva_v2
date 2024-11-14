import React, { useEffect, useRef, useState } from 'react';
import './Canvas.css';
import TagSelector from './TagSelector';

const Canvas = ({ imageUrl, canvasMode, onAddAnnotation, onUpdateAnnotation }) => {
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

  // 添加一个状态，用于记录放大状态
  const [isZoomed, setIsZoomed] = useState(false);
  // 定义一个 ref，用于处理单击和双击事件的区分
  const clickTimeout = useRef(null);

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
  // 当添加新的标注时，赋予一个唯一的 id
  const handleMouseUp = (e) => {
    if (isSelecting) {
      setIsSelecting(false);
      if (selectionRect) {
        const { x, y, width, height } = selectionRect;
        if (width > 0 && height > 0) {
          // 创建新的标注，赋予唯一的 id
          const newAnnotation = {
            id: Date.now().toString(), // 或使用更可靠的唯一 ID 生成方法
            x,
            y,
            width,
            height,
            label: '未标注',
          };
          setAnnotations((prevAnnotations) => [...prevAnnotations, newAnnotation]);
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

  // 修改 handleLabelSelect 函数
  const handleLabelSelect = (label) => {
    setAnnotations((prevAnnotations) => {
      if (editingAnnotation !== null) {
        // 更新已存在的标注
        const updatedAnnotations = [...prevAnnotations];
        const annotation = { ...updatedAnnotations[editingAnnotation], label };
        updatedAnnotations[editingAnnotation] = annotation;

        // 通知上层组件更新 uiDataModel
        if (onUpdateAnnotation) {
          onUpdateAnnotation(annotation);
        }

        setEditingAnnotation(null);
        return updatedAnnotations;
      } else {
        // 更新最后一个标注的标签
        const lastAnnotationIndex = prevAnnotations.length - 1;
        const lastAnnotation = {
          ...prevAnnotations[lastAnnotationIndex],
          label,
        };
        const updatedAnnotations = [...prevAnnotations];
        updatedAnnotations[lastAnnotationIndex] = lastAnnotation;

        // 通知上层组件添加新的标注
        if (onAddAnnotation) {
          onAddAnnotation(lastAnnotation);
        }

        return updatedAnnotations;
      }
    });
    setShowTagSelector(null);
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

  // 修改 handleAnnotationClick 函数
  const handleAnnotationClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    // 单击不做任何操作
  };

  // 添加 handleAnnotationDoubleClick 函数
  const handleAnnotationDoubleClick = (e, index) => {
    e.stopPropagation();
    e.preventDefault();
    // 执行放大操作
    zoomToAnnotation(index);
  };

  // 放大到指定的标注区域
  const zoomToAnnotation = (index) => {
    const annotation = annotations[index];
    if (!annotation) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // 计算新的缩放比例
    const padding = 50; // 保留 50px 边距
    const availableWidth = rect.width - padding * 2;
    const availableHeight = rect.height - padding * 2;

    const scaleX = availableWidth / annotation.width;
    const scaleY = availableHeight / annotation.height;
    const newScale = Math.min(scaleX, scaleY);

    // 计算新的位置，使得标注区域居中
    const newX = -annotation.x * newScale + padding;
    const newY = -annotation.y * newScale + padding;

    // 更新状态
    setScale(newScale);
    setPosition({ x: newX, y: newY });
    setIsZoomed(true);
  };

  // 添加一个函数，恢复到初始视图
  const resetZoom = () => {
    // 重新初始化图片的位置和缩放比例
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
        setIsZoomed(false);
      }
    };
  };

  // 添加 handleAnnotationLabelClick 函数
  const handleAnnotationLabelClick = (index) => {
    setEditingAnnotation(index);
    const annotation = annotations[index];
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    setShowTagSelector({
      x: annotation.x * scale + position.x,
      y: annotation.y * scale + position.y,
    });
  };


  // 在最外层的 div 添加双击事件，恢复到初始视图
  return (
    <div
      ref={canvasRef}
      className="canvas"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onWheel={handleWheel}
      onDoubleClick={() => {
        if (isZoomed) {
          resetZoom();
        }
      }}
    >
      <img
        src={imageUrl}
        alt="Draggable"
        className="canvas-image"
        draggable="false"
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
          className={`annotation-rect ${hoveredAnnotation === index ? 'hovered' : ''}`}
          style={{
            left: annotation.x * scale + position.x,
            top: annotation.y * scale + position.y,
            width: annotation.width * scale,
            height: annotation.height * scale,
            cursor: canvasMode === 'browse' ? 'pointer' : 'default',
          }}
          onClick={(e) => handleAnnotationClick(e, index)}
          onDoubleClick={(e) => handleAnnotationDoubleClick(e, index)}
          onMouseEnter={() => setHoveredAnnotation(index)}
          onMouseLeave={() => setHoveredAnnotation(null)}
        >
          <span className="annotation-label-top" onClick={() => handleAnnotationLabelClick(index)}>
            {annotation.label}
          </span>
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
            transform: 'scale(0.8)',
          }}
        >
          <TagSelector
            initialHighlight={
              editingAnnotation !== null ? annotations[editingAnnotation].label : null
            }
            onTagSelect={handleLabelSelect}
            onCancel={handleCancelSelect}
          />
        </div>
      )}
    </div>
  );
};

export default Canvas;
