import { checklistSections } from '../data/propertyChecklist'
import type {
  AdditionalNotesState,
  ChecklistSectionData,
  ChecklistState,
  FrontPhotoState,
  GeneralFormState,
  SignOffState,
} from '../types/propertyChecklist'

type ReportContext = {
  additionalNotes: AdditionalNotesState
  checklist: ChecklistState
  frontPhoto: FrontPhotoState
  general: GeneralFormState
  signOff: SignOffState
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

export const buildReport = ({
  additionalNotes,
  checklist,
  frontPhoto,
  general,
  signOff,
}: ReportContext) => {
  const lines: string[] = [
    'Property Inspection Report',
    '',
    '1. General Information',
    `Property Address: ${general.propertyAddress || 'Not provided'}`,
    `Date of Inspection: ${general.inspectionDate || 'Not provided'}`,
    `Inspector Name: ${general.inspectorName || 'Not provided'}`,
    `Occupied or Vacant: ${titleCase(general.occupancy)}`,
    `Notes on Overall Condition: ${general.overallCondition || 'None recorded'}`,
    '',
  ]

  checklistSections.forEach((section) => {
    lines.push(`${section.number}. ${section.title}`)

    section.items.forEach((item) => {
      lines.push(`- [${checklist[item.id]?.checked ? 'x' : ' '}] ${item.label}`)

      if (checklist[item.id]?.note) {
        lines.push(`  Notes: ${checklist[item.id].note}`)
      }
    })

    if (section.id === 'exterior-access') {
      lines.push(`Photo of the Front: ${frontPhoto.fileName || 'Not attached'}`)
    }

    lines.push('')
  })

  lines.push('10. Additional Notes')
  lines.push(
    `Maintenance Issues Identified: ${additionalNotes.maintenanceIssues || 'None recorded'}`,
  )
  lines.push(
    `Repairs Required: ${additionalNotes.repairsRequired || 'None recorded'}`,
  )
  lines.push(
    `Tenant Feedback: ${additionalNotes.tenantFeedback || 'None recorded'}`,
  )
  lines.push(
    `Inspector Comments: ${additionalNotes.inspectorComments || 'None recorded'}`,
  )
  lines.push('')
  lines.push('11. Sign Off')
  lines.push(
    `Inspector Signature: ${signOff.inspectorSignature || 'Not provided'}`,
  )
  lines.push(`Date: ${signOff.signOffDate || 'Not provided'}`)

  return lines.join('\n')
}
