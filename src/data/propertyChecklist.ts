import type {
  ChecklistSectionData,
  ChecklistState,
  NavigationSection,
} from '../types/propertyChecklist'

export const checklistSections: ChecklistSectionData[] = [
  {
    id: 'exterior-access',
    number: 2,
    title: 'Exterior Access',
    description:
      'Confirm the arrival condition, access readiness, and front-facing presentation.',
    items: [
      {
        id: 'exterior-visible-damage',
        label:
          'Property exterior is free from visible damage, rubbish, and hazards (walls, roof, gutters, windows)',
      },
      { id: 'key-in-safe', label: 'Check that the key is in the safe' },
      { id: 'bins-not-overflowing', label: 'Bins are not overflowing' },
    ],
  },
  {
    id: 'health-and-safety',
    number: 3,
    title: 'Health and Safety',
    description: 'Record essential life-safety equipment and clear emergency access.',
    items: [
      {
        id: 'smoke-alarms',
        label: 'Smoke alarms installed and tested (working on all levels)',
      },
      {
        id: 'carbon-monoxide',
        label: 'Carbon monoxide detectors present, functional, and in date',
      },
      { id: 'fire-blankets', label: 'Fire blankets provided (and in date)' },
      { id: 'fire-exits', label: 'Fire exits are clear and accessible' },
    ],
  },
  {
    id: 'cleanliness-damp-mould',
    number: 4,
    title: 'Cleanliness, Damp and Mould',
    description:
      'Inspect cleanliness standards and look for mould, damp, pests, and wear.',
    items: [
      {
        id: 'clean-presentable',
        label: 'Overall, the property is clean and presentable',
      },
      {
        id: 'damp-and-mould',
        label: 'Check the whole house for damp and mould',
      },
      {
        id: 'kitchen-clean',
        label: 'Kitchen surfaces and appliances clean',
      },
      {
        id: 'bathrooms-hygienic',
        label: 'Bathrooms and toilets hygienic and mould-free',
      },
      {
        id: 'floors-carpets',
        label: 'Floors and carpets vacuumed or washed',
      },
      { id: 'windows-clean', label: 'Windows and glass clean' },
      {
        id: 'no-pests',
        label: 'No signs of pests (insects or rodents)',
      },
      {
        id: 'mattress-protectors',
        label: 'Ensure mattress protectors are on properly',
      },
    ],
  },
  {
    id: 'kitchen-area',
    number: 5,
    title: 'Kitchen Area',
    description:
      'Review hygiene, utilities, storage, and leak risks across the kitchen.',
    items: [
      {
        id: 'cooker-clean',
        label: 'Cooker, oven, hob, and extractor clean and operational',
      },
      {
        id: 'fridge-working',
        label: 'Fridge and freezer clean, defrosted, and working',
      },
      { id: 'sink-leaks', label: 'Check under sink for leaks' },
      {
        id: 'sink-silicone',
        label: 'Check silicone around sink for leaks, gas, and mould',
      },
      {
        id: 'taps-working',
        label: 'Sink and taps leak-free with hot and cold water',
      },
      {
        id: 'cupboards-secure',
        label: 'Cupboards and drawers clean and secure',
      },
      {
        id: 'food-storage',
        label: 'Check food is stored correctly to deter pests and rodents',
      },
    ],
  },
  {
    id: 'bathrooms',
    number: 6,
    title: 'Bathroom(s)',
    description:
      'Verify ventilation, seals, moisture control, and general bathroom condition.',
    items: [
      { id: 'bathroom-silicone', label: 'Check silicone for gaps and mould' },
      { id: 'extractor-fan', label: 'Extractor fan operational' },
      { id: 'no-bathroom-mould', label: 'No mould or damp present' },
      { id: 'windows-open', label: 'Check windows are open' },
    ],
  },
  {
    id: 'bedrooms',
    number: 7,
    title: 'Bedrooms',
    description:
      'Check comfort, furnishings, and room functionality across sleeping areas.',
    items: [
      {
        id: 'bedding-clean',
        label: 'Bedding or linen (if provided) clean',
      },
      {
        id: 'bedroom-furniture',
        label: 'Furniture (wardrobes, drawers) stable and functional',
      },
      {
        id: 'bedroom-windows',
        label: 'Windows, curtains, and blinds in good condition',
      },
      {
        id: 'bedroom-heating-lighting',
        label: 'Adequate heating and lighting',
      },
    ],
  },
  {
    id: 'living-and-communal-areas',
    number: 8,
    title: 'Living and Communal Areas',
    description:
      'Assess shared spaces for safety, comfort, cleanliness, and working utilities.',
    items: [
      {
        id: 'communal-furniture',
        label: 'Furniture (sofas, chairs, tables) safe and clean',
      },
      { id: 'tv-remote', label: 'TV and remote (if provided) working' },
      {
        id: 'communal-flooring',
        label: 'Flooring free from damage and clean',
      },
      {
        id: 'communal-lighting',
        label: 'Adequate lighting (bulbs working)',
      },
      { id: 'communal-heating', label: 'Heating system working' },
    ],
  },
  {
    id: 'utilities-and-services',
    number: 9,
    title: 'Utilities and Services',
    description:
      'Confirm core services are functional and accessible for the occupants.',
    items: [
      {
        id: 'electricity-working',
        label: 'Electricity supply working (check fuse board accessible)',
      },
      {
        id: 'gas-working',
        label: 'Gas supply operational (if applicable)',
      },
      {
        id: 'water-working',
        label: 'Water supply running clear and hot/cold taps working',
      },
      {
        id: 'wifi-working',
        label: 'Wi-Fi or internet (if provided) functioning',
      },
      {
        id: 'laundry-working',
        label:
          'Laundry facilities (washing machine or dryer, if applicable) working',
      },
    ],
  },
]

export const checklistSectionsById = checklistSections.reduce<
  Record<string, ChecklistSectionData>
>((state, section) => {
  state[section.id] = section
  return state
}, {})

export const navigationSections: NavigationSection[] = [
  { id: 'general-information', number: 1, title: 'General Information' },
  ...checklistSections.map((section) => ({
    id: section.id,
    number: section.number,
    title: section.title,
  })),
  { id: 'additional-notes', number: 10, title: 'Additional Notes' },
  { id: 'sign-off', number: 11, title: 'Sign Off' },
]

export const createChecklistState = (): ChecklistState =>
  checklistSections.reduce<ChecklistState>((state, section) => {
    section.items.forEach((item) => {
      state[item.id] = {
        checked: false,
        note: '',
      }
    })

    return state
  }, {})
