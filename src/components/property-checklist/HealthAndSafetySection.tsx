import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import type { ChangeEventHandler } from 'react'

type HealthAndSafetySectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
  section: ChecklistSectionData
}

function HealthAndSafetySection({
  checklist,
  isCollapsed,
  onPhotoChange,
  onRemovePhoto,
  onUpdateChecklistItem,
  onToggleCollapse,
  photoAttachments,
  section,
}: HealthAndSafetySectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onPhotoChange={onPhotoChange}
      onRemovePhoto={onRemovePhoto}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      photoAttachments={photoAttachments}
      photoDescription="Upload one or more images that document health and safety conditions."
      section={section}
    />
  )
}

export default HealthAndSafetySection
