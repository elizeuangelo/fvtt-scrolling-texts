const dnd5e = {
    hp: 'system.attributes.hp.value',
    hpmax: 'system.attributes.hp.max',
};
const systems = {
    dnd5e,
};
export function getActorAttribute(actor, name) {
    return getProperty(actor, systems[game.system.id][name]);
}
