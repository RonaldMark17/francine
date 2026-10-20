import { useContext } from 'react';
import { CoreSelectionContext, CoreSectionsContext } from './CoreContentContext';

export function CoreSectionSlot({ placement }) {
  const renderSections = useContext(CoreSectionsContext);
  const editor = useContext(CoreSelectionContext);
  return <>
    {renderSections?.(placement)}
    {editor?.onAddSection && <div className="relative flex justify-center py-2 border-t border-dashed border-amber-500/40">
      <button type="button" data-insert-placement={placement}
        className="rounded-full border border-amber-600 bg-white px-4 py-2 text-xs font-medium text-amber-800 shadow-sm hover:bg-amber-50">
        + Add section here
      </button>
    </div>}
  </>;
}
