import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

test('order phases for happy path', async () => {
	// render App
	render(<App />);
	// add scoops & toppings
	const vanillaInput = await screen.findByRole('spinbutton', {
		name: 'Vanilla',
	});
	const toppingCheckbox = await screen.findByRole('checkbox', { name: 'M&Ms' });
	userEvent.clear(vanillaInput);
	userEvent.type(vanillaInput, '1');
	userEvent.click(toppingCheckbox);

	// find and click order button
	const orderButton = screen.getByRole('button', { name: /order sundae/i });
	userEvent.click(orderButton);
	// check summary
	const summaryHeading = screen.getByRole('heading', { name: 'Order Summary' });
	expect(summaryHeading).toBeInTheDocument();
	const scoopsHeading = screen.getByRole('heading', { name: /scoops/i });
	expect(scoopsHeading).toBeInTheDocument();
	const toppingsHeading = screen.getByRole('heading', { name: /toppings/i });
	expect(toppingsHeading).toBeInTheDocument();
	const termsAndConditions = await screen.findByRole('checkbox');
	userEvent.click(termsAndConditions);
	// accept terms and conditions and confirm
	const confirmButton = screen.getByRole('button', { name: 'Confirm order' });
	userEvent.click(confirmButton);
	// confirm order number
	const orderNumber = await screen.findByText(/order number/i);
	expect(orderNumber).toBeInTheDocument();
	// click new order button
	const createOrderButton = await screen.findByRole('button', {
		name: 'Create new order',
	});
	userEvent.click(createOrderButton);
	// check if orders are reset
	const vanillaInputReset = await screen.findByRole('spinbutton', {
		name: 'Vanilla',
	});
	expect(vanillaInputReset).toHaveValue(0);
	const grandTotal = screen.getByRole('heading', { name: /grand total: \$/i });
	expect(grandTotal).toHaveTextContent('0.00');
});
