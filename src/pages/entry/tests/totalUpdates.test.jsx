import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import OrderEntry from '../OrderEntry';

test('update scoop subtotal when scoops change', async () => {
	render(<Options optionType='scoops' />);

	// make sure total starts out $0.00
	const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
	expect(scoopsSubtotal).toHaveTextContent('0.00');

	// update vanilla scoops to 1 and check the subtotal
	const vanillaInput = await screen.findByRole('spinbutton', {
		name: 'Vanilla',
	});
	userEvent.clear(vanillaInput);
	userEvent.type(vanillaInput, '1');
	expect(scoopsSubtotal).toHaveTextContent('2.00');

	// update chocolate scoops to 2 and check subtotal
	const chocolateInput = await screen.findByRole('spinbutton', {
		name: 'Chocolate',
	});
	userEvent.clear(chocolateInput);
	userEvent.type(chocolateInput, '2');
	expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('update toppings subtotal when toppings change', async () => {
	render(<Options optionType='toppings' />);
	const toppingsSubtotal = screen.getByText('Toppings total: $', {
		exact: false,
	});
	expect(toppingsSubtotal).toHaveTextContent('0.00');

	const cherriesCheckbox = await screen.findByRole('checkbox', {
		name: 'Cherries',
	});
	// userEvent.clear(cherriesCheckbox);
	userEvent.click(cherriesCheckbox);
	expect(toppingsSubtotal).toHaveTextContent('1.50');

	const mandmsCheckbox = await screen.findByRole('checkbox', {
		name: 'M&Ms',
	});
	// userEvent.clear(mandmsCheckbox);
	userEvent.click(mandmsCheckbox);
	expect(toppingsSubtotal).toHaveTextContent('3.00');

	userEvent.click(cherriesCheckbox);
	expect(toppingsSubtotal).toHaveTextContent('1.50');
});

describe('grand total', () => {
	test('updates when we add scoop first, then topping', async () => {
		render(<OrderEntry />);
		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});
		// expect 0.00
		expect(grandTotal).toHaveTextContent('0.00');
		//add scoop
		const vanillaInput = await screen.findByRole('spinbutton', {
			name: 'Vanilla',
		});
		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, '2');
		//add topping
		const mandmsCheckbox = await screen.findByRole('checkbox', {
			name: 'M&Ms',
		});
		userEvent.click(mandmsCheckbox);
		expect(grandTotal).toHaveTextContent('5.50');
	});
	test('updates when we add topping first, then scoop', async () => {
		render(<OrderEntry />);
		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});
		//add topping
		const mandmsCheckbox = await screen.findByRole('checkbox', {
			name: 'M&Ms',
		});
		userEvent.click(mandmsCheckbox);
		//add scoop
		const vanillaInput = await screen.findByRole('spinbutton', {
			name: 'Vanilla',
		});
		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, '2');
		expect(grandTotal).toHaveTextContent('5.50');
	});
	test('updates when item is removed', async () => {
		render(<OrderEntry />);
		const grandTotal = screen.getByRole('heading', {
			name: /grand total: \$/i,
		});
		//add topping
		const mandmsCheckbox = await screen.findByRole('checkbox', {
			name: 'M&Ms',
		});
		userEvent.click(mandmsCheckbox);
		//add scoop
		const vanillaInput = await screen.findByRole('spinbutton', {
			name: 'Vanilla',
		});
		userEvent.clear(vanillaInput);
		userEvent.type(vanillaInput, '2');
		//remove scoop
		userEvent.click(mandmsCheckbox);
		userEvent.type(vanillaInput, '1');

		expect(grandTotal).toHaveTextContent('4.00');
	});
});
