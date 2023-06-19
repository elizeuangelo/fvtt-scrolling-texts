import { animations, setDisplay } from './module/animations.js';
import { getCustomMap } from './module/conditions.js';
import { registerKeybindings } from './module/keybindings.js';
import { MODULE, registerSettings } from './module/settings.js';
Hooks.once('setup', () => {
    registerSettings();
    registerKeybindings();
});
Hooks.once('ready', () => {
    getCustomMap(game.settings.get(MODULE, 'condition-custom-map'));
    animations.standard = canvas.interface.createScrollingText;
    if (game.user.isGM)
        game.settings.set(MODULE, 'text-display', true);
    setDisplay(game.settings.get(MODULE, 'text-display'));
});
