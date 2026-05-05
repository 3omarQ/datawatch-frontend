import { RefObject, useCallback, useEffect, useReducer, useRef } from 'react';

export type CaptureMode = 'text' | 'list';

export interface HoverInfo { tag: string; text: string; }
export interface Field { sel: string; label: string; isExact: boolean; name?: string; }

export interface PaginationConfig {
  selector: string;
  label: string;
  maxPages: number;
}

interface State {
  captureMode: CaptureMode;
  hoverInfo: HoverInfo | null;
  fields: Field[];
  pagination: PaginationConfig | null;
  pickingPagination: boolean;
}

type Action =
  | { type: 'SET_MODE'; mode: CaptureMode }
  | { type: 'SET_HOVER'; tag: string; text: string }
  | { type: 'ADD_FIELD'; field: Field }
  | { type: 'REMOVE_FIELD'; sel: string }
  | { type: 'RENAME_FIELD'; sel: string; name: string }
  | { type: 'SET_PAGINATION'; pagination: PaginationConfig }
  | { type: 'CLEAR_PAGINATION' }
  | { type: 'SET_PICKING_PAGINATION'; active: boolean }
  | { type: 'SET_MAX_PAGES'; maxPages: number }
  | { type: 'RESET' };

const initial: State = {
  captureMode: 'text',
  hoverInfo: null,
  fields: [],
  pagination: null,
  pickingPagination: false,
};

function autoNameFromSelector(selector: string): string {
  const s = selector.trim();
  if (!s) return 'field';

  // to take last segment after combinators
  const lastSegment = s.split(/\s+|>|\+|~/).filter(Boolean).pop() ?? s;

  // to remove pseudo classes/elements
  const noPseudo = lastSegment.replace(/:{1,2}[a-zA-Z-]+(\(.+\))?/g, '');

  // prefer id
  const idMatch = noPseudo.match(/#([a-zA-Z0-9_-]+)/);
  if (idMatch?.[1]) return idMatch[1];

  // prefer last class
  const classMatches = [...noPseudo.matchAll(/\.([a-zA-Z0-9_-]+)/g)];
  if (classMatches.length > 0) {
    return classMatches[classMatches.length - 1][1];
  }

  // fallback tag
  const tagMatch = noPseudo.match(/^[a-zA-Z][a-zA-Z0-9-]*/);
  if (tagMatch?.[0]) return tagMatch[0];

  return 'field';
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_MODE':
      return { ...initial, captureMode: action.mode };
    case 'SET_HOVER':
      return { ...state, hoverInfo: { tag: action.tag, text: action.text } };
    case 'ADD_FIELD':
      if (state.fields.find((f) => f.sel === action.field.sel)) return state;
      return { ...state, fields: [...state.fields, action.field] };
    case 'REMOVE_FIELD':
      return { ...state, fields: state.fields.filter((f) => f.sel !== action.sel) };
    case 'RENAME_FIELD':
      return {
        ...state,
        fields: state.fields.map((f) =>
          f.sel === action.sel ? { ...f, name: action.name } : f
        ),
      };
    case 'SET_PAGINATION':
      return { ...state, pagination: action.pagination, pickingPagination: false };
    case 'CLEAR_PAGINATION':
      return { ...state, pagination: null, pickingPagination: false };
    case 'SET_PICKING_PAGINATION':
      return { ...state, pickingPagination: action.active };
    case 'SET_MAX_PAGES':
      if (!state.pagination) return state;
      return { ...state, pagination: { ...state.pagination, maxPages: action.maxPages } };
    case 'RESET':
      return initial;
    default:
      return state;
  }
}

export function useElementPicker(iframeRef: RefObject<HTMLIFrameElement | null>) {
  const [state, dispatch] = useReducer(reducer, initial);
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  const post = useCallback((msg: object) => {
    iframeRef.current?.contentWindow?.postMessage(msg, '*');
  }, [iframeRef]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const msg = e.data;
      if (!msg?.type) return;

      if (msg.type === 'EP_HOVER') {
        dispatch({ type: 'SET_HOVER', tag: msg.tag ?? msg.tagName, text: msg.text });
        return;
      }

      if (msg.type === 'EP_CLICK') {
        const { captureMode } = stateRef.current;
        const isExact = captureMode === 'text';
        const sel = !isExact && msg.listSel ? msg.listSel : msg.exact;
        const name = autoNameFromSelector(sel);
        dispatch({ type: 'ADD_FIELD', field: { sel, label: msg.text || msg.tag, isExact, name } });
        post({ type: 'EP_ADD_FIELD', sel, isExact });
        return;
      }

      if (msg.type === 'EP_PAGINATION_PICKED') {
        dispatch({
          type: 'SET_PAGINATION',
          pagination: {
            selector: msg.sel,
            label: msg.text || msg.sel,
            maxPages: stateRef.current.pagination?.maxPages ?? 5,
          },
        });
        post({ type: 'EP_SET_PAGINATION_MODE', active: false });
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [post]);

  const setMode = useCallback((mode: CaptureMode) => {
    dispatch({ type: 'SET_MODE', mode });
    post({ type: 'EP_RESET' });
  }, [post]);

  const removeField = useCallback((sel: string) => {
    dispatch({ type: 'REMOVE_FIELD', sel });
    post({ type: 'EP_REMOVE_FIELD', sel });
  }, [post]);

  const renameField = useCallback((sel: string, name: string) => {
    dispatch({ type: 'RENAME_FIELD', sel, name });
  }, []);

  const startPickingPagination = useCallback(() => {
    dispatch({ type: 'SET_PICKING_PAGINATION', active: true });
    post({ type: 'EP_SET_PAGINATION_MODE', active: true });
  }, [post]);

  const clearPagination = useCallback(() => {
    dispatch({ type: 'CLEAR_PAGINATION' });
    post({ type: 'EP_CLEAR_PAGINATION' });
    post({ type: 'EP_SET_PAGINATION_MODE', active: false });
  }, [post]);

  const setMaxPages = useCallback((maxPages: number) => {
    dispatch({ type: 'SET_MAX_PAGES', maxPages });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'RESET' });
    post({ type: 'EP_RESET' });
  }, [post]);

  const getFinalSelector = useCallback(
    () => state.fields.map((f) => f.sel).join(', '),
    [state.fields]
  );

  return {
    captureMode: state.captureMode,
    hoverInfo: state.hoverInfo,
    fields: state.fields,
    pagination: state.pagination,
    pickingPagination: state.pickingPagination,
    setMode,
    removeField,
    renameField,
    startPickingPagination,
    clearPagination,
    setMaxPages,
    reset,
    getFinalSelector,
  };
}