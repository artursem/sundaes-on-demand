import { Container } from 'react-bootstrap';
import OrderEntry from './pages/entry/OrderEntry';
import { OrderDetailsProvider } from './contexts/OrderDetails';

function App() {
	return (
		<Container>
			<OrderDetailsProvider>
				{/* Summary  Page */}
				<OrderEntry />
			</OrderDetailsProvider>
			{/* confirmation */}
		</Container>
	);
}

export default App;
