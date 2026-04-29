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
  areReportActionsTemporarilyUnavailable: boolean
  canGenerateReport: boolean
  onDownloadReport: () => void
  onEmailReport: () => void
  onUnavailableReportAction: () => void
  onUpdateSignOff: UpdateSignOffField
  reportActionMessage: string
  reportReadinessMessage: string
  signOff: SignOffState
}

function SignOffSection({
  activeReportAction,
  areReportActionsTemporarilyUnavailable,
  canGenerateReport,
  onDownloadReport,
  onEmailReport,
  onUnavailableReportAction,
  onUpdateSignOff,
  reportActionMessage,
  reportReadinessMessage,
  signOff,
}: SignOffSectionProps) {
  const areReportActionsDisabled =
    activeReportAction !== null ||
    !canGenerateReport ||
    areReportActionsTemporarilyUnavailable
  const disabledButtonClasses =
    'cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none'

  const handleDownloadClick = () => {
    if (activeReportAction !== null) {
      return
    }

    if (areReportActionsTemporarilyUnavailable) {
      onUnavailableReportAction()
      return
    }

    onDownloadReport()
  }

  const handleEmailClick = () => {
    if (activeReportAction !== null) {
      return
    }

    if (areReportActionsTemporarilyUnavailable) {
      onUnavailableReportAction()
      return
    }

    onEmailReport()
  }

  return (
    <section className={sectionShellClasses} id="sign-off">
      <div className={sectionHeadingClasses}>
        <div>
          <span className={sectionKickerClasses}>Section 11</span>
          <h2 className={sectionTitleClasses}>Sign Off</h2>
          <p className={sectionDescriptionClasses}>
            Finalise the inspection so the report details are complete when
            downloads are re-enabled.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
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
              aria-disabled={areReportActionsDisabled}
              className={`${buttonPrimaryClasses} ${
                areReportActionsDisabled ? disabledButtonClasses : ''
              }`}
              onClick={handleDownloadClick}
            >
              {activeReportAction === 'download'
                ? 'Preparing PDF...'
                : 'Download PDF Report'}
            </button>
            <button
              type="button"
              aria-disabled={areReportActionsDisabled}
              className={`${buttonSecondaryClasses} ${
                areReportActionsDisabled ? disabledButtonClasses : ''
              }`}
              onClick={handleEmailClick}
            >
              {activeReportAction === 'email'
                ? 'Preparing Email...'
                : 'Email PDF Report'}
            </button>
          </div>
        </div>

        {areReportActionsTemporarilyUnavailable ? (
          <p className="text-sm leading-6 text-slate-500">
            Report actions are temporarily unavailable.
          </p>
        ) : null}

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
