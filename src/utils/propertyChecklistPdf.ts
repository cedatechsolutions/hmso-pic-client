import { jsPDF } from 'jspdf'
import { checklistSections } from '../data/propertyChecklist'
import type {
  AdditionalNotesState,
  ChecklistState,
  FrontPhotoState,
  GeneralFormState,
  SignOffState,
} from '../types/propertyChecklist'
import { getSectionCompletion, makeFileName, titleCase } from './propertyChecklist'

type ReportContext = {
  additionalNotes: AdditionalNotesState
  checklist: ChecklistState
  frontPhoto: FrontPhotoState
  general: GeneralFormState
  signOff: SignOffState
}

export type GeneratedInspectionReport = {
  blob: Blob
  file: File
  fileName: string
}

type FontWeight = 'normal' | 'bold'
type RgbColor = [number, number, number]
type LoadedImage = {
  dataUrl: string
  height: number
  width: number
}

const POINT_TO_MM = 0.352778
const PAGE_MARGIN = 18
const PAGE_BOTTOM_MARGIN = 16

const palette = {
  accent: [26, 71, 163] as RgbColor,
  check: [22, 163, 74] as RgbColor,
  divider: [214, 221, 230] as RgbColor,
  ink: [17, 24, 39] as RgbColor,
  muted: [107, 114, 128] as RgbColor,
} satisfies Record<string, RgbColor>

const normaliseValue = (value: string, fallback = 'Not provided') =>
  value.trim() ? value.trim() : fallback

const lineHeightMm = (fontSize: number, lineHeightFactor = 1.35) =>
  fontSize * POINT_TO_MM * lineHeightFactor

const textBlockHeight = (
  lines: string[],
  fontSize: number,
  lineHeightFactor = 1.35,
) => Math.max(lines.length, 1) * lineHeightMm(fontSize, lineHeightFactor)

const toTextLines = (
  doc: jsPDF,
  value: string,
  width: number,
  fontSize: number,
) => {
  doc.setFontSize(fontSize)
  const result = doc.splitTextToSize(value, width)

  return Array.isArray(result) ? result : [result]
}

const loadImageForPdf = async (previewUrl: string): Promise<LoadedImage | null> => {
  if (!previewUrl) {
    return null
  }

  return new Promise((resolve) => {
    const image = new Image()

    image.onload = () => {
      const scale = Math.min(1, 1600 / image.naturalWidth)
      const width = Math.max(1, Math.round(image.naturalWidth * scale))
      const height = Math.max(1, Math.round(image.naturalHeight * scale))
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')

      if (!context) {
        resolve(null)
        return
      }

      canvas.width = width
      canvas.height = height
      context.fillStyle = '#ffffff'
      context.fillRect(0, 0, width, height)
      context.drawImage(image, 0, 0, width, height)

      resolve({
        dataUrl: canvas.toDataURL('image/jpeg', 0.9),
        height,
        width,
      })
    }

    image.onerror = () => resolve(null)
    image.src = previewUrl
  })
}

const formatGeneratedAt = () =>
  new Date().toLocaleString('en-GB', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    year: 'numeric',
  })

