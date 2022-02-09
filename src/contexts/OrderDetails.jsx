import { useEffect } from 'react';
import { createContext, useContext, useState, useMemo } from 'react';
import { pricePerItem } from '../constants/index';
import { formatCurrency } from '../utilities';

const OrderDetails = createContext();

export function useOrderDetails() {
	const context = useContext(OrderDetails);

	if (!context) {
		throw new Error('useOrderDetails must be use within OrderDetailsProvider');
	}

	return context;
}

function calculateSubtotal(optionType, optionCounts) {
	let optionCount = 0;
	for (const count of optionCounts[optionType].values()) {
		optionCount += count;
	}
	return optionCount * pricePerItem[optionType];
}

export function OrderDetailsProvider(props) {
	const [optionCounts, setOptionCounts] = useState({
		scoops: new Map(),
		toppings: new Map(),
	});

	const zeroCurrency = formatCurrency(0);
	const [totals, setTotals] = useState({
		scoops: zeroCurrency,
		toppings: zeroCurrency,
		grandTotal: zeroCurrency,
	});

	useEffect(() => {
		const scoopsSubtotal = calculateSubtotal('scoops', optionCounts);
		const toppingsSubtotal = calculateSubtotal('toppings', optionCounts);
		const grandTotal = scoopsSubtotal + toppingsSubtotal;
		setTotals({
			scoops: formatCurrency(scoopsSubtotal),
			toppings: formatCurrency(toppingsSubtotal),
			grandTotal: formatCurrency(grandTotal),
		});
	}, [optionCounts]);

	const value = useMemo(() => {
		function updateItemCount(itemName, newItemCount, optionType) {
			const newOptionCounts = { ...optionCounts };

			const optionCountsMap = optionCounts[optionType];
			optionCountsMap.set(itemName, parseInt(newItemCount));

			setOptionCounts(newOptionCounts);
		}
		// getter: option counts, scoops and totals
		// setter: update option counts

		return [{ ...optionCounts, totals }, updateItemCount];
	}, [optionCounts, totals]);

	return <OrderDetails.Provider value={value} {...props} />;
}
