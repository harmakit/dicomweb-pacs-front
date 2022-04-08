import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import CornerstoneViewport from 'react-cornerstone-viewport';
import cornerstone from 'cornerstone-core';
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import cornerstoneMath from 'cornerstone-math';
import cornerstoneTools from 'cornerstone-tools';
import dicomParser from 'dicom-parser';
import Hammer from 'hammerjs';

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
  cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
  cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
  cornerstoneWADOImageLoader.webWorkerManager.initialize({
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

// imageIds example:
//   'wadouri:http://localhost:8042/wado?objectUID=1.3.6.1.4.1.5962.99.1.1647423216.1757746261.1397511827184.202.0&studyUID=1.3.6.1.4.1.5962.99.1.1647423216.1757746261.1397511827184.6.0&seriesUID=1.3.6.1.4.1.5962.99.1.1647423216.1757746261.1397511827184.203.0&requestType=WADO&contentType=application%2Fdicom',
//   'wadouri:http://localhost:8042/wado?objectUID=1.3.6.1.4.1.5962.99.1.1647423216.1757746261.1397511827184.204.0&studyUID=1.3.6.1.4.1.5962.99.1.1647423216.1757746261.1397511827184.6.0&seriesUID=1.3.6.1.4.1.5962.99.1.1647423216.1757746261.1397511827184.203.0&requestType=WADO&contentType=application%2Fdicom',

export default ImageViewer;
