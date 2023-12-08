import {
  useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState,
} from 'react';
import { getConfig } from '@edx/frontend-platform';
import { PLUGIN_MOUNTED, PLUGIN_READY, PLUGIN_UNMOUNTED } from './constants';

export function usePluginSlot(id) {
  if (getConfig().plugins[id] !== undefined) {
    return getConfig().plugins[id];
  }
  return { keepDefault: true, plugins: [] };
}

// [NOTE] Listening for events

// [NOTE] Hook used to listen for events in below functions
export function useMessageEvent(srcWindow, type, callback) {
  // [NOTE] useLayoutEffect is called before the browswer repaints the screen (React docs: https://react.dev/reference/react/useLayoutEffect)
  useLayoutEffect(() => {
    // [NOTE] Create a listener callback function 
    const listener = (event) => {
      // Filter messages to those from our source window.
      // [NOTE] the "source window" is determined by the below useHostEvent and usePluginEvent functions
      if (event.source === srcWindow) {
        // [NOTE] Fire callback if the type from the listened event is a match to the type from the message event
        if (event.data.type === type) {
          callback({ type, payload: event.data.payload });
        }
      }
    };
    // [NOTE] Add the listener if the srcWindow is not null
    if (srcWindow !== null) {
      global.addEventListener('message', listener);
    }
    // [NOTE] Cleanup function
    return () => {
      global.removeEventListener('message', listener);
    };
  }, [srcWindow, type, callback]);
}

// [NOTE] Used by Plugin component to use a PLUGIN_RESIZE event
export function useHostEvent(type, callback) {
  useMessageEvent(global.parent, type, callback);
}

// [NOTE] Used by PluginContainerIframe
export function usePluginEvent(iframeElement, type, callback) {
  const contentWindow = iframeElement ? iframeElement.contentWindow : null;
  useMessageEvent(contentWindow, type, callback);
}

// [NOTE] Dispatching events

// [NOTE] Called by dispatchHostEvent and dispatchPluginEvent
export function dispatchMessageEvent(targetWindow, message, targetOrigin) {
  // Checking targetOrigin falsiness here since '', null or undefined would all be reasons not to
  // try to post a message to the origin.
  if (targetOrigin) {
    targetWindow.postMessage(message, targetOrigin);
  }
}

// [NOTE] Called inside PluginContainerIframe to dispatch a PLUGIN_RESIZE event
export function dispatchPluginEvent(iframeElement, message, targetOrigin) {
  dispatchMessageEvent(iframeElement.contentWindow, message, targetOrigin);
}

// [NOTE] Called by below dispatch functions
export function dispatchHostEvent(message) {
  dispatchMessageEvent(global.parent, message, global.document.referrer);
}

// [NOTE] Called inside Plugin when 'ready' prop is true
export function dispatchReadyEvent() {
  dispatchHostEvent({ type: PLUGIN_READY });
}

// [NOTE] Called inside Plugin after rendering in a useEffect with [] dependencies — https://react.dev/learn/synchronizing-with-effects
export function dispatchMountedEvent() {
  dispatchHostEvent({ type: PLUGIN_MOUNTED });
}

// [NOTE] called inside return of the same useEffect as above to cleanup
export function dispatchUnmountedEvent() {
  dispatchHostEvent({ type: PLUGIN_UNMOUNTED });
}

export function useElementSize() {
  const observerRef = useRef();

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [element, setElement] = useState(null);

  // ????
  const measuredRef = useCallback(_element => {
    setElement(_element);
  }, []);

  useEffect(() => {
    observerRef.current = new ResizeObserver(() => {
      if (element) {
        setDimensions({
          width: element.clientWidth,
          height: element.clientHeight,
        });
        setOffset({
          x: element.offsetLeft,
          y: element.offsetTop,
        });
      }
    });
    if (element) {
      observerRef.current.observe(element);
    }
  }, [element]);

  return useMemo(
    () => ([measuredRef, element, dimensions.width, dimensions.height, offset.x, offset.y]),
    [measuredRef, element, dimensions, offset],
  );
}
