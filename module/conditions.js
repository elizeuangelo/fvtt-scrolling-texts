import { MODULE } from './settings.js';
import CustomFilePicker from '../libs/CustomFilePìcker.js';
const conditionMaps = {
    none: {},
    dnd5e: await (await fetch('/modules/' + MODULE + '/condition-mappings/dnd5e.json')).json(),
    pf2e: await (await fetch('/modules/' + MODULE + '/condition-mappings/pf2e.json')).json(),
    custom: {},
};
export async function getCustomMap(target) {
    const parse = CustomFilePicker.parse(target).current;
    if (!parse)
        return;
    const map = await (await fetch(parse)).json();
    return (conditionMaps.custom = map);
}
export function getMap() {
    const map = game.settings.get(MODULE, 'condition-map');
    return conditionMaps[map];
}
