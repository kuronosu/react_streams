import { useState, useCallback } from "react";
import StreamRoot from "./stream/root";
import { useStreamSend, useStreamSubscribe } from "./stream/hooks";

const flexColumn: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const streamName = "color";

const Component = ({ color }: { color: string }) => {
  const [msg, setMsg] = useState("black");
  const send = useStreamSend(streamName);
  const callback = useCallback((data: string) => setMsg(data), [setMsg]);
  const [subscribe, unsubscribe] = useStreamSubscribe(streamName, callback);
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        backgroundColor: msg,
      }}
    >
      <div style={flexColumn}>
        <p>Component {color}</p>
        <button style={{ marginBottom: 10 }} onClick={() => send(color)}>
          Send {color}
        </button>
        <button
          onClick={() => {
            isSubscribed ? unsubscribe() : subscribe();
            setIsSubscribed(!isSubscribed);
          }}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>
    </div>
  );
};

const mainStyles: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "100%",
};

function App() {
  return (
    <div style={mainStyles}>
      <StreamRoot>
        <Component color="red" />
        <Component color="green" />
        <Component color="blue" />
      </StreamRoot>
    </div>
  );
}

export default App;
