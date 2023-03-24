import './app.css'
import App from './App.svelte'
import "./scripts/global"

const app = new App({
  target: document.getElementById('app')
})

export default app
