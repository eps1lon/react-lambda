import React from "react";
import ReactDOM from "react-dom";

import createStylingSolution from "./createStylingSolution";

const { Provider, useClassName } = createStylingSolution();

function Text(props) {
  const { children, color } = props;
  const stylesCreator = React.useMemo(
    () => {
      return theme => {
        return {
          color
        };
      };
    },
    [color]
  );

  const className = useClassName(stylesCreator);

  return <div className={className}>{children}</div>;
}

function App() {
  const [color, setColor] = React.useState("blue");
  function handleInput(event) {
    setColor(event.currentTarget.value);
  }

  return (
    <Provider>
      <label htmlFor="color">color</label>
      <input id="color" onChange={handleInput} value={color} />
      <Text color={color}>Hello, World</Text>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
