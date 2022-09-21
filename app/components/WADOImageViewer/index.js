import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CornerstoneViewport from 'react-cornerstone-viewport';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';
import config from '../../params';

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

function getTools() {
  return [
    // Mouse
    {
      name: 'Wwwc',
      mode: 'active',
      modeOptions: { mouseButtonMask: 1 },
    },
    {
      name: 'Zoom',
      mode: 'active',
      modeOptions: { mouseButtonMask: 2 },
    },
    {
      name: 'Pan',
      mode: 'active',
      modeOptions: { mouseButtonMask: 4 },
    },
    // Scroll
    { name: 'StackScrollMouseWheel', mode: 'active' },
    // Touch
    { name: 'PanMultiTouch', mode: 'active' },
    { name: 'ZoomTouchPinch', mode: 'active' },
    { name: 'StackScrollMultiTouch', mode: 'active' },
  ];
}

function ImageViewer(props) {
  const { urls } = props;
  const [initialized, setInitialized] = useState(false);
  const shouldRenderImages = Array.isArray(urls) && urls.length !== 0;

  useEffect(() => {
    if (shouldRenderImages && !initialized) {
      initCornerstone();
      setInitialized(true);
    }
  }, []);

  if (!initialized || !shouldRenderImages) {
    return null;
  }

  return (
    <CornerstoneViewport
      tools={getTools()}
      imageIds={urls}
      style={{ minWidth: '100%', height: '512px', flex: '1' }}
    />
  );
}

ImageViewer.propTypes = {
  urls: PropTypes.arrayOf(PropTypes.string),
};

export default ImageViewer;
