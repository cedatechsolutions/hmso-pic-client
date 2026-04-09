import { type ChangeEvent, useEffect, useState } from 'react'
import AdditionalNotesSection from '../components/property-checklist/AdditionalNotesSection'
import BathroomsSection from '../components/property-checklist/BathroomsSection'
import BedroomsSection from '../components/property-checklist/BedroomsSection'
import CleanlinessDampAndMouldSection from '../components/property-checklist/CleanlinessDampAndMouldSection'
import ExteriorAccessSection from '../components/property-checklist/ExteriorAccessSection'
import GeneralInformationSection from '../components/property-checklist/GeneralInformationSection'
import HealthAndSafetySection from '../components/property-checklist/HealthAndSafetySection'
import KitchenAreaSection from '../components/property-checklist/KitchenAreaSection'
import LivingCommunalAreasSection from '../components/property-checklist/LivingCommunalAreasSection'
import SignOffSection from '../components/property-checklist/SignOffSection'
import UtilitiesServicesSection from '../components/property-checklist/UtilitiesServicesSection'
import { surfaceCardClasses } from '../components/property-checklist/styles'
import {
  checklistSections,
  checklistSectionsById,
  createChecklistState,
} from '../data/propertyChecklist'
import type {
  AdditionalNotesState,
  ChecklistState,
  FrontPhotoState,
  GeneralFormState,
  SignOffState,
} from '../types/propertyChecklist'
import {
  buildObservationLines,
  buildReport,
  getSectionCompletion,
  makeFileName,
  titleCase,
} from '../utils/propertyChecklist'

const exteriorAccessSection = checklistSectionsById['exterior-access']
const healthAndSafetySection = checklistSectionsById['health-and-safety']
const cleanlinessDampAndMouldSection =
  checklistSectionsById['cleanliness-damp-mould']
const kitchenAreaSection = checklistSectionsById['kitchen-area']
const bathroomsSection = checklistSectionsById['bathrooms']
const bedroomsSection = checklistSectionsById['bedrooms']
const livingCommunalAreasSection =
  checklistSectionsById['living-and-communal-areas']
const utilitiesServicesSection = checklistSectionsById['utilities-and-services']
const collapsibleSectionIds = [
  ...checklistSections.map((section) => section.id),
  'additional-notes',
]

const createExpandedSectionsState = () =>
  collapsibleSectionIds.reduce<Record<string, boolean>>((state, sectionId) => {
    state[sectionId] = true
    return state
  }, {})

