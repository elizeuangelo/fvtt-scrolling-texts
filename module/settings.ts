import { updateScrollingAnimation } from './animations.js';

export const MODULE = 'scrolling-texts';

export function registerSettings() {
	game.settings.register(MODULE, 'scrolling-type', {
		name: 'Scrolling Type',
		hint: 'Choose the scrolling animation for token text.',
		scope: 'world',
		config: true,
		type: String,
		//@ts-ignore
		choices: {
			standard: 'Standard',
			oldrpg: 'Old RPG',
		},
		default: 'standard',
		onChange: updateScrollingAnimation,
	});
}
