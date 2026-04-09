import type {
  ChecklistSectionData,
  ChecklistState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import ChecklistSectionCard from './ChecklistSectionCard'

type UtilitiesServicesSectionProps = {
  checklist: ChecklistState
  isCollapsed: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onToggleCollapse: () => void
  section: ChecklistSectionData
}

function UtilitiesServicesSection({
  checklist,
  isCollapsed,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: UtilitiesServicesSectionProps) {
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

export default UtilitiesServicesSection
