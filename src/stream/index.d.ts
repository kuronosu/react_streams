type StreamsData = {
  [key: string]: any;
};

type StramCallback = (stream: any) => void;

type Callbacks = {
  [key: string]: Set<StramCallback>;
};
