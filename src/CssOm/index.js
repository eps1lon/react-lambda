import React from "react";
import ReactDOM from "react-dom";

export default function StyleSheet(props) {
  const { rules } = props;
  const [container, setContainer] = React.useState();
  React.useLayoutEffect(() => {
    const style = document.createElement("style");
    style.type = "text/css";
    setContainer(style);

    document.head.appendChild(style);
  }, []);

  if (container == null) {
    return null;
  }

  return ReactDOM.createPortal(
    rules.map(rule => {
      return (
        <Rule key={rule.selector} selector={rule.selector}>
          {rule.style}
        </Rule>
      );
    }),
    container
  );
}

function Rule(props) {
  const { children, selector } = props;

  return (
    <>
      {selector} {"{"}
      <Style>{children}</Style>
      {"}"}
    </>
  );
}

function Style(props) {
  const { children } = props;
  return (
    <>
      {Object.entries(children).map(([name, value]) => {
        return `${name}: ${value};\n`;
      })}
    </>
  );
}
