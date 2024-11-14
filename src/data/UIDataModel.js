import { useState } from 'react';

const useUIModel = (initialData) => {
  const [uiData, setUIData] = useState(initialData);

  // Add a new component
  const addComponent = (parentId, newComponent) => {
    const updateTree = (node) => {
      if (node.id === parentId) {
        node.children = node.children || [];
        node.children.push(newComponent);
      } else if (node.children) {
        node.children.forEach((child) => updateTree(child));
      }
    };
    // 创建 uiData 的深拷贝
    const newUiData = JSON.parse(JSON.stringify(uiData));
    updateTree(newUiData);
    setUIData(newUiData);
  };


  // Update a component by id
  const updateComponent = (componentId, updatedProperties) => {
    const updateTree = (node) => {
      if (node.id === componentId) {
        Object.assign(node, updatedProperties);
      } else if (node.children) {
        node.children.forEach((child) => updateTree(child));
      }
    };
    const newUiData = { ...uiData };
    updateTree(newUiData);
    setUIData(newUiData);
  };

  // Delete a component by id
  const deleteComponent = (componentId) => {
    const deleteFromTree = (node) => {
      if (node.children) {
        node.children = node.children.filter((child) => child.id !== componentId);
        node.children.forEach((child) => deleteFromTree(child));
      }
    };
    const newUiData = { ...uiData };
    if (newUiData.id === componentId) {
      setUIData(null); // Deleting root element
    } else {
      deleteFromTree(newUiData);
      setUIData(newUiData);
    }
  };

  // Find a component by id
  const findComponent = (componentId) => {
    const findInTree = (node) => {
      if (node.id === componentId) {
        return node;
      } else if (node.children) {
        for (const child of node.children) {
          const found = findInTree(child);
          if (found) return found;
        }
      }
      return null;
    };
    return findInTree(uiData);
  };

  return {
    uiData,
    addComponent,
    updateComponent,
    deleteComponent,
    findComponent,
  };
};

export default useUIModel;