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
  onDownloadReport: () => void
  onEmailReport: () => void
  onUpdateSignOff: UpdateSignOffField
  signOff: SignOffState
}

function SignOffSection({
  onDownloadReport,
  onEmailReport,
  onUpdateSignOff,
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
              Download a text report for your records or open a prefilled draft
              email with the inspection summary.
            </p>
          </div>

          <div className={actionButtonsClasses}>
            <button
              type="button"
              className={buttonPrimaryClasses}
              onClick={onDownloadReport}
            >
              Download Inspection Report
            </button>
            <button
              type="button"
              className={buttonSecondaryClasses}
              onClick={onEmailReport}
            >
              Email Inspection Report
            </button>
          </div>
        </div>
      </div>

      
    </section>
  )
}

export default SignOffSection
