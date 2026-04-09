import type { ChangeEventHandler } from 'react'
import type { PhotoAttachment } from '../../types/propertyChecklist'
import {
  helperTextClasses,
  previewCardClasses,
  previewImageClasses,
  previewMetaClasses,
  previewPlaceholderClasses,
  previewRemoveButtonClasses,
  sectionKickerClasses,
  sectionTitleClasses,
  uploadButtonClasses,
  uploadCardClasses,
  uploadDropzoneClasses,
  uploadGridClasses,
  uploadPanelClasses,
} from './styles'

type SectionPhotoEvidenceProps = {
  attachments: PhotoAttachment[]
  description: string
  inputId: string
  onPhotoChange: ChangeEventHandler<HTMLInputElement>
  onRemovePhoto: (attachmentId: string) => void
  title?: string
}

function SectionPhotoEvidence({
  attachments,
  description,
  inputId,
  onPhotoChange,
  onRemovePhoto,
  title = 'Photo evidence',
}: SectionPhotoEvidenceProps) {
  return (
    <div className={uploadCardClasses}>
      <div className="grid gap-4">
        <span className={sectionKickerClasses}>Photo Evidence</span>
        <div className="grid gap-2">
          <h3 className={sectionTitleClasses}>{title}</h3>
          <p className="text-sm leading-6 text-slate-500">{description}</p>
        </div>

        <label className={uploadDropzoneClasses} htmlFor={inputId}>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            multiple
            onChange={onPhotoChange}
          />
          <span className={uploadButtonClasses}>Choose images</span>
          <span className={helperTextClasses}>
            Upload one or more images for this section.
          </span>
        </label>
      </div>

      <div className={uploadPanelClasses}>
        {attachments.length ? (
          <div className={uploadGridClasses}>
            {attachments.map((attachment) => (
              <div key={attachment.id} className={previewCardClasses}>
                <img
                  className={previewImageClasses}
                  src={attachment.previewUrl}
                  alt={attachment.fileName}
                />
                <div className={previewMetaClasses}>
                  <strong className="break-words text-sm text-slate-800">
                    {attachment.fileName}
                  </strong>
                  <button
                    type="button"
                    className={previewRemoveButtonClasses}
                    onClick={() => onRemovePhoto(attachment.id)}
                  >
                    Remove image
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`${previewCardClasses} ${previewPlaceholderClasses}`}>
            <strong>Image previews will appear here</strong>
            <span className={helperTextClasses}>
              Add one or more images to attach photo evidence to this section.
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SectionPhotoEvidence
