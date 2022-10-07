import { setDisplay, updateScrollingAnimation } from './animations.js';
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
        range: {
            min: 12,
            max: 48,
            step: 1,
        },
        default: 28,
    });
    game.settings.register(MODULE, 'minimum-size-hp-linear', {
        name: 'Font Size - Max HP Linear (minimum)',
        hint: 'The % of maximum HP wich the font size will start enlarging.',
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 100,
            step: 1,
        },
        default: 20,
    });
    game.settings.register(MODULE, 'maximum-size-hp-linear', {
        name: 'Font Size - Max HP Linear (maximum)',
        hint: 'The % of maximum HP wich the font will double in size.',
        scope: 'world',
        config: true,
        type: Number,
        range: {
            min: 0,
            max: 100,
            step: 1,
        },
        default: 40,
    });
    game.settings.register(MODULE, 'condition-map', {
        name: 'Condition Color Map',
        hint: 'Chooses a map for condition coloring.',
        scope: 'world',
        config: true,
        type: String,
        choices: {
            none: 'None',
            dnd5e: 'DnD 5e',
            pf2e: 'Pathfinder 2e',
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
    game.settings.register(MODULE, 'text-display', {
        config: false,
        type: Boolean,
        default: true,
        onChange: (value) => setDisplay(value),
    });
}
