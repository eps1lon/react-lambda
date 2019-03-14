import React from "react";
import hash from "object-hash";

export default function createStylingSolution() {
  const classes = new Map();
  const Context = React.createContext({ classes, theme: {} });

  function useClassName(stylesCreator) {
    const theme = useTheme();
    const styles = React.useMemo(() => stylesCreator(theme), [
      stylesCreator,
      theme
    ]);

    const className = useStylesheet(styles);

    return className;
  }

  function useTheme() {
    const { theme } = React.useContext(Context);

    return theme;
  }

  function useStylesheet(styles) {
    const stylesId = hash(styles);
    const prevStylesId = usePrevious(stylesId);

    /**
     * render side-effect
     * this is important to collect the stylesheet with ssr
     */
    classes.delete(prevStylesId);
    classes.set(stylesId, styles);

    const className = `lambda-${stylesId}`;

    const styleNode = useCreateStylesheet();
    useUpdateStylesheet(styleNode, className, styles);

    return className;
  }

  function Provider(props) {
    const { children, theme } = props;

    const value = React.useMemo(() => ({ classes, theme }), [classes, theme]);

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  return { Provider, useClassName, useTheme };
}

function useCreateStylesheet() {
  const styleNode = React.useRef();

  React.useLayoutEffect(() => {
    const style = document.createElement('style');
    style.type = "text/css";

    const head = document.head;
    head.appendChild(style);

    styleNode.current = style;
    // freeze styleNode in dev
  }, []);

  return styleNode;
}

function useUpdateStylesheet(styleNode, className, styles) {
  React.useLayoutEffect(
    () => {
      const element = document.createElement("div");

      Object.entries(styles).forEach(([name, value]) => {
        element.style.setProperty(name, value);
      });

      const { sheet } = styleNode.current;
      sheet.insertRule(`.${className} { ${element.style.cssText} }`, sheet.cssRules.length);
    },
    [styleNode, className, styles]
  );
}

function usePrevious(value) {
  const prev = React.useRef(value);
  React.useEffect(
    () => {
      prev.current = value;
    },
    [value]
  );

  return prev.current;
}
