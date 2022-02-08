import {
	screen,
	render,
	waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SummaryForm from '../SummaryForm';

test('checkbox is unchecked by default', () => {
	render(<SummaryForm />);
	const checkbox = screen.getByRole('checkbox', {
		name: 'I agree to Terms and Conditions',
	});
	const button = screen.getByRole('button', { name: /confirm order/i });
	expect(checkbox).not.toBeChecked();
	expect(button).toBeDisabled();
});
test('checkbox enables the button', () => {
	render(<SummaryForm />);
	const checkbox = screen.getByRole('checkbox', {
		name: 'I agree to Terms and Conditions',
	});
	const button = screen.getByRole('button', { name: /confirm order/i });

	userEvent.click(checkbox);
	expect(button).toBeEnabled();

	userEvent.click(checkbox);
	expect(button).toBeDisabled();
});

test('popover responds to hover', async () => {
	render(<SummaryForm />);

	const nullPopover = screen.queryByText(
		/no ice cream will acually be delivered/i
	);
	expect(nullPopover).not.toBeInTheDocument();

	const termsAndConditions = screen.getByText(/Terms and Conditions/i);
	userEvent.hover(termsAndConditions);
	await screen.findByText('No ice cream will actually be delivered');

	userEvent.unhover(termsAndConditions);
	await waitForElementToBeRemoved(() => {
		return screen.queryByText(/No ice cream will actually be delivered/i);
	});
});
