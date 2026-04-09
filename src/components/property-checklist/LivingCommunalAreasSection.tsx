import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import type { ChangeEventHandler } from 'react'

type LivingCommunalAreasSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
  section: ChecklistSectionData
}

function LivingCommunalAreasSection({
  checklist,
  isCollapsed,
  onPhotoChange,
  onRemovePhoto,
  onUpdateChecklistItem,
  onToggleCollapse,
  photoAttachments,
  section,
}: LivingCommunalAreasSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onPhotoChange={onPhotoChange}
      onRemovePhoto={onRemovePhoto}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      photoAttachments={photoAttachments}
      photoDescription="Upload one or more images of living and communal spaces for the inspection record."
      section={section}
    />
  )
}

export default LivingCommunalAreasSection
