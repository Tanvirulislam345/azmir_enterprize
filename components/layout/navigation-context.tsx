"use client";

import { createContext, use, useReducer, type Dispatch, type ReactNode } from "react";

type NavigationState = {
  dropdownOpen: boolean;
  mobileOpen: boolean;
  /** Category id expanded in the mobile accordion. */
  expandedCategory: string | null;
};

type NavigationAction =
  | { type: "toggleDropdown" }
  | { type: "openDropdown" }
  | { type: "closeDropdown" }
  | { type: "toggleMobile" }
  | { type: "toggleCategory"; id: string }
  | { type: "closeAll" };

const initialState: NavigationState = {
  dropdownOpen: false,
  mobileOpen: false,
  expandedCategory: null,
};

function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case "toggleDropdown":
      return { ...state, dropdownOpen: !state.dropdownOpen };
    case "openDropdown":
      return state.dropdownOpen ? state : { ...state, dropdownOpen: true };
    case "closeDropdown":
      return state.dropdownOpen ? { ...state, dropdownOpen: false } : state;
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
