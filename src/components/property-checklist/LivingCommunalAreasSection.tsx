import type {
  ChecklistSectionData,
  ChecklistState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'

type LivingCommunalAreasSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  section: ChecklistSectionData
}

function LivingCommunalAreasSection({
  checklist,
  isCollapsed,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: LivingCommunalAreasSectionProps) {
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

export default LivingCommunalAreasSection
