import { type ChangeEvent, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
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
  GeneralFormState,
  PhotoAttachment,
  SectionPhotosState,
  SignOffState,
} from '../types/propertyChecklist'
import {
  buildObservationLines,
  getSectionCompletion,
  titleCase,
} from '../utils/propertyChecklist'
import { appRoutes } from '../routes'

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
const photoEnabledSectionIds = collapsibleSectionIds
const createPhotoAttachmentId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const createExpandedSectionsState = () =>
  collapsibleSectionIds.reduce<Record<string, boolean>>((state, sectionId) => {
    state[sectionId] = true
    return state
  }, {})

const createSectionPhotosState = () =>
  photoEnabledSectionIds.reduce<SectionPhotosState>((state, sectionId) => {
    state[sectionId] = []
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
  const [sectionPhotos, setSectionPhotos] = useState<SectionPhotosState>(() =>
    createSectionPhotosState(),
  )
  const [activeReportAction, setActiveReportAction] = useState<
    'download' | 'email' | null
  >(null)
  const [reportActionMessage, setReportActionMessage] = useState('')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => createExpandedSectionsState(),
  )

  const sectionPhotosRef = useRef(sectionPhotos)

  useEffect(() => {
    sectionPhotosRef.current = sectionPhotos
  }, [sectionPhotos])

  useEffect(() => {
    return () => {
      Object.values(sectionPhotosRef.current)
        .flat()
        .forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl))
    }
  }, [])

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

  const handleSectionPhotosChange =
    (sectionId: string) => (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? [])

      if (!files.length) {
        return
      }

      const attachments: PhotoAttachment[] = files.map((file) => ({
        fileName: file.name,
        id: createPhotoAttachmentId(),
        previewUrl: URL.createObjectURL(file),
      }))

      setSectionPhotos((current) => ({
        ...current,
        [sectionId]: [...(current[sectionId] ?? []), ...attachments],
      }))

      event.target.value = ''
    }

  const removeSectionPhoto = (sectionId: string, attachmentId: string) => {
    setSectionPhotos((current) => {
      const targetAttachment = current[sectionId]?.find(
        (attachment) => attachment.id === attachmentId,
      )

      if (targetAttachment) {
        URL.revokeObjectURL(targetAttachment.previewUrl)
      }

      return {
        ...current,
        [sectionId]: (current[sectionId] ?? []).filter(
          (attachment) => attachment.id !== attachmentId,
        ),
      }
    })
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }))
  }

  const buildReportContext = () => ({
    additionalNotes,
    checklist,
    general,
    sectionPhotos,
    signOff,
  })

  const triggerFileDownload = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob)
    const downloadLink = document.createElement('a')

    downloadLink.href = objectUrl
    downloadLink.download = fileName
    document.body.appendChild(downloadLink)
    downloadLink.click()
    downloadLink.remove()

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
  }

  const buildEmailDraftUrl = (pdfFileName: string) => {
    const observationLines = buildObservationLines({
      additionalNotes,
      checklist,
    })
    const totalImagesAttached = Object.values(sectionPhotos).reduce(
      (count, attachments) => count + attachments.length,
      0,
    )
    const emailBody = [
      'Property Inspection Report',
      '',
      'A PDF inspection report has been prepared for this property.',
      `PDF file: ${pdfFileName}`,
      'If your browser did not attach the PDF automatically, please attach the downloaded file manually before sending.',
      '',
      `Address: ${general.propertyAddress || 'Not provided'}`,
      `Inspection Date: ${general.inspectionDate || 'Not provided'}`,
      `Inspector: ${general.inspectorName || 'Not provided'}`,
      `Occupancy: ${titleCase(general.occupancy)}`,
      `Checklist Completion: ${checkedChecklistItems}/${totalChecklistItems}`,
      `Photo Evidence Included: ${totalImagesAttached} image(s)`,
      '',
      'Observations:',
      observationLines.length
        ? observationLines.slice(0, 12).join('\n')
        : 'No additional observations recorded.',
      '',
      `Inspector Signature: ${signOff.inspectorSignature || 'Not provided'}`,
      `Sign-off Date: ${signOff.signOffDate || 'Not provided'}`,
    ].join('\n')

    return `mailto:?subject=${encodeURIComponent(
      `Inspection Report - ${general.propertyAddress || 'Property'}`,
    )}&body=${encodeURIComponent(emailBody)}`
  }

  const sharePdfReport = async (file: File) => {
    if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
      return 'unsupported' as const
    }

    if (typeof navigator.canShare === 'function') {
      try {
        if (!navigator.canShare({ files: [file] })) {
          return 'unsupported' as const
        }
      } catch {
        return 'unsupported' as const
      }
    }

    try {
      await navigator.share({
        files: [file],
        text: `PDF inspection report for ${general.propertyAddress || 'the property'}.`,
        title: `Inspection Report - ${general.propertyAddress || 'Property'}`,
      })

      return 'shared' as const
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'cancelled' as const
      }

      return 'unsupported' as const
    }
  }

  const handleDownloadReport = async () => {
    setActiveReportAction('download')
    setReportActionMessage('')

    try {
      const { createInspectionReportPdf } = await import(
        '../utils/propertyChecklistPdf'
      )
      const { blob, fileName } = await createInspectionReportPdf(buildReportContext())

      triggerFileDownload(blob, fileName)
      setReportActionMessage(`PDF downloaded as ${fileName}.`)
    } catch {
      setReportActionMessage(
        'Unable to generate the PDF report. Please try again.',
      )
    } finally {
      setActiveReportAction(null)
    }
  }

  const handleEmailReport = async () => {
    setActiveReportAction('email')
    setReportActionMessage('')

    try {
      const { createInspectionReportPdf } = await import(
        '../utils/propertyChecklistPdf'
      )
      const { blob, file, fileName } = await createInspectionReportPdf(
        buildReportContext(),
      )
      const shareResult = await sharePdfReport(file)

      if (shareResult === 'shared') {
        setReportActionMessage(
          'PDF ready to send. Choose your email app from the share sheet.',
        )
        return
      }

      if (shareResult === 'cancelled') {
        setReportActionMessage('Email share cancelled.')
        return
      }

      triggerFileDownload(blob, fileName)
      window.location.href = buildEmailDraftUrl(fileName)
      setReportActionMessage(
        'PDF downloaded and email draft opened. Attach the PDF manually if it was not added automatically.',
      )
    } catch {
      setReportActionMessage(
        'Unable to prepare the PDF email package. Please try again.',
      )
    } finally {
      setActiveReportAction(null)
    }
  }

  return (
    <main className="mx-auto w-[min(1220px,calc(100%_-_20px))] pb-8 sm:w-[min(1220px,calc(100%_-_32px))]">
      <div className="pt-5">
        <Link
          to={appRoutes.home}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#1a73e8] transition hover:text-[#174ea6]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M11.5 4.5L6 10l5.5 5.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.5 10h8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          <span>Back to home</span>
        </Link>
      </div>

      <header className="sticky top-0 z-30 py-3 bg-[#f5f7fb]/95  backdrop-blur-sm">
        <div className={surfaceCardClasses}>
          <div className="grid gap-3">
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
          isCollapsed={!expandedSections[exteriorAccessSection.id]}
          onPhotoChange={handleSectionPhotosChange(exteriorAccessSection.id)}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(exteriorAccessSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(exteriorAccessSection.id)}
          photoAttachments={sectionPhotos[exteriorAccessSection.id] ?? []}
          section={exteriorAccessSection}
        />

        <HealthAndSafetySection
          checklist={checklist}
          isCollapsed={!expandedSections[healthAndSafetySection.id]}
          onPhotoChange={handleSectionPhotosChange(healthAndSafetySection.id)}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(healthAndSafetySection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(healthAndSafetySection.id)}
          photoAttachments={sectionPhotos[healthAndSafetySection.id] ?? []}
          section={healthAndSafetySection}
        />

        <CleanlinessDampAndMouldSection
          checklist={checklist}
          isCollapsed={!expandedSections[cleanlinessDampAndMouldSection.id]}
          onPhotoChange={handleSectionPhotosChange(
            cleanlinessDampAndMouldSection.id,
          )}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(cleanlinessDampAndMouldSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() =>
            toggleSection(cleanlinessDampAndMouldSection.id)
          }
          photoAttachments={
            sectionPhotos[cleanlinessDampAndMouldSection.id] ?? []
          }
          section={cleanlinessDampAndMouldSection}
        />

        <KitchenAreaSection
          checklist={checklist}
          isCollapsed={!expandedSections[kitchenAreaSection.id]}
          onPhotoChange={handleSectionPhotosChange(kitchenAreaSection.id)}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(kitchenAreaSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(kitchenAreaSection.id)}
          photoAttachments={sectionPhotos[kitchenAreaSection.id] ?? []}
          section={kitchenAreaSection}
        />

        <BathroomsSection
          checklist={checklist}
          isCollapsed={!expandedSections[bathroomsSection.id]}
          onPhotoChange={handleSectionPhotosChange(bathroomsSection.id)}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(bathroomsSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(bathroomsSection.id)}
          photoAttachments={sectionPhotos[bathroomsSection.id] ?? []}
          section={bathroomsSection}
        />

        <BedroomsSection
          checklist={checklist}
          isCollapsed={!expandedSections[bedroomsSection.id]}
          onPhotoChange={handleSectionPhotosChange(bedroomsSection.id)}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(bedroomsSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(bedroomsSection.id)}
          photoAttachments={sectionPhotos[bedroomsSection.id] ?? []}
          section={bedroomsSection}
        />

        <LivingCommunalAreasSection
          checklist={checklist}
          isCollapsed={!expandedSections[livingCommunalAreasSection.id]}
          onPhotoChange={handleSectionPhotosChange(
            livingCommunalAreasSection.id,
          )}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(livingCommunalAreasSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(livingCommunalAreasSection.id)}
          photoAttachments={sectionPhotos[livingCommunalAreasSection.id] ?? []}
          section={livingCommunalAreasSection}
        />

        <UtilitiesServicesSection
          checklist={checklist}
          isCollapsed={!expandedSections[utilitiesServicesSection.id]}
          onPhotoChange={handleSectionPhotosChange(utilitiesServicesSection.id)}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto(utilitiesServicesSection.id, attachmentId)
          }
          onUpdateChecklistItem={updateChecklistItem}
          onToggleCollapse={() => toggleSection(utilitiesServicesSection.id)}
          photoAttachments={sectionPhotos[utilitiesServicesSection.id] ?? []}
          section={utilitiesServicesSection}
        />

        <AdditionalNotesSection
          additionalNotes={additionalNotes}
          isCollapsed={!expandedSections['additional-notes']}
          onPhotoChange={handleSectionPhotosChange('additional-notes')}
          onRemovePhoto={(attachmentId) =>
            removeSectionPhoto('additional-notes', attachmentId)
          }
          onUpdateAdditionalNotes={updateAdditionalNotes}
          onToggleCollapse={() => toggleSection('additional-notes')}
          photoAttachments={sectionPhotos['additional-notes'] ?? []}
        />

        <SignOffSection
          activeReportAction={activeReportAction}
          onDownloadReport={handleDownloadReport}
          onEmailReport={handleEmailReport}
          onUpdateSignOff={updateSignOff}
          reportActionMessage={reportActionMessage}
          signOff={signOff}
        />
      </form>
    </main>
  )
}

export default PropertyChecklistPage
