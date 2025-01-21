import type { Meta, StoryObj } from '@storybook/react'
import { TermsConditionErrorModal } from './TermsConditionErrorModal'

const meta: Meta<typeof TermsConditionErrorModal> = {
	component: TermsConditionErrorModal,
}

export default meta
type Story = StoryObj<typeof TermsConditionErrorModal>

export const Primary: Story = {
	args: {
		show: true,
	},
}
