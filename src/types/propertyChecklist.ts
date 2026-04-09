export type ChecklistItem = {
  id: string
  label: string
}

export type ChecklistSectionData = {
  id: string
  number: number
  title: string
  description: string
  items: ChecklistItem[]
}

export type NavigationSection = {
  id: string
  number: number
  title: string
}

export type ChecklistState = Record<
  string,
  {
    checked: boolean
    note: string
  }
>

export type GeneralFormState = {
  propertyAddress: string
  inspectionDate: string
  inspectorName: string
  occupancy: '' | 'occupied' | 'vacant'
  overallCondition: string
}

export type AdditionalNotesState = {
  maintenanceIssues: string
  repairsRequired: string
  tenantFeedback: string
  inspectorComments: string
}

export type SignOffState = {
  inspectorSignature: string
  signOffDate: string
}

export type PhotoAttachment = {
  id: string
  fileName: string
  previewUrl: string
}

export type SectionPhotosState = Record<string, PhotoAttachment[]>

export type UpdateChecklistItem = (
  itemId: string,
  key: 'checked' | 'note',
  value: boolean | string,
) => void

export type UpdateGeneralField = <K extends keyof GeneralFormState>(
  field: K,
  value: GeneralFormState[K],
) => void

export type UpdateAdditionalNotesField = <
  K extends keyof AdditionalNotesState,
>(
  field: K,
  value: AdditionalNotesState[K],
) => void

export type UpdateSignOffField = <K extends keyof SignOffState>(
  field: K,
  value: SignOffState[K],
) => void
