import { getMap } from './conditions.js';
import { MODULE } from './settings.js';
import { getActorAttribute } from './utils.js';
let scrollingText;
Hooks.once('ready', () => (scrollingText = canvas.interface.getChildAt(10)));
export const animations = {
    none: () => { },
    standard: undefined,
    oldrpg: async function (origin, content) {
        const isNumber = !Number.isNaN(+content);
        const negative = content[0] === '-';
        if (content[0] === '-')
            content = content.slice(1);
        else if (content[0] === '+')
            content = content.slice(1);
        const token = canvas.tokens.objects.children.find((t) => t.center.x === origin.x && t.center.y === origin.y);
        const hpmax = getActorAttribute(token.actor, 'hpmax');
        let hpMult = 1;
        if (hpmax && isNumber) {
            const hp_min = (+game.settings.get(MODULE, 'minimum-size-hp-linear') * hpmax) / 100;
            const hp_max = (+game.settings.get(MODULE, 'maximum-size-hp-linear') * hpmax) / 100;
            const range = hp_max - hp_min;
            hpMult += Math.clamped((+content - hp_min) / range, 0, 1);
        }
        const fontSize = game.settings.get(MODULE, 'font-size') * (canvas.scene.grid.size / 100) * hpMult;
        const duration = 2000, textStyle = {
            stroke: 0x000000,
            strokeThickness: 5,
            fill: negative ? 0xffffff : 0x95ed98,
            dropShadowColor: 0,
            dropShadowAlpha: 1,
            fontWeight: 'bold',
            fontFamily: 'Verdana',
            fontSize,
        };
        if (!isNumber) {
            const map = getMap();
            const regex = /^[ \(\+\-]{0,2}(([a-z- ]+)[0-9]*)/i;
            const match = regex.exec(content);
            if (match) {
                content = (negative ? '-' : '') + match[1];
                if (match[2][match[2].length - 1] === ' ')
                    match[2] = match[2].slice(0, match[2].length - 1);
                const colors = map[match[2]?.toLowerCase()];
                if (colors) {
                    if (colors[+negative] === null)
                        return;
                    textStyle.fill = +Color.fromString(colors[+negative] ?? colors[0]);
                    if (colors[2] && !negative)
                        await new Audio(colors[2]).play();
                    if (colors[3] && negative)
                        await new Audio(colors[3]).play();
                }
            }
        }
        const style = PreciseText.getTextStyle({ ...textStyle });
        const text = scrollingText.addChild(new PreciseText(content, style));
        text.visible = false;
        text.anchor.set(0.5, 0.5);
        text.position.set(origin.x, origin.y - 10);
        await CanvasAnimation.animate([
            { parent: text, attribute: 'alpha', from: 0, to: 1.0 },
            { parent: text.scale, attribute: 'x', from: 0.6, to: 1.0 },
            { parent: text.scale, attribute: 'y', from: 0.6, to: 1.0 },
            { parent: text, attribute: 'y', from: text.position.y + 10, to: text.position.y + 10 },
        ], {
            context: this,
            duration: duration * 0.05,
            easing: undefined,
            ontick: () => (text.visible = true),
        });
        await CanvasAnimation.animate([{ parent: text, attribute: 'y', to: text.position.y - fontSize }], {
            context: this,
            duration: duration * 0.05,
            easing: undefined,
            ontick: () => (text.visible = true),
        });
        await CanvasAnimation.animate([{ parent: text, attribute: 'y', to: text.position.y + fontSize }], {
            context: this,
            duration: duration * 0.05,
            easing: undefined,
            ontick: () => (text.visible = true),
        });
        await CanvasAnimation.animate([
            { parent: text, attribute: 'alpha', to: 0.99 },
            { parent: text, attribute: 'y', to: text.position.y },
        ], {
            context: this,
            duration: duration * 0.75,
            easing: undefined,
            ontick: () => (text.visible = true),
        });
        await CanvasAnimation.animate([
            { parent: text, attribute: 'alpha', to: 0.0 },
        ], {
            context: this,
            duration: duration * 0.1,
            easing: undefined,
            ontick: () => (text.visible = true),
        });
        scrollingText.removeChild(text);
        text.destroy();
    },
};
export function updateScrollingAnimation(value) {
    canvas.interface.createScrollingText = animations[value];
}
export function setDisplay(config) {
    if (!config)
        updateScrollingAnimation('none');
    else
        updateScrollingAnimation(game.settings.get(MODULE, 'scrolling-type'));
}
