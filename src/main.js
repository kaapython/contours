import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/fluent-light/theme.css';
const app = createApp(App);
app
    .component('RadioButton', RadioButton)
    .component('Checkbox', Checkbox)
    .component('Button', Button)
    .component('Dialog', Dialog)
    .use(PrimeVue)
    .mount('#map');
//# sourceMappingURL=main.js.map