export const createInspectionReportPdf = async ({
  additionalNotes,
  checklist,
  frontPhoto,
  general,
  signOff,
}: ReportContext): Promise<GeneratedInspectionReport> => {
  const doc = new jsPDF({
    compress: true,
    format: 'a4',
    unit: 'mm',
  })
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const contentWidth = pageWidth - PAGE_MARGIN * 2
  const totalChecklistItems = checklistSections.reduce(
    (count, section) => count + section.items.length,
    0,
  )
  const checkedChecklistItems = checklistSections.reduce(
    (count, section) => count + getSectionCompletion(section, checklist),
    0,
  )
  const safeAddress = makeFileName(general.propertyAddress) || 'property'
  const fileName = `${safeAddress}-inspection-report.pdf`
  const photo = await loadImageForPdf(frontPhoto.previewUrl)
  const generatedAt = formatGeneratedAt()

  let y = 10

  const writeText = ({
    align = 'left',
    color = palette.ink,
    fontSize = 10,
    lines,
    lineHeightFactor = 1.35,
    weight = 'normal',
    x,
    yPosition,
  }: {
    align?: 'center' | 'left' | 'right'
    color?: RgbColor
    fontSize?: number
    lines: string[]
    lineHeightFactor?: number
    weight?: FontWeight
    x: number
    yPosition: number
  }) => {
    doc.setFont('helvetica', weight)
    doc.setFontSize(fontSize)
    doc.setLineHeightFactor(lineHeightFactor)
    doc.setTextColor(...color)
    doc.text(lines, x, yPosition, { align })

    return textBlockHeight(lines, fontSize, lineHeightFactor)
  }

  const addPage = () => {
    doc.addPage()
    y = PAGE_MARGIN
  }

  const ensureSpace = (heightNeeded: number) => {
    if (y + heightNeeded <= pageHeight - PAGE_BOTTOM_MARGIN) {
      return
    }

    addPage()
  }

  const drawDivider = (spacingAbove = 0, spacingBelow = 5) => {
    ensureSpace(spacingAbove + spacingBelow + 1)
    y += spacingAbove
    doc.setDrawColor(...palette.divider)
    doc.setLineWidth(0.25)
    doc.line(PAGE_MARGIN, y, pageWidth - PAGE_MARGIN, y)
    y += spacingBelow
  }

  const renderFlowingText = ({
    color = palette.ink,
    fontSize = 10,
    lines,
    x = PAGE_MARGIN,
  }: {
    color?: RgbColor
    fontSize?: number
    lines: string[]
    x?: number
  }) => {
    const lineHeight = lineHeightMm(fontSize, 1.45)
    let lineIndex = 0

    while (lineIndex < lines.length) {
      ensureSpace(lineHeight)

      const availableHeight = pageHeight - PAGE_BOTTOM_MARGIN - y
      const linesThatFit = Math.max(1, Math.floor(availableHeight / lineHeight))
      const chunk = lines.slice(lineIndex, lineIndex + linesThatFit)

      writeText({
        color,
        fontSize,
        lines: chunk,
        lineHeightFactor: 1.45,
        x,
        yPosition: y,
      })
      y += textBlockHeight(chunk, fontSize, 1.45)
      lineIndex += chunk.length
    }
  }

  const renderTitleBlock = () => {
    writeText({
      align: 'right',
      color: palette.muted,
      fontSize: 7.5,
      lines: [`Generated ${generatedAt}`],
      x: pageWidth - PAGE_MARGIN,
      yPosition: y,
    })
    y += 7

    writeText({
      fontSize: 18,
      lines: ['Property Inspection Report'],
      weight: 'bold',
      x: PAGE_MARGIN,
      yPosition: y,
    })
    y += 8

    const subtitleLines = toTextLines(
      doc,
      general.propertyAddress.trim()
        ? general.propertyAddress
        : 'Temporary Accommodation, Families',
      contentWidth,
      10,
    )

    writeText({
      color: palette.muted,
      fontSize: 10,
      lines: subtitleLines,
      x: PAGE_MARGIN,
      yPosition: y,
    })
    y += textBlockHeight(subtitleLines, 10, 1.35) + 4
    drawDivider(0, 6)
  }

  const renderSectionHeading = ({
    description,
    number,
    title,
  }: {
    description?: string
    number?: string
    title: string
  }) => {
    ensureSpace(14)

    if (y > PAGE_MARGIN + 2) {
      drawDivider(1, 5)
    }

    if (number) {
      writeText({
        color: palette.accent,
        fontSize: 8,
        lines: [number],
        weight: 'bold',
        x: PAGE_MARGIN,
        yPosition: y,
      })
      y += 4.5
    }

    writeText({
      fontSize: 13,
      lines: [title],
      weight: 'bold',
      x: PAGE_MARGIN,
      yPosition: y,
    })
    y += 6

    if (description) {
      const descriptionLines = toTextLines(doc, description, contentWidth, 9)

      writeText({
        color: palette.muted,
        fontSize: 9,
        lines: descriptionLines,
        x: PAGE_MARGIN,
        yPosition: y,
      })
      y += textBlockHeight(descriptionLines, 9, 1.35) + 2
    }
  }

  const renderMetadataGrid = (
    fields: Array<{ label: string; value: string }>,
    columns = 2,
  ) => {
    const columnGap = 12
    const rowSize = Math.max(columns, 1)

    for (let index = 0; index < fields.length; index += rowSize) {
      const row = fields.slice(index, index + rowSize)
      const columnWidth =
        (contentWidth - columnGap * (row.length - 1)) / row.length
      const rowHeight = row.reduce((maxHeight, field) => {
        const labelLines = toTextLines(doc, field.label, columnWidth, 7.5)
        const valueLines = toTextLines(doc, field.value, columnWidth, 10.5)
        const height =
          textBlockHeight(labelLines, 7.5, 1.2) +
          textBlockHeight(valueLines, 10.5, 1.35) +
          3.5

        return Math.max(maxHeight, height)
      }, 0)

      ensureSpace(rowHeight + 2)

      row.forEach((field, columnIndex) => {
        const x = PAGE_MARGIN + columnIndex * (columnWidth + columnGap)
        const labelLines = toTextLines(doc, field.label, columnWidth, 7.5)
        const valueLines = toTextLines(doc, field.value, columnWidth, 10.5)

        writeText({
          color: palette.muted,
          fontSize: 7.5,
          lines: labelLines,
          lineHeightFactor: 1.2,
          weight: 'bold',
          x,
          yPosition: y,
        })
        writeText({
          fontSize: 10.5,
          lines: valueLines,
          x,
          yPosition: y + textBlockHeight(labelLines, 7.5, 1.2) + 2.5,
        })
      })

      y += rowHeight + 4
    }
  }

  const renderParagraphField = (
    label: string,
    value: string,
    fallback = 'None recorded',
  ) => {
    ensureSpace(10)

    writeText({
      color: palette.muted,
      fontSize: 8,
      lines: [label],
      weight: 'bold',
      x: PAGE_MARGIN,
      yPosition: y,
    })
    y += 4.5

    const paragraphLines = toTextLines(
      doc,
      normaliseValue(value, fallback),
      contentWidth,
      10,
    )

    renderFlowingText({
      color: palette.ink,
      fontSize: 10,
      lines: paragraphLines,
    })
    y += 4
  }

  const renderChecklistItem = ({
    checked,
    label,
    note,
  }: {
    checked: boolean
    label: string
    note: string
  }) => {
    const checkboxSize = 3.6
    const checkboxGap = 3.2
    const textX = PAGE_MARGIN + checkboxSize + checkboxGap
    const labelLines = toTextLines(
      doc,
      label,
      contentWidth - checkboxSize - checkboxGap,
      10,
    )
    const statusLines = toTextLines(
      doc,
      checked ? 'Status: Completed' : 'Status: Not checked',
      contentWidth - checkboxSize - checkboxGap,
      8.5,
    )
    const noteLines = note
      ? toTextLines(
          doc,
          `Note: ${note}`,
          contentWidth - checkboxSize - checkboxGap,
          8.5,
        )
      : []
    const blockHeight =
      textBlockHeight(labelLines, 10, 1.35) +
      textBlockHeight(statusLines, 8.5, 1.3) +
      (noteLines.length ? textBlockHeight(noteLines, 8.5, 1.3) + 1 : 0) +
      5

    ensureSpace(blockHeight)

    const checkboxX = PAGE_MARGIN
    const checkboxY = y + 0.9

    doc.setDrawColor(...palette.muted)
    doc.setLineWidth(0.35)
    doc.rect(checkboxX, checkboxY, checkboxSize, checkboxSize)

    if (checked) {
      doc.setDrawColor(...palette.check)
      doc.setLineWidth(0.7)
      doc.line(
        checkboxX + 0.8,
        checkboxY + 2.0,
        checkboxX + 1.55,
        checkboxY + 2.8,
      )
      doc.line(
        checkboxX + 1.55,
        checkboxY + 2.8,
        checkboxX + 2.9,
        checkboxY + 1.0,
      )
    }

    writeText({
      fontSize: 10,
      lines: labelLines,
      weight: 'bold',
      x: textX,
      yPosition: y + 1.2,
    })
    const labelHeight = textBlockHeight(labelLines, 10, 1.35)

    writeText({
      color: palette.muted,
      fontSize: 8.5,
      lines: statusLines,
      lineHeightFactor: 1.3,
      x: textX,
      yPosition: y + labelHeight + 1.8,
    })

    if (noteLines.length) {
      writeText({
        color: palette.muted,
        fontSize: 8.5,
        lines: noteLines,
        lineHeightFactor: 1.3,
        x: textX,
        yPosition:
          y +
          labelHeight +
          textBlockHeight(statusLines, 8.5, 1.3) +
          2.2,
      })
    }

    y += blockHeight
  }

  const renderPhotoEvidence = () => {
    ensureSpace(12)

    writeText({
      color: palette.muted,
      fontSize: 8,
      lines: ['Photo evidence'],
      weight: 'bold',
      x: PAGE_MARGIN,
      yPosition: y,
    })
    y += 4.5

    if (!photo) {
      writeText({
        color: palette.ink,
        fontSize: 10,
        lines: ['No front image attached for this inspection.'],
        x: PAGE_MARGIN,
        yPosition: y,
      })
      y += 7
      return
    }

    const maxWidth = contentWidth
    const maxHeight = 92
    const photoRatio = photo.width / photo.height
    let renderWidth = maxWidth
    let renderHeight = renderWidth / photoRatio

    if (renderHeight > maxHeight) {
      renderHeight = maxHeight
      renderWidth = renderHeight * photoRatio
    }

    ensureSpace(renderHeight + 12)

    const imageX = PAGE_MARGIN + (contentWidth - renderWidth) / 2

    doc.addImage(photo.dataUrl, 'JPEG', imageX, y, renderWidth, renderHeight)
    y += renderHeight + 4

    if (frontPhoto.fileName.trim()) {
      writeText({
        color: palette.muted,
        fontSize: 8,
        lines: [frontPhoto.fileName],
        x: PAGE_MARGIN,
        yPosition: y,
      })
      y += 5
    }
  }

  renderTitleBlock()

  renderSectionHeading({
    number: 'Inspection summary',
    title: 'General information',
  })
  renderMetadataGrid(
    [
      {
        label: 'Property address',
        value: normaliseValue(general.propertyAddress),
      },
      {
        label: 'Inspection date',
        value: normaliseValue(general.inspectionDate),
      },
      {
        label: 'Inspector',
        value: normaliseValue(general.inspectorName),
      },
      {
        label: 'Occupancy',
        value: titleCase(general.occupancy),
      },
      {
        label: 'Checklist completion',
        value: `${checkedChecklistItems} of ${totalChecklistItems} items completed`,
      },
      {
        label: 'Sign-off date',
        value: normaliseValue(signOff.signOffDate),
      },
    ],
    2,
  )
  renderParagraphField(
    'Overall condition',
    general.overallCondition,
    'No overall condition notes recorded.',
  )

  checklistSections.forEach((section) => {
    const sectionCompletedCount = getSectionCompletion(section, checklist)

    renderSectionHeading({
      description: section.description,
      number: `Section ${section.number}`,
      title: section.title,
    })

    writeText({
      color: palette.muted,
      fontSize: 8,
      lines: [
        `${sectionCompletedCount} of ${section.items.length} items completed`,
      ],
      x: PAGE_MARGIN,
      yPosition: y,
    })
    y += 5

    section.items.forEach((item) => {
      renderChecklistItem({
        checked: checklist[item.id]?.checked ?? false,
        label: item.label,
        note: checklist[item.id]?.note ?? '',
      })
    })

    if (section.id === 'exterior-access') {
      renderPhotoEvidence()
    }
  })

  renderSectionHeading({
    number: 'Section 10',
    title: 'Additional notes',
  })
  renderParagraphField(
    'Maintenance issues identified',
    additionalNotes.maintenanceIssues,
    'No maintenance issues recorded.',
  )
  renderParagraphField(
    'Repairs required',
    additionalNotes.repairsRequired,
    'No repairs required recorded.',
  )
  renderParagraphField(
    'Tenant feedback',
    additionalNotes.tenantFeedback,
    'No tenant feedback recorded.',
  )
  renderParagraphField(
    'Inspector comments',
    additionalNotes.inspectorComments,
    'No additional inspector comments recorded.',
  )

  renderSectionHeading({
    number: 'Section 11',
    title: 'Sign off',
  })
  renderMetadataGrid(
    [
      {
        label: 'Inspector signature',
        value: normaliseValue(signOff.inspectorSignature),
      },
      {
        label: 'Sign-off date',
        value: normaliseValue(signOff.signOffDate),
      },
    ],
    2,
  )

  const totalPages = doc.getNumberOfPages()

  for (let page = 1; page <= totalPages; page += 1) {
    doc.setPage(page)
    doc.setDrawColor(...palette.divider)
    doc.setLineWidth(0.25)
    doc.line(
      PAGE_MARGIN,
      pageHeight - 10,
      pageWidth - PAGE_MARGIN,
      pageHeight - 10,
    )
    writeText({
      color: palette.muted,
      fontSize: 7.5,
      lines: ['Property Inspection Report'],
      x: PAGE_MARGIN,
      yPosition: pageHeight - 6,
    })
    writeText({
      align: 'right',
      color: palette.muted,
      fontSize: 7.5,
      lines: [`Page ${page} of ${totalPages}`],
      x: pageWidth - PAGE_MARGIN,
      yPosition: pageHeight - 6,
    })
  }

  const arrayBuffer = doc.output('arraybuffer')
  const blob = new Blob([arrayBuffer], { type: 'application/pdf' })

  return {
    blob,
    file: new File([blob], fileName, { type: 'application/pdf' }),
    fileName,
  }
}
