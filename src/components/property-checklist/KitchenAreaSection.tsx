import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'
import type { ChangeEventHandler } from 'react'

type KitchenAreaSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
  section: ChecklistSectionData
}

function KitchenAreaSection({
  checklist,
  isCollapsed,
  onPhotoChange,
  onRemovePhoto,
  onUpdateChecklistItem,
  onToggleCollapse,
  photoAttachments,
  section,
}: KitchenAreaSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onPhotoChange={onPhotoChange}
      onRemovePhoto={onRemovePhoto}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      photoAttachments={photoAttachments}
      photoDescription="Upload one or more kitchen images for appliances, surfaces, leaks, or storage conditions."
      section={section}
    />
  )
}

export default KitchenAreaSection
