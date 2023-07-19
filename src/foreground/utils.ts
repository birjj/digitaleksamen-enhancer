import { createRoot } from "react-dom/client";

export const timeoutPromise = (t: number) =>
  new Promise((res) => setTimeout(res, t));

export type InjectedHTMLElement = HTMLElement & {
  ___attached?: Set<InjectionConfig>;
};

export type InjectionConfig = {
  selector: string;
  mount: ($elm: InjectedHTMLElement) => void;
  unmount?: ($elm: InjectedHTMLElement) => void;
};

export type InjectedReactElement = InjectedHTMLElement & {
  ___reactRoot?: ReturnType<typeof createRoot>;
};

/** Utility function to ease the writing of attaching a React root */
export function reactInjection(
  selector: string,
  rootGenerator: ($elm: HTMLElement) => HTMLElement | null,
  reactNode: ($elm: HTMLElement) => React.ReactNode
): InjectionConfig {
  return {
    selector,
    mount: ($elm: InjectedReactElement) => {
      const $container = rootGenerator($elm);
      if (!$container) {
        return;
      }
      const root = createRoot($container);
      Object.defineProperty($elm, "___reactRoot", {
        enumerable: false,
        value: root,
      });
      root.render(reactNode($elm));
    },
    unmount: ($elm: InjectedReactElement) => {
      if (!$elm.___reactRoot) {
        return;
      }
      $elm.___reactRoot.render(null);
      $elm.___reactRoot.unmount();
      console.log($elm.innerHTML);
    },
  };
}
