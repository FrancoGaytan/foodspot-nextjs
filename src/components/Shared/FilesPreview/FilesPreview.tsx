'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';

interface FilesPreviewProps {
  doc: { uri: string; fileType: string; fileName: string }[];
  onClose: () => void;
}
function FilesPreview(props: FilesPreviewProps) {
  const [imageHeight, setImageHeight] = useState<number | null>(null);
  const [currentDoc, setCurrentDoc] = useState<IDocument[]>([
    {
      uri: props.doc[0]?.uri || '',
      fileType: 'png',
      fileName: 'File Viewer',
    },
  ]);

  useEffect(() => {
    if (props.doc && props.doc.length > 0) {
      setCurrentDoc([
        {
          uri: props.doc[0].uri,
          fileType: props.doc[0].fileType,
          fileName: props.doc[0].fileName,
        },
      ]);
    }
  }, [props.doc]);

  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number }>({ width: 300, height: 300 });

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setImgDimensions({
      width: e.currentTarget.naturalWidth,
      height: e.currentTarget.naturalHeight,
    });
    setImageHeight(e.currentTarget.naturalHeight);
  };

  return (
    <div className={styles.mainContent} style={{ height: imageHeight ? `${Math.min(imageHeight, 600)}px` : 'auto' }}>
      <button onClick={props.onClose} className={styles.closeButton}>
        ✕
      </button>
      {['png', 'jpg', 'jpeg'].includes(props.doc[0]?.fileType) ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image
            src={props.doc[0].uri}
            alt={props.doc[0].fileName}
            width={imgDimensions.width}
            height={imgDimensions.height}
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
            onLoad={handleImageLoad}
            unoptimized
          />
        </div>
      ) : (
        <DocViewer
          documents={currentDoc}
          pluginRenderers={DocViewerRenderers}
          className="my-doc-viewer-style"
          theme={{
            primary: '#5296d8',
            secondary: '#ffffff',
            tertiary: '#5296d899',
            textPrimary: '#ffffff',
            textSecondary: '#5296d8',
            textTertiary: '#00000099',
            disableThemeScrollbar: false,
          }}
        />
      )}
    </div>
  );
}

export default FilesPreview;
