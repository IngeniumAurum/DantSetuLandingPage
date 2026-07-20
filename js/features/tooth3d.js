// Builds the holographic 3D tooth in the statement section: clones the
// single authored SVG outline into a stack of depth layers (translateZ)
// inside the preserve-3d spinner. Without JS the markup shows one flat
// outline, which still reads fine.

const LAYERS = 12;
const GAP_PX = 2.6;

export function init() {
  const spinner = document.getElementById("tooth3d");
  const base = spinner?.querySelector("svg");
  if (!base) return;

  // Center the stack around z=0 so the spin axis passes through its middle.
  const offset = ((LAYERS - 1) * GAP_PX) / 2;
  base.style.transform = `translateZ(${offset}px)`;

  for (let i = 1; i < LAYERS; i++) {
    const layer = base.cloneNode(true);
    layer.style.transform = `translateZ(${(offset - i * GAP_PX).toFixed(1)}px)`;
    layer.style.opacity = Math.max(0.1, 1 - i * 0.085).toFixed(2);
    layer.style.filter = "none";
    spinner.appendChild(layer);
  }
}
