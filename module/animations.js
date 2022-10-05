let scrollingText;
Hooks.once('ready', () => (scrollingText = canvas.interface.getChildAt(10)));
export const animations = {
    standard: undefined,
    oldrpg: async function (origin, content) {
        const negative = content[0] === '-';
        content = content.slice(1);
        const anchor = 1, distance = undefined, direction = CONST.TEXT_ANCHOR_POINTS.TOP, duration = 2000, jitter = 0, textStyle = {
            stroke: 0x000000,
            strokeThickness: 5,
            fill: negative ? 0xffffff : 0x95ed98,
            dropShadowColor: 0x0,
            dropShadowAlpha: 1,
            fontStyle: 'bold',
            font: 'Verdana',
            fontSize: 'medium',
        };
        const style = PreciseText.getTextStyle({ anchor, ...textStyle });
        const text = scrollingText.addChild(new PreciseText(content, style));
        text.visible = false;
        const jx = (jitter ? (Math.random() - 0.5) * jitter : 0) * text.width;
        const jy = (jitter ? (Math.random() - 0.5) * jitter : 0) * text.height;
        text.position.set(origin.x + jx, origin.y + jy);
        text.anchor.set(...{
            [CONST.TEXT_ANCHOR_POINTS.CENTER]: [0.5, 0.5],
            [CONST.TEXT_ANCHOR_POINTS.BOTTOM]: [0.5, 0],
            [CONST.TEXT_ANCHOR_POINTS.TOP]: [0.5, 1],
            [CONST.TEXT_ANCHOR_POINTS.LEFT]: [1, 0.5],
            [CONST.TEXT_ANCHOR_POINTS.RIGHT]: [0, 0.5],
        }[anchor ?? CONST.TEXT_ANCHOR_POINTS.CENTER]);
        let dx = 0;
        let dy = 0;
        switch (direction ?? CONST.TEXT_ANCHOR_POINTS.TOP) {
            case CONST.TEXT_ANCHOR_POINTS.BOTTOM:
                dy = distance ?? 2 * text.height;
                break;
            case CONST.TEXT_ANCHOR_POINTS.TOP:
                dy = -1 * (distance ?? 2 * text.height);
                break;
            case CONST.TEXT_ANCHOR_POINTS.LEFT:
                dx = -1 * (distance ?? 2 * text.width);
                break;
            case CONST.TEXT_ANCHOR_POINTS.RIGHT:
                dx = distance ?? 2 * text.width;
                break;
        }
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
        await CanvasAnimation.animate([{ parent: text, attribute: 'y', to: text.position.y + -30 }], {
            context: this,
            duration: duration * 0.05,
            easing: undefined,
            ontick: () => (text.visible = true),
        });
        await CanvasAnimation.animate([{ parent: text, attribute: 'y', to: text.position.y + 30 }], {
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
