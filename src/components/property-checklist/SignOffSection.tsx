import type { SignOffState, UpdateSignOffField } from '../../types/propertyChecklist'
import DatePickerField from './DatePickerField'
import {
  actionButtonsClasses,
  actionPanelClasses,
  buttonPrimaryClasses,
  buttonSecondaryClasses,
  compactFormGridClasses,
  fieldClasses,
  fieldLabelClasses,
  sectionDescriptionClasses,
  sectionHeadingClasses,
  sectionKickerClasses,
  sectionShellClasses,
  sectionTitleClasses,
} from './styles'

type SignOffSectionProps = {
  activeReportAction: 'download' | 'email' | null
  canGenerateReport: boolean
  onDownloadReport: () => void
  onEmailReport: () => void
  onUpdateSignOff: UpdateSignOffField
  reportActionMessage: string
  reportReadinessMessage: string
  signOff: SignOffState
}

function SignOffSection({
  activeReportAction,
  canGenerateReport,
  onDownloadReport,
  onEmailReport,
  onUpdateSignOff,
  reportActionMessage,
  reportReadinessMessage,
  signOff,
}: SignOffSectionProps) {
  return (
    <section className={sectionShellClasses} id="sign-off">
      <div className={sectionHeadingClasses}>
        <div>
          <span className={sectionKickerClasses}>Section 11</span>
          <h2 className={sectionTitleClasses}>Sign Off</h2>
          <p className={sectionDescriptionClasses}>
            Finalise the inspection so the report is ready to download or send
            by email.
          </p>
        </div>
      </div>

      <div className='flex flex-col gap-4'>
        <div className={compactFormGridClasses}>
          <label className={fieldClasses}>
            <span className={fieldLabelClasses}>
              Inspector Signature <span className="text-red-600">*</span>
            </span>
            <input
              type="text"
              value={signOff.inspectorSignature}
              onChange={(event) =>
                onUpdateSignOff('inspectorSignature', event.target.value)
              }
              placeholder="Type full name"
            />
          </label>

          <DatePickerField
            label="Date"
            required
            value={signOff.signOffDate}
            onChange={(value) => onUpdateSignOff('signOffDate', value)}
          />
        </div>

        <div className={actionPanelClasses}>
          <div>
            <strong className="block text-sm font-semibold text-slate-800">
              Inspection report actions
            </strong>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Generate a polished PDF report with the full inspection details
              and front photo. Email will attach the PDF on supported devices,
              or download it first and open a draft email for manual
              attachment.
            </p>
          </div>

          <div className={actionButtonsClasses}>
            <button
              type="button"
              className={buttonPrimaryClasses}
              disabled={activeReportAction !== null || !canGenerateReport}
              onClick={onDownloadReport}
            >
              {activeReportAction === 'download'
                ? 'Preparing PDF...'
                : 'Download PDF Report'}
            </button>
            <button
              type="button"
              className={buttonSecondaryClasses}
              disabled={activeReportAction !== null || !canGenerateReport}
              onClick={onEmailReport}
            >
              {activeReportAction === 'email'
                ? 'Preparing Email...'
                : 'Email PDF Report'}
            </button>
          </div>
        </div>

        {!canGenerateReport ? (
          <p className="text-sm leading-6 text-slate-500">
            {reportReadinessMessage}
          </p>
        ) : null}

        {reportActionMessage ? (
          <p className="text-sm leading-6 text-slate-500">
            {reportActionMessage}
          </p>
        ) : null}
      </div>

      
    </section>
  )
}

export default SignOffSection
