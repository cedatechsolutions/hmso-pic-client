import type { ChangeEventHandler } from 'react'
import type {
  ChecklistSectionData,
  ChecklistState,
  FrontPhotoState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import {
  helperTextClasses,
  previewCardClasses,
  previewMetaClasses,
  previewPlaceholderClasses,
  sectionKickerClasses,
  sectionTitleClasses,
  uploadButtonClasses,
  uploadCardClasses,
  uploadDropzoneClasses,
  uploadPanelClasses,
} from './styles'

type ExteriorAccessSectionProps = {
  checklist: ChecklistState
  frontPhoto: FrontPhotoState
  isCollapsed: boolean
  onFrontPhotoChange: ChangeEventHandler<HTMLInputElement>
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  section: ChecklistSectionData
}

function ExteriorAccessSection({
  checklist,
  frontPhoto,
  isCollapsed,
  onFrontPhotoChange,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: ExteriorAccessSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      section={section}
    >
      <div className={uploadCardClasses}>
        <div className="grid gap-4">
          <span className={sectionKickerClasses}>Photo Evidence</span>
          <div className="grid gap-2">
            <h3 className={sectionTitleClasses}>Photo of the Front</h3>
            <p className="text-sm leading-6 text-slate-500">
              Upload a front elevation photo for the inspection record.
            </p>
          </div>

          <label className={uploadDropzoneClasses}>
            <input type="file" accept="image/*" onChange={onFrontPhotoChange} />
            <span className={uploadButtonClasses}>Choose image</span>
            <span className={helperTextClasses}>
              JPG, PNG, or HEIC supported by the browser
            </span>
          </label>
        </div>

        <div className={uploadPanelClasses}>
          {frontPhoto.previewUrl ? (
            <div className={previewCardClasses}>
              <img
                className="block h-[240px] w-full object-cover sm:h-[280px]"
                src={frontPhoto.previewUrl}
                alt="Front of property preview"
              />
              <div className={previewMetaClasses}>
                <strong>{frontPhoto.fileName}</strong>
                <span className={helperTextClasses}>
                  Attached to this inspection session
                </span>
              </div>
            </div>
          ) : (
            <div className={`${previewCardClasses} ${previewPlaceholderClasses}`}>
              <strong>Front image preview will appear here</strong>
              <span className={helperTextClasses}>
                Upload the front image to attach photo evidence to this section.
              </span>
            </div>
          )}
        </div>
      </div>
    </ChecklistSectionCard>
  )
}

export default ExteriorAccessSection
