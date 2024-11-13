export function generateTruckIcon(isMoving: boolean, isSelected: boolean): string {
  const color = isSelected ? '#2563eb' : isMoving ? '#22c55e' : '#ef4444';
  
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 17h4V5H2v12h3m15-5h2v3h-2zM7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
      <path d="M15 17H9"/>
      <path d="M14 9h2.7l2.3 3v5"/>
    </svg>
  `.trim();

  return window.btoa(svgString);
}