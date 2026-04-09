import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import type { ChangeEventHandler } from 'react'

type BathroomsSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
  section: ChecklistSectionData
}

function BathroomsSection({
  checklist,
  isCollapsed,
  onPhotoChange,
  onRemovePhoto,
  onUpdateChecklistItem,
  onToggleCollapse,
  photoAttachments,
  section,
}: BathroomsSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onPhotoChange={onPhotoChange}
      onRemovePhoto={onRemovePhoto}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      photoAttachments={photoAttachments}
      photoDescription="Upload one or more bathroom images for ventilation, moisture, or fixture condition."
      section={section}
    />
  )
}

export default BathroomsSection
