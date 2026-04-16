// Lazy-load Pyodide from the official CDN. We dynamically inject the loader
// script only when the user first opens a Run-code tab, so the rest of the
// site stays fast.

const PYODIDE_VERSION = '0.26.4';
const PYODIDE_URL = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/pyodide.js`;
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type PyodideInterface = {
  runPython: (code: string) => unknown;
  runPythonAsync: (code: string) => Promise<unknown>;
  loadPackage: (pkg: string | string[]) => Promise<void>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
  globals: { get: (k: string) => unknown; set: (k: string, v: unknown) => void };
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
  }
}

let pyodidePromise: Promise<PyodideInterface> | null = null;

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-src="${src}"]`)) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

export function getPyodide(onProgress?: (stage: string) => void): Promise<PyodideInterface> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = (async () => {
    onProgress?.('Loading Pyodide runtime…');
    await loadScript(PYODIDE_URL);
    if (!window.loadPyodide) throw new Error('loadPyodide not found after script load');
    onProgress?.('Initializing Python 3.12 in WebAssembly…');
    const py = await window.loadPyodide({ indexURL: PYODIDE_INDEX });
    onProgress?.('Loading numpy…');
    await py.loadPackage('numpy');
    onProgress?.('Ready.');
    return py;
  })();
  return pyodidePromise;
}
