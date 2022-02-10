import { screen } from '@testing-library/react';
import { render } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';

test('displays image for each scoop from the server', async () => {
	render(<Options optionType='scoops' />);

	const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
	expect(scoopImages).toHaveLength(2);

	const altText = scoopImages.map((el) => el.alt);
	expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop']);
});

test('displays image for each topping from the server', async () => {
	render(<Options optionType='toppings' />);

	const toppingImages = await screen.findAllByRole('img', {
		name: /topping$/i,
	});
	expect(toppingImages).toHaveLength(3);

	const altText = toppingImages.map((el) => el.alt);
	expect(altText).toEqual([
		'Cherries topping',
		'M&Ms topping',
		'Hot fudge topping',
	]);
});

test('subtotal does not update when input in not valid', async () => {
	render(<Options optionType='scoops' />);
	const vanillaInput = await screen.findByRole('spinbutton', {
		name: 'Vanilla',
	});

	userEvent.clear(vanillaInput);
	userEvent.type(vanillaInput, '-1');
	const scopsSubtotal = screen.getByText('Scoops total: $0.00');
	expect(scopsSubtotal).toBeInTheDocument();
});
