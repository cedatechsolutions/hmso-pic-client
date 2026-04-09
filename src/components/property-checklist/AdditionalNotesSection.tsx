import type {
  AdditionalNotesState,
  UpdateAdditionalNotesField,
} from '../../types/propertyChecklist'
import {
  fieldClasses,
  fieldLabelClasses,
  formGridClasses,
  fullWidthFieldClasses,
  sectionDescriptionClasses,
  sectionHeadingClasses,
  sectionKickerClasses,
  sectionShellClasses,
  sectionTitleClasses,
} from './styles'

type AdditionalNotesSectionProps = {
  additionalNotes: AdditionalNotesState
  isCollapsed: boolean
  onUpdateAdditionalNotes: UpdateAdditionalNotesField
  onToggleCollapse: () => void
}

function AdditionalNotesSection({
  additionalNotes,
  isCollapsed,
  onUpdateAdditionalNotes,
  onToggleCollapse,
}: AdditionalNotesSectionProps) {
  const contentId = 'additional-notes-content'

  return (
    <section className={sectionShellClasses} id="additional-notes">
      <div className={sectionHeadingClasses}>
        <button
          type="button"
          className="grid gap-1 text-left"
          aria-expanded={!isCollapsed}
          aria-controls={contentId}
          onClick={onToggleCollapse}
        >
          <span className={sectionKickerClasses}>Section 10</span>
          <span className="flex items-start justify-between gap-3">
            <span>
              <span className={sectionTitleClasses}>Additional Notes</span>
              <span className={`block ${sectionDescriptionClasses}`}>
                Keep repairs, maintenance actions, and tenant commentary in one
                place for handover.
              </span>
            </span>
            <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#dde3ea] bg-[#f8fafd] text-slate-600">
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
            </span>
          </span>
        </button>
      </div>

      {!isCollapsed ? (
        <div id={contentId} className={formGridClasses}>
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
      ) : null}
    </section>
  )
}

export default AdditionalNotesSection
