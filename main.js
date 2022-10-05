import { animations, updateScrollingAnimation } from './module/animations.js';
import { MODULE, registerSettings } from './module/settings.js';
Hooks.once('ready', () => {
    registerSettings();
    animations.standard = canvas.interface.createScrollingText;
    updateScrollingAnimation(game.settings.get(MODULE, 'scrolling-type'));
});
