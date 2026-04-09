import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import type { ChangeEventHandler } from 'react'

type ExteriorAccessSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
  section: ChecklistSectionData
}

function ExteriorAccessSection({
  checklist,
  isCollapsed,
  onUpdateChecklistItem,
  onPhotoChange,
  onRemovePhoto,
  onToggleCollapse,
  photoAttachments,
  section,
}: ExteriorAccessSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onPhotoChange={onPhotoChange}
      onRemovePhoto={onRemovePhoto}
      onToggleCollapse={onToggleCollapse}
      photoAttachments={photoAttachments}
      photoDescription="Upload one or more exterior and access photos for the inspection record."
      photoTitle="Photo evidence"
      section={section}
    />
  )
}

export default ExteriorAccessSection
