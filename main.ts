import { animations, updateScrollingAnimation } from './module/animations.js';
import { getCustomMap } from './module/conditions.js';
import { MODULE, registerSettings } from './module/settings.js';

Hooks.once('ready', () => {
	registerSettings();
	getCustomMap(game.settings.get(MODULE, 'condition-custom-map') as any);
	animations.standard = canvas.interface!.createScrollingText;
	updateScrollingAnimation(game.settings.get(MODULE, 'scrolling-type') as keyof typeof animations);
});
