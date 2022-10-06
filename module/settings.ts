import { updateScrollingAnimation } from './animations.js';
import CustomFilePicker from '../libs/CustomFilePìcker.js';
import { getCustomMap } from './conditions.js';

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
	game.settings.register(MODULE, 'font-size', {
		name: 'Font Size',
		hint: 'Sets the font size for a standard 100 px grid.',
		scope: 'world',
		config: true,
		type: Number,
		//@ts-ignore
		range: {
			min: 12,
			max: 48,
			step: 1,
		},
		default: 28,
	});
	game.settings.register(MODULE, 'condition-map', {
		name: 'Condition Color Map',
		hint: 'Chooses a map for condition coloring.',
		scope: 'world',
		config: true,
		type: String,
		//@ts-ignore
		choices: {
			none: 'None',
			dnd5e: 'DnD 5e',
			custom: 'Custom',
		},
		default: 'none',
	});
	game.settings.register(MODULE, 'condition-custom-map', {
		name: 'Custom Condition Map',
		scope: 'world',
		config: true,
		type: CustomFilePicker.FilePicker,
		default: '',
		onChange: (value) => getCustomMap(value),
	});
}
