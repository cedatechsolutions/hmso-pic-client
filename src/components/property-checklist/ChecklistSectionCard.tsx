import type { ChangeEventHandler, ReactNode } from 'react'
import type {
  ChecklistSectionData,
  ChecklistState,
  PhotoAttachment,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import { getSectionCompletion } from '../../utils/propertyChecklist'
import SectionPhotoEvidence from './SectionPhotoEvidence'
import {
  sectionCollapseButtonClasses,
  checklistGridClasses,
  checklistItemBaseClasses,
  checklistItemCheckedClasses,
  checklistItemDefaultClasses,
  checklistToggleClasses,
  fieldClasses,
  mutedFieldLabelClasses,
  sectionCountClasses,
  sectionDescriptionClasses,
  sectionHeaderControlsClasses,
  sectionHeadingClasses,
  sectionKickerClasses,
  sectionShellClasses,
  sectionTitleClasses,
} from './styles'

type ChecklistSectionCardProps = {
  checklist: ChecklistState
  children?: ReactNode
  isCollapsed?: boolean
  onUpdateChecklistItem: UpdateChecklistItem
  onPhotoChange?: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto?: (attachmentId: string) => void
  onToggleCollapse?: () => void
  photoAttachments?: PhotoAttachment[]
  photoDescription?: string
  photoTitle?: string
  section: ChecklistSectionData
}

function ChecklistSectionCard({
  checklist,
  children,
  isCollapsed = false,
  onUpdateChecklistItem,
  onPhotoChange,
  onRemovePhoto,
  onToggleCollapse,
  photoAttachments = [],
  photoDescription,
  photoTitle,
  section,
}: ChecklistSectionCardProps) {
  const contentId = `${section.id}-content`
  const photoInputId = `${section.id}-photos`

  return (
    <section className={sectionShellClasses} id={section.id}>
      <div className={sectionHeadingClasses}>
        {onToggleCollapse ? (
          <div className="grid gap-1 text-left">
            <span className={sectionKickerClasses}>
              Section {section.number.toString().padStart(2, '0')}
            </span>
            <span className={sectionTitleClasses}>{section.title}</span>
            <span className={`block ${sectionDescriptionClasses}`}>
              {section.description}
            </span>
          </div>
        ) : (
          <div>
            <span className={sectionKickerClasses}>
              Section {section.number.toString().padStart(2, '0')}
            </span>
            <h2 className={sectionTitleClasses}>{section.title}</h2>
            <p className={sectionDescriptionClasses}>{section.description}</p>
          </div>
        )}

        <div className={sectionHeaderControlsClasses}>
          <span className={sectionCountClasses}>
            {getSectionCompletion(section, checklist)}/{section.items.length} checked
          </span>

          {onToggleCollapse ? (
            <button
              type="button"
              className={sectionCollapseButtonClasses}
              aria-expanded={!isCollapsed}
              aria-controls={contentId}
              aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${section.title}`}
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
          ) : null}
        </div>
      </div>

      {!isCollapsed ? (
        <div id={contentId} className="grid gap-4">
          <div className={checklistGridClasses}>
            {section.items.map((item) => (
              <article
                key={item.id}
                className={`${checklistItemBaseClasses} ${
                  checklist[item.id]?.checked
                    ? checklistItemCheckedClasses
                    : checklistItemDefaultClasses
                }`}
              >
                <label className={checklistToggleClasses}>
                  <input
                    type="checkbox"
                    checked={checklist[item.id]?.checked || false}
                    onChange={(event) =>
                      onUpdateChecklistItem(item.id, 'checked', event.target.checked)
                    }
                  />
                  <span>{item.label}</span>
                </label>

                <label className={fieldClasses}>
                  <span className={mutedFieldLabelClasses}>
                    Additional notes or observation (Optional)
                  </span>
                  <input
                    type="text"
                    value={checklist[item.id]?.note || ''}
                    onChange={(event) =>
                      onUpdateChecklistItem(item.id, 'note', event.target.value)
                    }
                    className="placeholder:text-sm"
                    placeholder="Add context if something needs follow-up"
                  />
                </label>
              </article>
            ))}
          </div>

          {children}

          {onPhotoChange && onRemovePhoto && photoDescription ? (
            <SectionPhotoEvidence
              attachments={photoAttachments}
              description={photoDescription}
              inputId={photoInputId}
              onPhotoChange={onPhotoChange}
              onRemovePhoto={onRemovePhoto}
              title={photoTitle}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}

export default ChecklistSectionCard
