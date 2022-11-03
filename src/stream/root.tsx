import React, { useContext, useMemo, useState } from "react";
import { useEffect } from "react";

export type ChildrenProps = {
  children: React.ReactNode;
};

class StreamCallbacks {
  static callbacks: Callbacks = {};

  static add(stream: string, callback: StramCallback) {
    if (!StreamCallbacks.callbacks[stream]) {
      StreamCallbacks.callbacks[stream] = new Set();
    }
    StreamCallbacks.callbacks[stream].add(callback);
  }
  static remove(stream: string, callback: StramCallback) {
    if (!StreamCallbacks.callbacks[stream]) {
      return;
    }
    StreamCallbacks.callbacks[stream].delete(callback);
  }
  static notify(stream: string, data: any) {
    if (!StreamCallbacks.callbacks[stream] || data === null) {
      return;
    }
    StreamCallbacks.callbacks[stream].forEach((callback) => callback(data));
  }
}

export function subscribe(name: string, callback: StramCallback) {
  StreamCallbacks.add(name, callback);
}

export function unsubscribe(name: string, callback: StramCallback) {
  StreamCallbacks.remove(name, callback);
}

export const StreamsContext = React.createContext<{
  streams: StreamsData;
  setStreams: React.Dispatch<React.SetStateAction<StreamsData>>;
}>({
  streams: {},
  setStreams: () => ({}),
});

const StreamWatcher = ({ children }: ChildrenProps) => {
  const { streams, setStreams } = useContext(StreamsContext);
  useEffect(() => {
    Object.keys(StreamCallbacks.callbacks).forEach((name) => {
      if (streams[name] !== null && streams[name] !== undefined) {
        StreamCallbacks.notify(name, streams[name]);
        setStreams((prev) => ({ ...prev, [name]: null }));
      }
    });
  }, [setStreams, streams]);
  return <>{children}</>;
};

const StreamRoot = ({ children }: ChildrenProps) => {
  const [streams, setStreams] = useState({});
  const value = useMemo(() => ({ streams, setStreams }), [streams]);

  return (
    <StreamsContext.Provider value={value}>
      <StreamWatcher>{children}</StreamWatcher>
    </StreamsContext.Provider>
  );
};

export default StreamRoot;
