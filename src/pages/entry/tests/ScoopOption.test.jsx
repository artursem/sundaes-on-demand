import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoopOption from '../ScoopOption';

test('scoop input is validated', () => {
	render(
		<ScoopOption
			name='Vanilla'
			imagePath='/images/vanilla.png'
			updateItemCount={jest.fn()}
		/>
	);

	const vanillaScoop = screen.getByRole('spinbutton');

	userEvent.clear(vanillaScoop);
	userEvent.type(vanillaScoop, '2.5');
	expect(vanillaScoop).toHaveClass('is-invalid');

	userEvent.clear(vanillaScoop);
	userEvent.type(vanillaScoop, '-2');
	expect(vanillaScoop).toHaveClass('is-invalid');

	userEvent.clear(vanillaScoop);
	userEvent.type(vanillaScoop, '1');
	expect(vanillaScoop).not.toHaveClass('is-invalid');
});
