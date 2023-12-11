import { get } from 'svelte/store';

const gap = 10;

/**
 * Creates a tooltip for an HTML element.
 * @param {HTMLElement} node - The HTML element to attach the tooltip to.
 * @param {object} options - Tooltip options.
 * @param {import('svelte/store').Writable<string>} options.tooltipText - Writable store containing tooltip text.
 * @param {'top' | 'bottom' | 'left' | 'right'} [options.position='top'] - Position of the tooltip.
 * @returns {{ destroy: () => void }} An object with a destroy method to clean up the tooltip.
 */
export function tooltip(node, { tooltipText, position = 'top' }) {
	if (tooltipText === undefined) return;
	let tooltipElem;

	function updateTooltip() {
		if (tooltipElem) {
			tooltipElem.textContent = get(tooltipText) ?? null;
			updatePosition();
		}
	}
	let unsubscribe = tooltipText.subscribe(updateTooltip);

	function updatePosition() {
		const { top, left, width, height } = node.getBoundingClientRect();
		const elmRect = tooltipElem.getBoundingClientRect();
		let x, y;
		switch (position) {
			case 'top':
				y = top - elmRect.height - gap;
				x = left + width / 2 - elmRect.width / 2;
				break;
			case 'bottom':
				y = top + height + gap;
				x = left + width / 2 - elmRect.width / 2;
				break;
			case 'left':
				y = top + height / 2 - elmRect.height / 2;
				x = left - elmRect.width - gap;
				break;
			case 'right':
				y = top + height / 2 - elmRect.height / 2;
				x = left + width + gap;
				break;
		}

		if (x + elmRect.width > document.body.offsetWidth - gap)
			x = document.body.offsetWidth - gap - elmRect.width;
		else if (x < gap) x = gap;
		if (y + elmRect.height > document.body.offsetHeight - gap)
			y = document.body.offsetHeight - gap - elmRect.height;
		else if (y < gap) y = gap;

		tooltipElem.style.top = `${y}px`;
		tooltipElem.style.left = `${x}px`;
	}

	function mouseenter() {
		tooltipElem = document.createElement('div');
		tooltipElem.setAttribute('aria-live', 'polite');
		tooltipElem.setAttribute('aria-atomic', 'true');
		tooltipElem.className =
			'fixed bg-gray-800 shadow-sm text-xs font-medium text-white px-2 py-1 rounded text-white z-10';
		tooltipElem.textContent = get(tooltipText) ?? null;
		document.body.appendChild(tooltipElem);
		updatePosition();
	}

	function mouseleave() {
		if (tooltipElem) document.body.removeChild(tooltipElem);
	}

	node.addEventListener('mouseenter', mouseenter);
	node.addEventListener('mouseleave', mouseleave);

	return {
		destroy() {
			node.removeEventListener('mouseover', mouseenter);
			node.removeEventListener('mouseout', mouseleave);
			if (tooltipElem) {
				document.body.removeChild(tooltipElem);
			}
			unsubscribe();
		}
	};
}
