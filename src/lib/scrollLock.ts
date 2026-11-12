import { ScrollSmoother } from 'gsap/ScrollSmoother'

// Trava/destrava a rolagem da página (modais). Com ScrollSmoother basta
// pausá-lo; em dispositivos de toque ele não é criado (rolagem nativa), então
// a trava vai direto no body.
export function setPageScrollLocked(locked: boolean) {
  const smoother = ScrollSmoother.get()
  if (smoother) {
    smoother.paused(locked)
    return
  }
  document.body.style.overflow = locked ? 'hidden' : ''
}
