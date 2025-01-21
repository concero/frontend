import { fireEvent, render, waitFor } from '@testing-library/react'
import { ListModal } from '../../components/modals/ListModal/ListModal'
import jest from 'jest-mock'
import React from 'react'

const mockGetItems = jest.fn().mockResolvedValue([])

describe('ListModal Component', () => {
	it('renders ListModal component correctly', () => {
		const { getByText, getByPlaceholderText } = render(
			<ListModal
				getItems={mockGetItems}
				isOpen={true}
				setIsOpen={() => {}}
				title="Test Modal"
				RenderItem={() => <div>Mock Item</div>}
			/>,
		)

		expect(getByText('Test Modal')).toBeInTheDocument()
		expect(getByPlaceholderText('Search...')).toBeInTheDocument()
	})

	it('handles search functionality', async () => {
		const { getByPlaceholderText, getByText } = render(
			<ListModal
				getItems={mockGetItems}
				isOpen={true}
				setIsOpen={() => {}}
				title="Test Modal"
				RenderItem={() => <div>Mock Item</div>}
			/>,
		)

		const searchInput = getByPlaceholderText('Search...')

		fireEvent.change(searchInput, { target: { value: 'test search' } })

		await waitFor(() => {
			expect(mockGetItems).toHaveBeenCalledWith({
				offset: 0,
				limit: 15,
				search: 'test search',
			})
		})

		expect(getByText('Test Modal')).toBeInTheDocument()
	})
})
