"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type ModalOptions = {
  title?: string;
  isBlocking?: boolean;
  width?: number | string;
  maxHeight?: number | string;
  onClose?: () => void;
};

export type OpenFn = (node: React.ReactNode, opts?: ModalOptions) => void;

export type ModalContextType = {
  open: OpenFn;
  close: () => void;
  isOpen: boolean;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const useModal = (): ModalContextType => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside <ModalProvider/>");
  return ctx;
};

export function ModalProvider(props: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode | null>(null);
  const [opts, setOpts] = useState<ModalOptions | undefined>(undefined);
  const isOpen = !!content;
  const portalEl = usePortalRoot();

  const close = useCallback(() => {
    setContent(null);
    const cb = opts?.onClose;
    setTimeout(() => cb && cb(), 0);
  }, [opts]);

  const open: OpenFn = useCallback((node, options) => {
    setOpts(options);
    setContent(node);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <ModalContext.Provider value={value}>
      {props.children}
      {portalEl && isOpen && createPortal(
        <ModalShell
          title={opts?.title}
          isBlocking={!!opts?.isBlocking}
          width={opts?.width}
          maxHeight={opts?.maxHeight}
          onClose={close}
        >
          {content}
        </ModalShell>,
        portalEl
      )}
    </ModalContext.Provider>
  );
}


function ModalShell(props: {
  title?: string;
  isBlocking: boolean;
  width?: number | string;
  maxHeight?: number | string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const title = props.title;
  const isBlocking = props.isBlocking;
  const width = props.width !== undefined ? props.width : "min(560px, calc(100vw - 32px))";
  const maxHeight = props.maxHeight !== undefined ? props.maxHeight : "80vh";
  const onClose = props.onClose;
  const children = props.children;

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus({ preventScroll: true });
    return () => prev?.focus?.();
  }, []);

  const overlayClick = () => { if (!isBlocking) onClose(); };

  return (
    <div style={styles.root} aria-hidden={false}>
      <div style={styles.overlay} onClick={overlayClick} />
      <div style={styles.center}>
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={title || "Modal"}
          tabIndex={-1}
          style={{
            ...styles.panel,
            width: typeof width === "number" ? `${width}px` : width,
            maxHeight,
          }}
        >
          {title && (
            <div style={styles.header}>
              <div style={{ fontWeight: 600 }}>{title}</div>
              {!isBlocking && (
                <button aria-label="Close" onClick={onClose} style={styles.closeBtn}>
                  ×
                </button>
              )}
            </div>
          )}
          <div style={styles.body}>{children}</div>
        </div>
      </div>
    </div>
  );
}

function usePortalRoot() {
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById("app-portal");
    if (!el) {
      el = document.createElement("div");
      el.id = "app-portal";
      document.body.appendChild(el);
    }
    setPortalEl(el);
  }, []);

  return portalEl;
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
  },
  center: {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    padding: 16,
    overflow: "auto",
  },
  panel: {
    boxSizing: "border-box",
    background: "var(--color-surface)",
    color: "var(--color-text)",
    border: "1px solid var(--color-border)",
    borderRadius: "var(--radius-lg)",
    boxShadow: "var(--elevation-overlay)",
    maxWidth: "min(100%, 720px)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    maxHeight: "calc(100dvh - 32px)",
    outline: "none",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: "0 0 auto",
    padding: "clamp(12px, 4vw, 16px) clamp(14px, 5vw, 20px)",
    borderBottom: "1px solid var(--color-border)",
    color: "var(--color-text)",
    fontSize: 18,
  },
  body: {
    boxSizing: "border-box",
    minWidth: 0,
    minHeight: 0,
    padding: "clamp(12px, 4vw, 20px)",
    overflow: "auto",
    color: "var(--color-text)",
  },
  closeBtn: {
    border: "none",
    background: "transparent",
    color: "var(--color-text-secondary)",
    fontSize: 24,
    lineHeight: 1,
    cursor: "pointer",
    padding: 4,
    borderRadius: "var(--radius-sm)",
  },
};