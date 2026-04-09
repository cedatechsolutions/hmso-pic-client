import type {
  ChecklistSectionData,
  ChecklistState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'

type BathroomsSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  section: ChecklistSectionData
}

function BathroomsSection({
  checklist,
  isCollapsed,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: BathroomsSectionProps) {
  return (
    <ChecklistSectionCard
      checklist={checklist}
      isCollapsed={isCollapsed}
      onUpdateChecklistItem={onUpdateChecklistItem}
      onToggleCollapse={onToggleCollapse}
      section={section}
    />
  )
}

export default BathroomsSection
