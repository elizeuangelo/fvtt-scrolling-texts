import { MODULE } from './settings.js';

export function registerKeybindings() {
	game.keybindings.register(MODULE, 'displayText', {
		name: 'Toogle Scrolling Text Display',
		hint: 'In case you want to stop scrolling text from displaying, briefly. 😈',
		onDown: () => {
			const value = !game.settings.get(MODULE, 'text-display');
			game.settings.set(MODULE, 'text-display', value);
			if (value) ui.notifications.notify(`Scrolling text is now active.`);
			else ui.notifications.notify(`Scrolling text is deactivated.`);
		},
		restricted: true, // Restrict this Keybinding to gamemaster only?
		precedence: CONST.KEYBINDING_PRECEDENCE.NORMAL,
	});
}
