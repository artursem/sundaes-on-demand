import {
	render,
	screen,
	waitFor,
} from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { server } from '../../../mocks/server';
import OrderEntry from '../OrderEntry';

test('handles errors for scoops and toppings routes', async () => {
	server.resetHandlers(
		rest.get('http://localhost:3030/scoops', (res, req, ctx) =>
			res(ctx.status(500))
		),
		rest.get('http://localhost:3030/toppings', (res, req, ctx) =>
			res(ctx.status(500))
		)
	);
	render(<OrderEntry setOrderPhase={jest.fn()} />);

	await waitFor(async () => {
		const alerts = await screen.findAllByRole('alert');
		expect(alerts).toHaveLength(2);
	});
});

test('order button is disabled when no scoops selected', async () => {
	render(<OrderEntry setOrderPhase={jest.fn()} />);
	const orderButton = screen.getByRole('button', { name: 'Order Sundae!' });
	// scoop = 0
	const chocScoop = await screen.findByRole('spinbutton', {
		name: 'Chocolate',
	});

	expect(orderButton).toBeDisabled();

	userEvent.clear(chocScoop);
	userEvent.type(chocScoop, '1');
	expect(orderButton).toBeEnabled();

	userEvent.clear(chocScoop);
	userEvent.type(chocScoop, '0');
	expect(orderButton).toBeDisabled();
});
