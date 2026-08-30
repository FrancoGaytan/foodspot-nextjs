'use client';

import { DragEvent, PropsWithChildren, useRef, useState } from 'react';
import styles from './styles.module.scss';

interface DragAndDropProps extends PropsWithChildren {
  onFile: (file: File) => void;
  accept?: string;
}

export default function DragAndDrop(props: DragAndDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file?: File) {
    if (file) props.onFile(file);
  }

  function drop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  return <div className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`} onDragOver={event => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={drop} onClick={() => inputRef.current?.click()} role="button" tabIndex={0} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click(); }}>
    {props.children}
    <input ref={inputRef} type="file" accept={props.accept} onChange={event => handleFile(event.target.files?.[0])} />
  </div>;
}
