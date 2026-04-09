import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import type { ChangeEventHandler } from 'react'

type BedroomsSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
  section: ChecklistSectionData
}

function BedroomsSection({
  checklist,
  isCollapsed,
  onPhotoChange,
  onRemovePhoto,
  onUpdateChecklistItem,
  onToggleCollapse,
  photoAttachments,
  section,
}: BedroomsSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onPhotoChange={onPhotoChange}
      onRemovePhoto={onRemovePhoto}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      photoAttachments={photoAttachments}
      photoDescription="Upload one or more bedroom images to document furnishings, windows, or general room condition."
      section={section}
    />
  )
}

export default BedroomsSection
