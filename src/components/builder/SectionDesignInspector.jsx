import React from 'react';
import InspectorAccordion from './InspectorAccordion';
import { DEFAULT_SECTION_SETTINGS } from '../../data/sectionSettings';

const inputClass = 'w-full bg-neutral-950 border border-neutral-800 px-3 py-1.5 text-white focus:outline-none focus:border-neutral-500';

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-neutral-400 mb-1 font-medium">{label}</label>
      {children}
    </div>
  );
}

function SegmentedControl({ value, options, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-1 bg-neutral-950 border border-neutral-800 p-1">
      {options.map(option => (
        <button
          type="button"
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-2 py-1.5 text-[10px] transition-colors ${value === option.value ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function SectionDesignInspector({ data = {}, onChange }) {
  const settings = { ...DEFAULT_SECTION_SETTINGS, ...(data.settings || {}) };
  const updateSetting = (field, value) => onChange('settings', { ...settings, [field]: value });

  return (
    <>
      <InspectorAccordion title="Style & Background">
        <Field label="Background Type">
          <SegmentedControl
            value={settings.backgroundType}
            onChange={(value) => updateSetting('backgroundType', value)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'image', label: 'Image' },
              { value: 'solid', label: 'Solid' },
              { value: 'gradient', label: 'Gradient' },
              { value: 'video', label: 'Video' }
            ]}
          />
        </Field>

        {settings.backgroundType === 'image' && (
          <Field label="Background Image URL">
            <input className={`${inputClass} font-mono text-[10px]`} value={settings.backgroundImageUrl} onChange={(event) => updateSetting('backgroundImageUrl', event.target.value)} />
          </Field>
        )}
        {settings.backgroundType === 'solid' && (
          <Field label="Background Color">
            <div className="flex gap-2"><input type="color" value={settings.backgroundColor} onChange={(event) => updateSetting('backgroundColor', event.target.value)} className="h-8 w-10 bg-neutral-950 border border-neutral-800" /><input className={inputClass} value={settings.backgroundColor} onChange={(event) => updateSetting('backgroundColor', event.target.value)} /></div>
          </Field>
        )}
        {settings.backgroundType === 'gradient' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label="From"><input type="color" className="h-8 w-full bg-neutral-950 border border-neutral-800" value={settings.gradientFrom} onChange={(event) => updateSetting('gradientFrom', event.target.value)} /></Field>
              <Field label="To"><input type="color" className="h-8 w-full bg-neutral-950 border border-neutral-800" value={settings.gradientTo} onChange={(event) => updateSetting('gradientTo', event.target.value)} /></Field>
            </div>
            <Field label="Gradient Direction">
              <select className={inputClass} value={settings.gradientDirection} onChange={(event) => updateSetting('gradientDirection', event.target.value)}>
                <option value="to right">Left to Right</option><option value="to bottom">Top to Bottom</option><option value="to bottom right">Diagonal</option>
              </select>
            </Field>
          </div>
        )}
        {settings.backgroundType === 'video' && (
          <Field label="Background Video URL">
            <input className={`${inputClass} font-mono text-[10px]`} value={settings.backgroundVideoUrl} onChange={(event) => updateSetting('backgroundVideoUrl', event.target.value)} placeholder="https://…/video.mp4" />
          </Field>
        )}

        {['image', 'video'].includes(settings.backgroundType) && (
          <>
            <Field label={`Overlay Opacity — ${settings.overlayOpacity}%`}>
              <input type="range" min="0" max="100" step="5" value={settings.overlayOpacity} onChange={(event) => updateSetting('overlayOpacity', Number(event.target.value))} className="w-full accent-white" />
            </Field>
            <Field label="Overlay Tint">
              <select className={inputClass} value={settings.overlayTint} onChange={(event) => updateSetting('overlayTint', event.target.value)}>
                <option value="#171717">Dark Charcoal</option><option value="#000000">Pure Black</option><option value="#F5F0E6">Cream</option><option value="custom">Custom Hex</option>
              </select>
              {settings.overlayTint === 'custom' && <input className={`${inputClass} mt-2`} value={settings.overlayCustomColor || '#000000'} onChange={(event) => updateSetting('overlayCustomColor', event.target.value)} placeholder="#000000" />}
            </Field>
          </>
        )}

        {settings.backgroundType === 'image' && (
          <Field label="Image Focal Point">
            <div className="grid grid-cols-3 gap-1">
              {[
                ['left top', '↖'], ['center top', '↑'], ['right top', '↗'],
                ['left center', '←'], ['center center', '•'], ['right center', '→'],
                ['left bottom', '↙'], ['center bottom', '↓'], ['right bottom', '↘']
              ].map(([position, label]) => (
                <button type="button" key={position} onClick={() => updateSetting('imagePosition', position)} className={`h-8 border text-sm ${settings.imagePosition === position ? 'border-white bg-white text-black' : 'border-neutral-800 text-neutral-400'}`} title={position}>{label}</button>
              ))}
            </div>
          </Field>
        )}

        <Field label="Headline Size">
          <select className={inputClass} value={settings.headlineSize} onChange={(event) => updateSetting('headlineSize', event.target.value)}>
            <option value="h1">H1 — Display</option><option value="h2">H2 — Section Header</option><option value="h3">H3 — Medium Title</option>
          </select>
        </Field>
        <Field label="Text Contrast / Color Mode">
          <SegmentedControl
            value={settings.textMode}
            onChange={(value) => updateSetting('textMode', value)}
            options={[{ value: 'default', label: 'Default' }, { value: 'light', label: 'Light Text' }, { value: 'dark', label: 'Dark Text' }, { value: 'custom', label: 'Custom' }]}
          />
          {settings.textMode === 'custom' && <input type="color" className="mt-2 h-8 w-full bg-neutral-950 border border-neutral-800" value={settings.customTextColor} onChange={(event) => updateSetting('customTextColor', event.target.value)} />}
        </Field>
      </InspectorAccordion>

      <InspectorAccordion title="Layout & Spacing">
        <Field label="Section Height">
          <select className={inputClass} value={settings.height} onChange={(event) => updateSetting('height', event.target.value)}>
            <option value="auto">Auto</option><option value="fullscreen">Full Screen (100vh)</option><option value="compact">Compact (400px)</option><option value="custom">Custom</option>
          </select>
          {settings.height === 'custom' && <input type="number" min="100" max="2000" className={`${inputClass} mt-2`} value={settings.customHeight} onChange={(event) => updateSetting('customHeight', Number(event.target.value))} aria-label="Custom section height in pixels" />}
        </Field>
        <Field label="Vertical Padding">
          <select className={inputClass} value={settings.verticalPadding} onChange={(event) => updateSetting('verticalPadding', event.target.value)}>
            <option value="none">None</option><option value="small">Small (24px)</option><option value="medium">Medium (48px)</option><option value="large">Large (96px)</option>
          </select>
        </Field>
        <Field label="Container Width">
          <select className={inputClass} value={settings.containerWidth} onChange={(event) => updateSetting('containerWidth', event.target.value)}>
            <option value="full">Full Width</option><option value="standard">Standard (1200px)</option><option value="narrow">Narrow / Editorial (800px)</option>
          </select>
        </Field>
      </InspectorAccordion>

      <InspectorAccordion title="Advanced">
        <div className="text-[10px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">Secondary Action</div>
        <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
          <input type="checkbox" className="accent-white" checked={settings.secondaryButtonEnabled} onChange={(event) => updateSetting('secondaryButtonEnabled', event.target.checked)} />
          Enable Secondary Button
        </label>
        {settings.secondaryButtonEnabled && (
          <>
            <Field label="Button Label"><input className={inputClass} value={settings.secondaryButtonText} onChange={(event) => updateSetting('secondaryButtonText', event.target.value)} /></Field>
            <Field label="Target Link"><input className={inputClass} value={settings.secondaryButtonLink} onChange={(event) => updateSetting('secondaryButtonLink', event.target.value)} placeholder="about or page slug" /></Field>
            <Field label="Button Style">
              <select className={inputClass} value={settings.secondaryButtonStyle} onChange={(event) => updateSetting('secondaryButtonStyle', event.target.value)}>
                <option value="primary">Primary Solid</option><option value="outline">Secondary Outline</option><option value="minimal">Minimal Text Link</option>
              </select>
            </Field>
          </>
        )}
        <div className="border-t border-neutral-800 pt-4 text-[10px] uppercase tracking-[0.14em] text-neutral-500 font-semibold">Visibility & Navigation</div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer"><input type="checkbox" className="accent-white" checked={settings.hideOnMobile} onChange={(event) => updateSetting('hideOnMobile', event.target.checked)} /> Hide on Mobile</label>
          <label className="flex items-center gap-2 text-neutral-300 cursor-pointer"><input type="checkbox" className="accent-white" checked={settings.hideOnDesktop} onChange={(event) => updateSetting('hideOnDesktop', event.target.checked)} /> Hide on Desktop</label>
        </div>
        <Field label="Custom Anchor ID"><input className={inputClass} value={settings.anchorId} onChange={(event) => updateSetting('anchorId', event.target.value)} placeholder="contact-us" /></Field>
        <Field label="Scroll Animation">
          <select className={inputClass} value={settings.scrollAnimation} onChange={(event) => updateSetting('scrollAnimation', event.target.value)}>
            <option value="none">None</option><option value="fade">Fade In</option><option value="slide">Slide Up</option><option value="zoom">Zoom In</option>
          </select>
        </Field>
      </InspectorAccordion>
    </>
  );
}
