import React from "react";
import ReactDOM from "react-dom";

import createStylingSolution from "./createStylingSolution";

const { Provider, useClassName } = createStylingSolution();

function Text(props) {
  const { children, color } = props;
  const stylesCreator = React.useMemo(() => {
    return theme => {
      return {
        "background-color": theme.backgroundColor,
        color
      };
    };
  }, [color]);

  const className = useClassName(stylesCreator);

  return <div className={className}>{children}</div>;
}

function UncontrolledText(props) {
  const { children, defaultColor, id } = props;
  const [color, setColor] = React.useState(defaultColor);
  function handleInput(event) {
    setColor(event.currentTarget.value);
  }

  return (
    <>
      <label htmlFor={id}>{id} color: </label>
      <input id={id} onChange={handleInput} value={color} />
      <Text color={color}>{children}</Text>
    </>
  );
}

function App() {
  const [color, setColor] = React.useState("black");
  function handleInput(event) {
    setColor(event.currentTarget.value);
  }

  const theme = React.useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <Provider theme={theme}>
      <label htmlFor="themeColor">background color: </label>
      <input id="themeColor" onChange={handleInput} value={color} />
      <br />
      <UncontrolledText defaultColor="red" id="ex1">
        Hello, World
      </UncontrolledText>
      <UncontrolledText defaultColor="yellow" id="ex2">
        Hello, from another World
      </UncontrolledText>
    </Provider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
