import HelpDesk from './HelpDesk';
import TicketService from './TicketService';

const root = document.getElementById('root');

const ticketService = new TicketService('http://localhost:7070');
const app = new HelpDesk(root, ticketService);

app.init();