function PropertyChecklistPage() {
  const [general, setGeneral] = useState<GeneralFormState>({
    propertyAddress: '',
    inspectionDate: '',
    inspectorName: '',
    occupancy: '',
    overallCondition: '',
  })
  const [checklist, setChecklist] = useState<ChecklistState>(() =>
    createChecklistState(),
  )
  const [additionalNotes, setAdditionalNotes] = useState<AdditionalNotesState>({
    maintenanceIssues: '',
    repairsRequired: '',
    tenantFeedback: '',
    inspectorComments: '',
  })
  const [signOff, setSignOff] = useState<SignOffState>({
    inspectorSignature: '',
    signOffDate: '',
  })
  const [frontPhoto, setFrontPhoto] = useState<FrontPhotoState>({
    fileName: '',
    previewUrl: '',
  })
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => createExpandedSectionsState(),
  )

  useEffect(() => {
    return () => {
      if (frontPhoto.previewUrl) {
        URL.revokeObjectURL(frontPhoto.previewUrl)
      }
    }
  }, [frontPhoto.previewUrl])

  const totalChecklistItems = checklistSections.reduce(
    (count, section) => count + section.items.length,
    0,
  )

  const checkedChecklistItems = checklistSections.reduce(
    (count, section) => count + getSectionCompletion(section, checklist),
    0,
  )

  const progressValue =
    totalChecklistItems === 0
      ? 0
      : Math.round((checkedChecklistItems / totalChecklistItems) * 100)

  const updateGeneral = <K extends keyof GeneralFormState>(
    field: K,
    value: GeneralFormState[K],
  ) => {
    setGeneral((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateAdditionalNotes = <K extends keyof AdditionalNotesState>(
    field: K,
    value: AdditionalNotesState[K],
  ) => {
    setAdditionalNotes((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateSignOff = <K extends keyof SignOffState>(
    field: K,
    value: SignOffState[K],
  ) => {
    setSignOff((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const updateChecklistItem = (
    itemId: string,
    key: 'checked' | 'note',
    value: boolean | string,
  ) => {
    setChecklist((current) => ({
      ...current,
      [itemId]: {
        ...current[itemId],
        [key]: value,
      },
    }))
  }

  const handleFrontPhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const previewUrl = URL.createObjectURL(file)

    setFrontPhoto((current) => {
      if (current.previewUrl) {
        URL.revokeObjectURL(current.previewUrl)
      }

      return {
        fileName: file.name,
        previewUrl,
      }
    })
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }))
  }

  const handleDownloadReport = () => {
    const report = buildReport({
      additionalNotes,
      checklist,
      frontPhoto,
      general,
      signOff,
    })
    const blob = new Blob([report], {
      type: 'text/plain;charset=utf-8',
    })
    const objectUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')
    const safeAddress = makeFileName(general.propertyAddress) || 'property'

    downloadLink.href = objectUrl
    downloadLink.download = `${safeAddress}-inspection-report.txt`
    downloadLink.click()

    URL.revokeObjectURL(objectUrl)
  }

  const handleEmailReport = () => {
    const observationLines = buildObservationLines({
      additionalNotes,
      checklist,
    })
    const emailBody = [
      'Property Inspection Report',
      '',
      `Address: ${general.propertyAddress || 'Not provided'}`,
      `Inspection Date: ${general.inspectionDate || 'Not provided'}`,
      `Inspector: ${general.inspectorName || 'Not provided'}`,
      `Occupancy: ${titleCase(general.occupancy)}`,
      `Checklist Completion: ${checkedChecklistItems}/${totalChecklistItems}`,
      `Front Photo Attached: ${frontPhoto.fileName || 'No'}`,
      '',
      'Observations:',
      observationLines.length
        ? observationLines.slice(0, 12).join('\n')
        : 'No additional observations recorded.',
      '',
      `Inspector Signature: ${signOff.inspectorSignature || 'Not provided'}`,
      `Sign-off Date: ${signOff.signOffDate || 'Not provided'}`,
    ].join('\n')

    window.location.href = `mailto:?subject=${encodeURIComponent(
      `Inspection Report - ${general.propertyAddress || 'Property'}`,
    )}&body=${encodeURIComponent(emailBody)}`
  }

  return (
    <main className="mx-auto w-[min(1220px,calc(100%_-_20px))] pb-8 sm:w-[min(1220px,calc(100%_-_32px))]">
      <header className="sticky top-0 z-30 bg-[#f5f7fb]/95 py-3 backdrop-blur-sm">
        <div className={surfaceCardClasses}>
          <div className="grid gap-3">
            {/* <span className="inline-flex items-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1a73e8]">
              Property care workflow
            </span> */}
            <h1 className="text-[1.35rem] font-medium tracking-[-0.03em] text-slate-800 sm:text-[1.55rem]">
              Property Inspection Checklist
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-slate-500">
              Temporary Accommodation, Families
            </p>
           
            <div className="grid gap-2 border-t border-[#dde3ea] pt-3">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1a73e8]">
                  Checklist completion
                </span>
                <strong className="text-sm font-medium text-slate-800">
                  {progressValue}%
                </strong>
              </div>
              <div
                className="h-[10px] overflow-hidden rounded-md bg-[#e6edf7]"
                role="progressbar"
                aria-label="Checklist completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progressValue}
              >
                <span
                  className="block h-full rounded-md bg-[#1a73e8] transition-[width]"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
              
            </div>
          </div>
        </div>
      </header>

      <form
        className="grid gap-4"
        onSubmit={(event) => event.preventDefault()}
      >
        <GeneralInformationSection
          general={general}
          onUpdateGeneral={updateGeneral}
        />

        <ExteriorAccessSection
          checklist={checklist}
          frontPhoto={frontPhoto}
          isCollapsed={!expandedSections[exteriorAccessSection.id]}
          onFrontPhotoChange={handleFrontPhotoChange}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(exteriorAccessSection.id)}
          section={exteriorAccessSection}
        />

        <HealthAndSafetySection
          checklist={checklist}
          isCollapsed={!expandedSections[healthAndSafetySection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(healthAndSafetySection.id)}
          section={healthAndSafetySection}
        />

        <CleanlinessDampAndMouldSection
          checklist={checklist}
          isCollapsed={!expandedSections[cleanlinessDampAndMouldSection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() =>
            toggleSection(cleanlinessDampAndMouldSection.id)
          }
          section={cleanlinessDampAndMouldSection}
        />

        <KitchenAreaSection
          checklist={checklist}
          isCollapsed={!expandedSections[kitchenAreaSection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(kitchenAreaSection.id)}
          section={kitchenAreaSection}
        />

        <BathroomsSection
          checklist={checklist}
          isCollapsed={!expandedSections[bathroomsSection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(bathroomsSection.id)}
          section={bathroomsSection}
        />

        <BedroomsSection
          checklist={checklist}
          isCollapsed={!expandedSections[bedroomsSection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(bedroomsSection.id)}
          section={bedroomsSection}
        />

        <LivingCommunalAreasSection
          checklist={checklist}
          isCollapsed={!expandedSections[livingCommunalAreasSection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(livingCommunalAreasSection.id)}
          section={livingCommunalAreasSection}
        />

        <UtilitiesServicesSection
          checklist={checklist}
          isCollapsed={!expandedSections[utilitiesServicesSection.id]}
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(utilitiesServicesSection.id)}
          section={utilitiesServicesSection}
        />

        <AdditionalNotesSection
          additionalNotes={additionalNotes}
          isCollapsed={!expandedSections['additional-notes']}
          onUpdateAdditionalNotes={updateAdditionalNotes}
          onToggleCollapse={() => toggleSection('additional-notes')}
        />

        <SignOffSection
          onDownloadReport={handleDownloadReport}
          onEmailReport={handleEmailReport}
          onUpdateSignOff={updateSignOff}
          signOff={signOff}
        />
      </form>
    </main>
  )
}

export default PropertyChecklistPage
