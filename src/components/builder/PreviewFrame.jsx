import { useState } from 'react';
import { createPortal } from 'react-dom';

// An isolated viewport makes Tailwind breakpoints match the selected device.
export default function PreviewFrame({ children }) {
  const [target, setTarget] = useState(null);
  return (
    <iframe
      title="Storefront page preview"
      className="block w-full h-[75dvh] min-h-[480px] border-0 bg-[#FAF9F5]"
      srcDoc={'<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0"><div id="preview-root"></div></body></html>'}
      onLoad={event => {
        const doc = event.currentTarget.contentDocument;
        document.head.querySelectorAll('style, link[rel="stylesheet"]').forEach(node => {
          doc.head.appendChild(node.cloneNode(true));
        });
        setTarget(doc.getElementById('preview-root'));
      }}
    >
      {target && createPortal(children, target)}
    </iframe>
  );
}
