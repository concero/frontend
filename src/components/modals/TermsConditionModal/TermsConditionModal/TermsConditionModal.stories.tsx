import type { Meta, StoryObj } from '@storybook/react'
import { TermsConditionModal } from './TermsConditionModal'

const meta: Meta<typeof TermsConditionModal> = {
	component: TermsConditionModal,
}

export default meta
type Story = StoryObj<typeof TermsConditionModal>

export const Primary: Story = {
	args: {
		show: true,
	},
}
