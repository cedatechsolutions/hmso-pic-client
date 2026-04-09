import type {
  ChecklistSectionData,
  ChecklistState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'

type BedroomsSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  section: ChecklistSectionData
}

function BedroomsSection({
  checklist,
  isCollapsed,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: BedroomsSectionProps) {
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

export default BedroomsSection
