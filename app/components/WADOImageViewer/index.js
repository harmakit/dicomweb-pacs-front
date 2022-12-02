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

function initCornerstone() {
  // Cornerstone Tools
  cornerstoneTools.external.cornerstone = cornerstone;
  cornerstoneTools.external.Hammer = Hammer;
  cornerstoneTools.external.cornerstoneMath = cornerstoneMath;

  cornerstoneTools.init();

  cornerstoneTools.toolStyle.setToolWidth(2);
  cornerstoneTools.toolColors.setToolColor('rgb(255, 255, 0)');
  cornerstoneTools.toolColors.setActiveColor('rgb(0, 255, 0)');

  cornerstoneTools.store.state.touchProximity = 40;

  // IMAGE LOADER
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
      class: cornerstoneTools.WwwcTool,
      icon: wwwcCursor,
    },
    {
      class: cornerstoneTools.WwwcRegionTool,
      icon: wwwcRegionCursor,
    },
    {
      class: cornerstoneTools.ZoomTool,
      icon: zoomCursor,
    },
    {
      class: cornerstoneTools.FreehandRoiTool,
      icon: freehandRoiCursor,
    },
    {
      class: cornerstoneTools.EraserTool,
      icon: eraserCursor,
    },
  ];
}

function ImageViewer(props) {
  const { urls } = props;
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
      getMouseTools().forEach(mouseTool => {
        cornerstoneTools.addToolForElement(element, mouseTool.class);
      });

      cornerstoneTools.addToolForElement(element, cornerstoneTools.PanTool);
      cornerstoneTools.setToolActiveForElement(
        element,
        new cornerstoneTools.PanTool().name,
        {
          mouseButtonMask: 2,
        },
      );

      getDefaultTools().forEach(tool => {
        cornerstoneTools.addToolForElement(element, tool);
        // eslint-disable-next-line new-cap
        cornerstoneTools.setToolActiveForElement(element, new tool().name, {});
      });

      activateTool(getMouseTools()[0]);
    }
  }, [element]);

  const handleToolButtonClick = mouseTool => {
    activateTool(mouseTool);
  };

  const activateTool = mouseTool => {
    setActiveTool(mouseTool);
    cornerstoneTools.setToolActiveForElement(
      element,
      // eslint-disable-next-line new-cap
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
      style = `url("${blobURL}") 0 0, auto`;
    }
    return style;
  }, [activeTool]);

  if (!initialized || !shouldRenderImages) {
    return null;
  }

  const activeButtonStyle = {
    backgroundColor: '#2f2f2f',
  };

  return (
    <Grid container>
      <Grid item xs={12} style={{ backgroundColor: 'black' }}>
        {getMouseTools().map(mouseTool => (
          <Button
            key={mouseTool.class.name}
            onClick={() => handleToolButtonClick(mouseTool)}
            style={
              activeTool && activeTool.class.name === mouseTool.class.name
                ? activeButtonStyle
                : {}
            }
          >
            <i
              dangerouslySetInnerHTML={{
                __html: mouseTool.icon.getIconSVGString(),
              }}
            />
          </Button>
        ))}
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
};

export default ImageViewer;
