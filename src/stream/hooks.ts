import { useCallback, useContext, useEffect } from "react";
import { StreamsContext, subscribe, unsubscribe } from "./root";

export const useStreamSend = (name: string) => {
  const { setStreams } = useContext(StreamsContext);
  const send = (data: any) => {
    setStreams((prev) => ({ ...prev, [name]: data }));
  };

  return send;
};

export const useStreamSubscribe = (name: string, callback: StramCallback) => {
  const _subscribe = useCallback(
    () => subscribe(name, callback),
    [name, callback]
  );

  const _unsubscribe = useCallback(
    () => unsubscribe(name, callback),
    [name, callback]
  );

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, [_subscribe, _unsubscribe]);

  return [_subscribe, _unsubscribe];
};
