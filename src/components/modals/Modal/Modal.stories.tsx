import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
const meta: Meta<typeof Modal> = {
	component: Modal,
}

export default meta
type Story = StoryObj<typeof Modal>
const CustomModalContent = (): JSX.Element => {
	return (
		<div>
			<div>
				CustomCmponent
				<button>HEllo click me</button>
			</div>
		</div>
	)
}

export const Primary: Story = {
	args: {
		show: true,
		title: 'Title the modal',
		children: CustomModalContent(),
	},
}
