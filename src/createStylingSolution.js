import React from "react";
import hash from "object-hash";

import CssOm from "./CssOm";

export default function createStylingSolution() {
  const Context = React.createContext({
    addClass: () => {
      //warn
    },
    classes: new Map(),
    theme: {}
  });

  function useClassName(stylesCreator) {
    const theme = useTheme();
    const styles = React.useMemo(() => stylesCreator(theme), [
      stylesCreator,
      theme
    ]);

    const className = useStylesheet(styles);

    return className;
  }

  function useAddClass() {
    const { addClass } = React.useContext(Context);

    return addClass;
  }

  function useTheme() {
    const { theme } = React.useContext(Context);

    return theme;
  }

  function useStylesheet(styles) {
    const stylesId = hash(styles);
    const addClass = useAddClass();

    const className = `lambda-${stylesId}`;
    React.useMemo(() => addClass(className, styles), [className, styles]);

    return className;
  }

  function Provider(props) {
    const { children, theme } = props;
    const [classes, dispatch] = React.useReducer((state, action) => {
      switch (action.type) {
        case "ADD":
          return new Map(
            state.set(action.payload.className, action.payload.style)
          );
        case "REMOVE":
        state.delete(action.payload.className);
          return state;
        default:
          throw new Error(`unrecognized type '${action.type}'`);
      }
    }, new Map());

    const addClass = React.useCallback((className, style) => {
      dispatch({ type: "ADD", payload: { className, style } });
    }, []);

    const value = React.useMemo(() => ({ addClass, classes, theme }), [
      addClass,
      classes,
      theme
    ]);

    const rules = React.useMemo(() => {
      return Array.from(classes.entries()).map(([className, style]) => {
        return {
          selector: `.${className}`,
          style
        };
      });
    }, [classes]);

    return (
      <Context.Provider value={value}>
        <CssOm rules={rules} />
        {children}
      </Context.Provider>
    );
  }

  return { Provider, useClassName, useTheme };
}

/* function usePrevious(value) {
  const prev = React.useRef(value);
  React.useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
} */
