"use client";

import { createContext, use, useReducer, type Dispatch, type ReactNode } from "react";

/** Header pop-ups; only one can be open at a time. */
export type MenuId = "products" | "about" | "theme" | "language";

type NavigationState = {
  openMenu: MenuId | null;
  mobileOpen: boolean;
  /** Category id expanded in the mobile accordion. */
  expandedCategory: string | null;
};

type NavigationAction =
  | { type: "toggleMenu"; id: MenuId }
  | { type: "openMenu"; id: MenuId }
  | { type: "closeMenu"; id: MenuId }
  | { type: "toggleMobile" }
  | { type: "toggleCategory"; id: string }
  | { type: "closeAll" };

const initialState: NavigationState = {
  openMenu: null,
  mobileOpen: false,
  expandedCategory: null,
};

function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case "toggleMenu":
      return { ...state, mobileOpen: false, openMenu: state.openMenu === action.id ? null : action.id };
    case "openMenu":
      return state.openMenu === action.id ? state : { ...state, mobileOpen: false, openMenu: action.id };
    case "closeMenu":
      return state.openMenu === action.id ? { ...state, openMenu: null } : state;
    case "toggleMobile":
      return { ...initialState, mobileOpen: !state.mobileOpen };
    case "toggleCategory":
      return { ...state, expandedCategory: state.expandedCategory === action.id ? null : action.id };
    case "closeAll":
      // Returning the shared constant lets React bail out when nothing was open.
      return initialState;
  }
}

// State and dispatch live in separate contexts so dispatch-only consumers never re-render.
const NavigationStateContext = createContext<NavigationState | null>(null);
const NavigationDispatchContext = createContext<Dispatch<NavigationAction> | null>(null);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  return (
    <NavigationDispatchContext value={dispatch}>
      <NavigationStateContext value={state}>{children}</NavigationStateContext>
    </NavigationDispatchContext>
  );
}

export function useNavigationState() {
  const state = use(NavigationStateContext);
  if (!state) throw new Error("useNavigationState must be used inside NavigationProvider");
  return state;
}

export function useNavigationDispatch() {
  const dispatch = use(NavigationDispatchContext);
  if (!dispatch) throw new Error("useNavigationDispatch must be used inside NavigationProvider");
  return dispatch;
}
