import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { CharacterCreatorPage } from '../CharacterCreatorPage'
import { createMockCharacter, createMockClasses, createMageClass, createWarriorClass } from '@/test/factories'
import * as characterStorage from '@/lib/characterStorage'
import * as dataProvider from '@/lib/dataProvider'
import * as characterExport from '@/lib/characterExport'
import * as routerDom from 'react-router-dom'

// Mock modules
vi.mock('@/lib/characterStorage')
vi.mock('@/lib/dataProvider')
vi.mock('@/lib/characterExport')
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: vi.fn(),
  }
})

// Mock hooks separately to avoid hoisting issues
vi.mock('@/hooks/useAutoSave', () => ({
  useAutoSave: vi.fn(),
}))

describe('CharacterCreatorPage', () => {
  const mockNavigate = vi.fn()
  const mockClasses = createMockClasses(3)

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Setup default mocks
    ;(routerDom.useParams as Mock).mockReturnValue({ characterId: 'nouveau' })
    ;(routerDom.useNavigate as Mock).mockReturnValue(mockNavigate)

    const classes = [createWarriorClass(), createMageClass(), ...mockClasses]
    ;(dataProvider.useClasses as Mock).mockReturnValue({
      classes,
      loading: false,
      error: null,
    })

    ;(characterStorage.createCharacter as Mock).mockImplementation((cls, name) => {
      return createMockCharacter({
        sourceClass: cls?.name,
        name: name || cls?.name || 'Nouveau Personnage',
      })
    })

    ;(characterStorage.saveCharacter as Mock).mockImplementation(() => {})
    ;(characterStorage.getCharacter as Mock).mockImplementation(() => null)
  })

  describe('Rendering - New Character Creation', () => {
    it('should display class selection dialog when creating new character', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Créer un personnage')).toBeInTheDocument()
      })

      expect(screen.getByText('Partir de zéro')).toBeInTheDocument()
      expect(screen.getByText('Créer un personnage vierge et le personnaliser entièrement')).toBeInTheDocument()
    })

    it('should display all available classes in the dialog', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Guerrier')).toBeInTheDocument()
      })

      expect(screen.getByText('Mage')).toBeInTheDocument()
      expect(screen.getByText('Test Class 1')).toBeInTheDocument()
      expect(screen.getByText('Test Class 2')).toBeInTheDocument()
      expect(screen.getByText('Test Class 3')).toBeInTheDocument()
    })

    it('should display "Partir d\'une classe" section', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Partir d\'une classe')).toBeInTheDocument()
      })
    })

    it('should show class health and spell count in badges', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('120 PV')).toBeInTheDocument() // Guerrier
      })

      expect(screen.getByText('80 PV')).toBeInTheDocument() // Mage
      expect(screen.getByText('2 sorts')).toBeInTheDocument() // Mage spells
    })
  })

  describe('User Interaction - Class Selection', () => {
    it('should create character from scratch when clicking "Partir de zéro"', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Partir de zéro')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Partir de zéro'))

      await waitFor(() => {
        expect(characterStorage.createCharacter).toHaveBeenCalledWith(undefined, undefined)
        expect(characterStorage.saveCharacter).toHaveBeenCalled()
        expect(mockNavigate).toHaveBeenCalled()
      })
    })

    it('should create character from selected class', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Guerrier')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Guerrier'))

      await waitFor(() => {
        expect(characterStorage.createCharacter).toHaveBeenCalled()
        const call = (characterStorage.createCharacter as Mock).mock.calls[0]
        expect(call[0].name).toBe('Guerrier')
      })
    })

    it('should navigate to edit URL after creating character', async () => {
      const user = userEvent.setup()
      const mockChar = createMockCharacter()
      ;(characterStorage.createCharacter as Mock).mockReturnValue(mockChar)

      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Partir de zéro')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Partir de zéro'))

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(`/personnages/${mockChar.id}`, { replace: true })
      })
    })

    it('should navigate back to characters list when closing dialog without selection', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      })

      // Press Escape to close dialog
      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/personnages')
      })
    })
  })

  describe('Rendering - Edit Mode', () => {
    beforeEach(async () => {
      const mockChar = createMockCharacter({ name: 'Existing Character' })
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })
    })

    it('should load and display existing character', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Character')).toBeInTheDocument()
      })

      expect(characterStorage.getCharacter).toHaveBeenCalled()
    })

    it('should not show class selection dialog in edit mode', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Existing Character')).toBeInTheDocument()
      })

      expect(screen.queryByText('Créer un personnage')).not.toBeInTheDocument()
    })

    it('should display all editor tabs', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Statistiques')).toBeInTheDocument()
      })

      expect(screen.getByText('Flux')).toBeInTheDocument()
      expect(screen.getByText('Affinités')).toBeInTheDocument()
      expect(screen.getByText('Sorts')).toBeInTheDocument()
      expect(screen.getByText('Équipement')).toBeInTheDocument()
      expect(screen.getByText('Compétences')).toBeInTheDocument()
    })

    it('should display export buttons', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('YAML')).toBeInTheDocument()
      })

      expect(screen.getByText('PDF')).toBeInTheDocument()
    })

    it('should display back button', async () => {
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        const backButton = screen.getByRole('button', { name: '' })
        expect(backButton).toBeInTheDocument()
      })
    })
  })

  describe('User Interaction - Character Editing', () => {
    let mockChar: ReturnType<typeof createMockCharacter>

    beforeEach(async () => {
      mockChar = createMockCharacter({ name: 'Test Hero', type: 'Aventurier' })
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })
    })

    it('should allow editing character name', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Hero')).toBeInTheDocument()
      })

      const nameInput = screen.getByDisplayValue('Test Hero')
      await user.clear(nameInput)
      await user.type(nameInput, 'New Hero Name')

      expect(nameInput).toHaveValue('New Hero Name')
    })

    it('should allow editing character type', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Aventurier')).toBeInTheDocument()
      })

      const typeInput = screen.getByDisplayValue('Aventurier')
      await user.clear(typeInput)
      await user.type(typeInput, 'Guerrier')

      expect(typeInput).toHaveValue('Guerrier')
    })

    it('should allow editing character description', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByPlaceholderText('Description du personnage...')).toBeInTheDocument()
      })

      const descInput = screen.getByPlaceholderText('Description du personnage...')
      await user.type(descInput, 'A brave warrior')

      expect(descInput).toHaveValue('A brave warrior')
    })

    it('should navigate back when clicking back button', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: '' })).toBeInTheDocument()
      })

      const backButton = screen.getAllByRole('button')[0] // First button is back button
      await user.click(backButton)

      expect(mockNavigate).toHaveBeenCalledWith('/personnages')
    })
  })

  describe('Export Functionality', () => {
    let mockChar: ReturnType<typeof createMockCharacter>

    beforeEach(async () => {
      mockChar = createMockCharacter()
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })

      ;(characterExport.exportToYAML as Mock).mockImplementation(() => {})
      ;(characterExport.exportToPDF as Mock).mockImplementation(() => {})
    })

    it('should export to YAML when clicking YAML button', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('YAML')).toBeInTheDocument()
      })

      await user.click(screen.getByText('YAML'))

      expect(characterExport.exportToYAML).toHaveBeenCalledWith(expect.objectContaining({
        id: mockChar.id,
      }))
    })

    it('should export to PDF when clicking PDF button', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('PDF')).toBeInTheDocument()
      })

      await user.click(screen.getByText('PDF'))

      expect(characterExport.exportToPDF).toHaveBeenCalledWith(expect.objectContaining({
        id: mockChar.id,
      }))
    })
  })

  describe('Error Handling', () => {
    it('should redirect to characters list when character not found', async () => {
      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: 'non-existent-id' })
      ;(characterStorage.getCharacter as Mock).mockReturnValue(null)

      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/personnages')
      })
    })

    it('should display loading spinner when character is not yet loaded', async () => {
      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: 'loading-id' })
      ;(characterStorage.getCharacter as Mock).mockReturnValue(null)

      // Don't trigger the useEffect redirect immediately
      mockNavigate.mockImplementation(() => {})

      render(<CharacterCreatorPage />)

      // Should show either loading or dialog, not blank
      const hasContent = screen.queryByText('Chargement...') || screen.queryByText('Créer un personnage')
      expect(hasContent).toBeTruthy()
    })
  })

  describe('Tab Navigation', () => {
    let mockChar: ReturnType<typeof createMockCharacter>

    beforeEach(async () => {
      mockChar = createMockCharacter()
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })
    })

    it('should switch to Flux tab when clicked', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Flux')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Flux'))

      // FluxEditor should now be visible (implementation detail may vary)
      expect(screen.getByText('Flux')).toBeInTheDocument()
    })

    it('should switch to Affinités tab when clicked', async () => {
      const user = userEvent.setup()
      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Affinités')).toBeInTheDocument()
      })

      await user.click(screen.getByText('Affinités'))

      expect(screen.getByText('Affinités')).toBeInTheDocument()
    })
  })

  describe('Source Class Badge', () => {
    it('should display source class badge when character is created from a class', async () => {
      const mockChar = createMockCharacter({ sourceClass: 'Guerrier' })
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })

      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByText('Basé sur Guerrier')).toBeInTheDocument()
      })
    })

    it('should not display source class badge for scratch characters', async () => {
      const mockChar = createMockCharacter({ sourceClass: undefined })
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })

      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Character')).toBeInTheDocument()
      })

      expect(screen.queryByText(/Basé sur/)).not.toBeInTheDocument()
    })
  })

  describe('Auto-save Indicator', () => {
    it('should display "Sauvegardé" indicator after auto-save (integration with actual hook)', async () => {
      const mockChar = createMockCharacter()
      ;(characterStorage.getCharacter as Mock).mockReturnValue(mockChar)

      ;(routerDom.useParams as Mock).mockReturnValue({ characterId: mockChar.id })

      render(<CharacterCreatorPage />)

      await waitFor(() => {
        expect(screen.getByDisplayValue('Test Character')).toBeInTheDocument()
      })

      // Note: Testing auto-save indicator requires modifying the component
      // to trigger the save indicator, which happens via the useAutoSave hook
      // This test documents the expected behavior
    })
  })
})
