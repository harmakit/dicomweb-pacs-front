/* eslint-disable new-cap */
import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import CornerstoneViewport from 'react-cornerstone-viewport';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import { Button, Grid } from '@mui/material';
import config from '../../params';
import {
  eraserCursor,
  freehandRoiCursor,
  wwwcCursor,
  wwwcRegionCursor,
  zoomCursor,
} from './tools';

const TOOL_WWWC_NAME = 'WwwcTool';
const TOOL_WWWC_REGION_NAME = 'WwwcRegionTool';
const TOOL_ZOOM_NAME = 'ZoomTool';
const TOOL_FREEHAND_ROI_NAME = 'FreehandRoiTool';
const TOOL_ERASER_NAME = 'EraserTool';

function initCornerstone() {
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  cornerstoneTools.init();

  cornerstoneTools.toolStyle.setToolWidth(2);
  cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
  cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

  cornerstoneTools.store.state.touchProximity = 40;

  const assetPath = `${config.hostAddress}/static`;
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
    webWorkerTaskPaths: [
      `${assetPath}/610.bundle.min.worker.js`,
      `${assetPath}/888.bundle.min.worker.js`,
    ],
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
      decodeTask: {
        initializeCodecsOnStartup: false,
        usePDFJS: false,
        strict: false,
      },
    },
  });
}

function getDefaultTools() {
  return [
    cornerstoneTools.StackScrollMouseWheelTool,
    cornerstoneTools.PanMultiTouchTool,
    cornerstoneTools.ZoomTouchPinchTool,
    cornerstoneTools.StackScrollMultiTouchTool,
  ];
}

function getMouseTools() {
  return [
    {
      name: TOOL_WWWC_NAME,
      class: cornerstoneTools.WwwcTool,
      icon: wwwcCursor,
    },
    {
      name: TOOL_WWWC_REGION_NAME,
      class: cornerstoneTools.WwwcRegionTool,
      icon: wwwcRegionCursor,
    },
    {
      name: TOOL_ZOOM_NAME,
      class: cornerstoneTools.ZoomTool,
      icon: zoomCursor,
    },
    {
      name: TOOL_FREEHAND_ROI_NAME,
      class: cornerstoneTools.FreehandRoiTool,
      icon: freehandRoiCursor,
      showIfSingleImage: true,
    },
    {
      name: TOOL_ERASER_NAME,
      class: cornerstoneTools.EraserTool,
      icon: eraserCursor,
      showIfSingleImage: true,
    },
  ];
}

const VIEWER_TOOLS_INITIALIZING_TIMEOUT = 300;

