import type { ReactNode } from 'react'
import type {
  ChecklistSectionData,
  ChecklistState,
  UpdateChecklistItem,
} from '../../types/propertyChecklist'
import { getSectionCompletion } from '../../utils/propertyChecklist'
import {
  checklistGridClasses,
  checklistItemBaseClasses,
  checklistItemCheckedClasses,
  checklistItemDefaultClasses,
  checklistToggleClasses,
  fieldClasses,
  mutedFieldLabelClasses,
  sectionCountClasses,
  sectionDescriptionClasses,
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
  onToggleCollapse?: () => void
  section: ChecklistSectionData
}

function ChecklistSectionCard({
  checklist,
  children,
  isCollapsed = false,
  onUpdateChecklistItem,
  onToggleCollapse,
  section,
}: ChecklistSectionCardProps) {
  const contentId = `${section.id}-content`

  return (
    <section className={sectionShellClasses} id={section.id}>
      <div className={sectionHeadingClasses}>
        {onToggleCollapse ? (
          <button
            type="button"
            className="grid gap-1 text-left"
            aria-expanded={!isCollapsed}
            aria-controls={contentId}
            onClick={onToggleCollapse}
          >
            <span className={sectionKickerClasses}>
              Section {section.number.toString().padStart(2, '0')}
            </span>
            <span className="flex items-start justify-between gap-3">
              <span>
                <span className={sectionTitleClasses}>{section.title}</span>
                <span className={`block ${sectionDescriptionClasses}`}>
                  {section.description}
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
        ) : (
          <div>
            <span className={sectionKickerClasses}>
              Section {section.number.toString().padStart(2, '0')}
            </span>
            <h2 className={sectionTitleClasses}>{section.title}</h2>
            <p className={sectionDescriptionClasses}>{section.description}</p>
          </div>
        )}

        <span className={`${sectionCountClasses} self-start`}>
          {getSectionCompletion(section, checklist)}/{section.items.length} checked
        </span>
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
        </div>
      ) : null}
    </section>
  )
}

export default ChecklistSectionCard
