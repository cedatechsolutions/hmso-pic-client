import type {
  AdditionalNotesState,
  PhotoAttachment,
  UpdateAdditionalNotesField,
} from '../../types/propertyChecklist'
import type { ChangeEventHandler } from 'react'
import SectionPhotoEvidence from './SectionPhotoEvidence'
import {
  fieldClasses,
  fieldLabelClasses,
  formGridClasses,
  fullWidthFieldClasses,
  sectionCollapseButtonClasses,
  sectionDescriptionClasses,
  sectionHeaderControlsClasses,
  sectionHeadingClasses,
  sectionKickerClasses,
  sectionShellClasses,
  sectionTitleClasses,
} from './styles'

type AdditionalNotesSectionProps = {
  additionalNotes: AdditionalNotesState
  isCollapsed: boolean
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  onUpdateAdditionalNotes: UpdateAdditionalNotesField
  onToggleCollapse: () => void
  photoAttachments: PhotoAttachment[]
}

function AdditionalNotesSection({
  additionalNotes,
  isCollapsed,
  onPhotoChange,
  onRemovePhoto,
  onUpdateAdditionalNotes,
  onToggleCollapse,
  photoAttachments,
}: AdditionalNotesSectionProps) {
  const contentId = 'additional-notes-content'

  return (
    <section className={sectionShellClasses} id="additional-notes">
      <div className={sectionHeadingClasses}>
        <div className="grid gap-1 text-left">
          <span className={sectionKickerClasses}>Section 10</span>
          <span className={sectionTitleClasses}>Additional Notes</span>
          <span className={`block ${sectionDescriptionClasses}`}>
            Keep repairs, maintenance actions, and tenant commentary in one
            place for handover.
          </span>
        </div>

        <div className={sectionHeaderControlsClasses}>
          <button
            type="button"
            className={sectionCollapseButtonClasses}
            aria-expanded={!isCollapsed}
            aria-controls={contentId}
            aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} Additional Notes`}
            onClick={onToggleCollapse}
          >
            <svg
              className={`h-4 w-4 transition-transform ${
                isCollapsed ? '' : 'rotate-180'
              }`}
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M5 8l5 5 5-5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {!isCollapsed ? (
        <div id={contentId} className="grid gap-4">
          <div className={formGridClasses}>
            <label className={`${fieldClasses} ${fullWidthFieldClasses}`}>
              <span className={fieldLabelClasses}>Maintenance Issues Identified</span>
              <textarea
                rows={4}
                value={additionalNotes.maintenanceIssues}
                onChange={(event) =>
                  onUpdateAdditionalNotes('maintenanceIssues', event.target.value)
                }
                placeholder="Describe any maintenance issues"
              />
            </label>

            <label className={`${fieldClasses} ${fullWidthFieldClasses}`}>
              <span className={fieldLabelClasses}>Repairs Required</span>
              <textarea
                rows={4}
                value={additionalNotes.repairsRequired}
                onChange={(event) =>
                  onUpdateAdditionalNotes('repairsRequired', event.target.value)
                }
                placeholder="Describe any repairs required"
              />
            </label>

            <label className={`${fieldClasses} ${fullWidthFieldClasses}`}>
              <span className={fieldLabelClasses}>Tenant Feedback (if occupied)</span>
              <textarea
                rows={4}
                value={additionalNotes.tenantFeedback}
                onChange={(event) =>
                  onUpdateAdditionalNotes('tenantFeedback', event.target.value)
                }
                placeholder="Record any tenant feedback"
              />
            </label>

            <label className={`${fieldClasses} ${fullWidthFieldClasses}`}>
              <span className={fieldLabelClasses}>Inspector&apos;s Comments</span>
              <textarea
                rows={4}
                value={additionalNotes.inspectorComments}
                onChange={(event) =>
                  onUpdateAdditionalNotes('inspectorComments', event.target.value)
                }
                placeholder="Enter any additional comments"
              />
            </label>
          </div>

          <SectionPhotoEvidence
            attachments={photoAttachments}
            description="Upload one or more supporting images for repairs, maintenance, or handover notes."
            inputId="additional-notes-photos"
            onPhotoChange={onPhotoChange}
            onRemovePhoto={onRemovePhoto}
          />
        </div>
      ) : null}
    </section>
  )
}

export default AdditionalNotesSection
