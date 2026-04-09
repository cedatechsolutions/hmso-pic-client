import { checklistSections } from '../data/propertyChecklist'
import type {
  AdditionalNotesState,
  ChecklistSectionData,
  ChecklistState,
  GeneralFormState,
} from '../types/propertyChecklist'

type ReportContext = {
  additionalNotes: AdditionalNotesState
  checklist: ChecklistState
  general: GeneralFormState
}

export const getSectionCompletion = (
  section: ChecklistSectionData,
  checklist: ChecklistState,
) => section.items.filter((item) => checklist[item.id]?.checked).length

export const titleCase = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : 'Not provided'

export const makeFileName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const buildObservationLines = ({
  additionalNotes,
  checklist,
}: Pick<ReportContext, 'additionalNotes' | 'checklist'>) => {
  const checklistNotes = checklistSections.flatMap((section) =>
    section.items.flatMap((item) =>
      checklist[item.id]?.note
        ? [`${section.title}: ${item.label} - ${checklist[item.id].note}`]
        : [],
    ),
  )

  const narrativeNotes: string[] = []

  if (additionalNotes.maintenanceIssues) {
    narrativeNotes.push(
      `Maintenance Issues: ${additionalNotes.maintenanceIssues}`,
    )
  }

  if (additionalNotes.repairsRequired) {
    narrativeNotes.push(`Repairs Required: ${additionalNotes.repairsRequired}`)
  }

  if (additionalNotes.tenantFeedback) {
    narrativeNotes.push(`Tenant Feedback: ${additionalNotes.tenantFeedback}`)
  }

  if (additionalNotes.inspectorComments) {
    narrativeNotes.push(
      `Inspector Comments: ${additionalNotes.inspectorComments}`,
    )
  }

  return [...checklistNotes, ...narrativeNotes]
}
