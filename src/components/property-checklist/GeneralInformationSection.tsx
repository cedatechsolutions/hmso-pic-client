import type {
  GeneralFormState,
  UpdateGeneralField,
} from '../../types/propertyChecklist'
import DatePickerField from './DatePickerField'
import {
  fieldClasses,
  fieldLabelClasses,
  formGridClasses,
  fullWidthFieldClasses,
  radioGroupClasses,
  radioOptionClasses,
  radioOptionCheckedClasses,
  sectionHeadingClasses,
  sectionKickerClasses,
  sectionShellClasses,
  sectionTitleClasses,
  sectionDescriptionClasses,
} from './styles'

type GeneralInformationSectionProps = {
  general: GeneralFormState
  onUpdateGeneral: UpdateGeneralField
}

function GeneralInformationSection({
  general,
  onUpdateGeneral,
}: GeneralInformationSectionProps) {
  return (
    <section className={sectionShellClasses} id="general-information">
      <div className={sectionHeadingClasses}>
        <div>
          <span className={sectionKickerClasses}>Section 01</span>
          <h2 className={sectionTitleClasses}>General Information</h2>
          <p className={sectionDescriptionClasses}>
            Capture the inspection context first so the rest of the report stays
            traceable.
          </p>
        </div>
      </div>

      <div className={formGridClasses}>
        <label className={fieldClasses}>
          <span className={fieldLabelClasses}>
            Property Address <span className="text-red-600">*</span>
          </span>
          <input
            type="text"
            value={general.propertyAddress}
            onChange={(event) =>
              onUpdateGeneral('propertyAddress', event.target.value)
            }
            placeholder="Enter property address"
          />
        </label>

        <DatePickerField
          label="Date of Inspection"
          required
          value={general.inspectionDate}
          onChange={(value) => onUpdateGeneral('inspectionDate', value)}
        />

        <label className={fieldClasses}>
          <span className={fieldLabelClasses}>
            Inspector Name <span className="text-red-600">*</span>
          </span>
          <input
            type="text"
            value={general.inspectorName}
            onChange={(event) =>
              onUpdateGeneral('inspectorName', event.target.value)
            }
            placeholder="Full name"
          />
        </label>

        <fieldset className={fieldClasses}>
          <legend className={fieldLabelClasses}>
            Occupied or Vacant <span className="text-red-600">*</span>
          </legend>
          <div className={radioGroupClasses}>
            <label
              className={`${radioOptionClasses} ${
                general.occupancy === 'occupied'
                  ? radioOptionCheckedClasses
                  : ''
              }`}
            >
              <input
                type="radio"
                name="occupancy"
                checked={general.occupancy === 'occupied'}
                onChange={() => onUpdateGeneral('occupancy', 'occupied')}
              />
              <span>Occupied</span>
            </label>

            <label
              className={`${radioOptionClasses} ${
                general.occupancy === 'vacant'
                  ? radioOptionCheckedClasses
                  : ''
              }`}
            >
              <input
                type="radio"
                name="occupancy"
                checked={general.occupancy === 'vacant'}
                onChange={() => onUpdateGeneral('occupancy', 'vacant')}
              />
              <span>Vacant</span>
            </label>
          </div>
        </fieldset>

        <label className={`${fieldClasses} ${fullWidthFieldClasses}`}>
          <span className={fieldLabelClasses}>Notes on Overall Condition</span>
          <textarea
            rows={4}
            value={general.overallCondition}
            onChange={(event) =>
              onUpdateGeneral('overallCondition', event.target.value)
            }
            placeholder="Summarise the property condition, priorities, or risks observed during the visit."
          />
        </label>
      </div>
    </section>
  )
}

export default GeneralInformationSection
