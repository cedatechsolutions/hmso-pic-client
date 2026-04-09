import type {
  ChecklistSectionData,
  ChecklistState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'

type KitchenAreaSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  section: ChecklistSectionData
}

function KitchenAreaSection({
  checklist,
  isCollapsed,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: KitchenAreaSectionProps) {
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

export default KitchenAreaSection