function ImageViewer(props) {
  const { urls, onSave, showSingleImageTools, toolsData } = props;
  const [element, setElement] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const shouldRenderImages = Array.isArray(urls) && urls.length !== 0;

  useEffect(() => {
    if (shouldRenderImages && !initialized) {
      initCornerstone();
      setInitialized(true);
    }
  }, []);

  // add tools
  useEffect(() => {
    if (element) {
      // add mouse tools
      getMouseTools().forEach(mouseTool => {
        if (!showSingleImageTools && mouseTool.showIfSingleImage) {
          return;
        }
        cornerstoneTools.addToolForElement(element, mouseTool.class);
      });

      // add pan tool with right mouse button
      cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);
      cornerstoneTools.setToolActiveForElement(
        element,
        new cornerstoneTools.PanTool().name,
        {
          mouseButtonMask: 2,
        },
      );

      // add scrolling, zooming and panning tools
      getDefaultTools().forEach(tool => {
        cornerstoneTools.addToolForElement(element, tool);
        cornerstoneTools.setToolActiveForElement(element, new tool().name, {});
      });

      // activate every tool to avoid tools data loading issues
      getMouseTools().forEach(mouseTool => {
        if (!showSingleImageTools && mouseTool.showIfSingleImage) {
          return;
        }
        activateTool(mouseTool);
      });

      // activate first tool
      activateTool(getMouseTools()[0]);
    }
  }, [element]);

  // load tools data
  useEffect(() => {
    if (!initialized || !element) {
      return;
    }

    // clear all tools data
    getMouseTools().forEach(mouseTool => {
      const { name } = new mouseTool.class();
      cornerstoneTools.clearToolState(element, name);
    });

    // wait for cornerstone to initialize tools
    setTimeout(() => {
      getMouseTools().forEach(mouseTool => {
        if (
          !toolsData?.[mouseTool.name] ||
          !Array.isArray(toolsData?.[mouseTool.name])
        ) {
          return;
        }

        const { name } = new mouseTool.class();
        toolsData[mouseTool.name].forEach(toolData => {
          cornerstoneTools.addToolState(element, name, toolData);
        });
      });

      cornerstone.updateImage(element);
    }, VIEWER_TOOLS_INITIALIZING_TIMEOUT);
  }, [toolsData, initialized, element]);

  const activateTool = mouseTool => {
    setActiveTool(mouseTool);
    cornerstoneTools.setToolActiveForElement(
      element,
      new mouseTool.class().name,
      { mouseButtonMask: 1 },
    );
  };

  const toolCursorStyle = useMemo(() => {
    let style = 'default';
    if (activeTool) {
      const blobURL = window.URL.createObjectURL(
        activeTool.icon.getIconWithPointerSVG(),
      );
      style = `url("${blobURL}") 8 8, auto`;
    }
    return style;
  }, [activeTool]);

  const activeButtonStyle = {
    backgroundColor: '#2f2f2f',
  };

  const prepareSaveData = () => {
    const data = {};
    const saveableTools = [cornerstoneTools.FreehandRoiTool];
    getMouseTools().forEach(mouseTool => {
      if (!saveableTools.includes(mouseTool.class)) {
        return;
      }

      const { name } = new mouseTool.class();
      const toolState = cornerstoneTools.getToolState(element, name);
      if (toolState) {
        data[mouseTool.name] = toolState.data;
      }
    });
    return data;
  };

  const handleToolButtonClick = mouseTool => {
    activateTool(mouseTool);
  };

  const handleSaveButtonClick = () => {
    const data = prepareSaveData();
    onSave(data);
  };

  const handleExportButtonClick = () => {
    const freehandRoiToolData = prepareSaveData()[TOOL_FREEHAND_ROI_NAME] || [];
    const contours = [];
    freehandRoiToolData.forEach(roi => {
      if (
        !roi.handles ||
        roi.handles.invalidHandlePlacement ||
        roi.handles.points.length < 3
      ) {
        return;
      }

      const contour = roi.handles.points.map(point => ({
        x: point.x,
        y: point.y,
      }));

      contours.push(contour);
    });

    const imageUrl = new URL(
      cornerstone.getImage(element).imageId.replace('wadouri:', ''),
    );
    const objectUID = imageUrl.searchParams.get('objectUID');
    if (!objectUID) {
      console.error('objectUID not found in image url', imageUrl);
      return;
    }

    // download image from url
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
      const blob = xhr.response;
      const file = new File([blob], `${objectUID}.dcm`, {
        type: 'application/dicom',
      });
      const a = document.createElement('a');

      a.href = URL.createObjectURL(file);
      a.download = `${objectUID}.dcm`;
      a.click();

      URL.revokeObjectURL(a.href);
    };
    xhr.open('GET', imageUrl);
    xhr.send();

    // download contours
    const blob = new Blob([JSON.stringify(contours)], {
      type: 'application/json',
    });
    const file = new File([blob], `${objectUID}.json`, {
      type: 'application/json',
    });
    const a = document.createElement('a');

    a.href = URL.createObjectURL(file);
    a.download = `${objectUID}.json`;
    a.click();

    URL.revokeObjectURL(a.href);
  };

  if (!initialized || !shouldRenderImages) {
    return null;
  }

  const shouldShowSaveButton = showSingleImageTools && onSave !== undefined;
  const shouldShowExportButton = showSingleImageTools;

  return (
    <Grid container>
      <Grid
        container
        item
        xs={12}
        style={{ backgroundColor: 'black', padding: 3 }}
        justifyContent="space-between"
      >
        <Grid item>
          {getMouseTools().map(mouseTool => {
            const disabled =
              !showSingleImageTools && mouseTool.showIfSingleImage;
            return (
              <Button
                disabled={disabled}
                key={mouseTool.name}
                onClick={() => handleToolButtonClick(mouseTool)}
                style={
                  activeTool && activeTool.class === mouseTool.class
                    ? activeButtonStyle
                    : {}
                }
              >
                <i
                  style={{ opacity: disabled ? 0.3 : 1 }}
                  dangerouslySetInnerHTML={{
                    __html: mouseTool.icon.getIconSVGString(),
                  }}
                />
              </Button>
            );
          })}
        </Grid>
        <Grid item>
          {shouldShowSaveButton && (
            <Button
              style={{ color: 'greenyellow' }}
              onClick={handleSaveButtonClick}
            >
              Save
            </Button>
          )}
          {shouldShowExportButton && (
            <Button
              style={{ color: 'greenyellow' }}
              onClick={handleExportButtonClick}
            >
              Export
            </Button>
          )}
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          cursor: toolCursorStyle,
        }}
      >
        <CornerstoneViewport
          imageIds={urls}
          style={{ minWidth: '100%', height: '512px', flex: '1' }}
          onElementEnabled={event => {
            setElement(event.detail.element);
          }}
        />
      </Grid>
    </Grid>
  );
}

ImageViewer.propTypes = {
  urls: PropTypes.arrayOf(PropTypes.string),
  toolsData: PropTypes.object,
  showSingleImageTools: PropTypes.bool,
  onSave: PropTypes.func,
};

ImageViewer.defaultProps = {
  urls: [],
  toolsData: {},
  showSingleImageTools: false,
  onSave: undefined,
};

export default ImageViewer;
