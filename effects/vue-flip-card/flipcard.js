import { createApp, h } from 'vue';

const App = {
  template: `
  <div class="flip-card" tabindex="0">
    <div class="flip-inner">
      <div class="flip-front">Front</div>
      <div class="flip-back">Back</div>
    </div>
  </div>`
};

createApp(App).mount('#flip-root');

export default App;
