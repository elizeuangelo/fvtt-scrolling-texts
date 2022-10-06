import { getMap } from './conditions.js';
import { MODULE } from './settings.js';
import { getActorAttribute } from './utils.js';

let scrollingText: any;
Hooks.once('ready', () => (scrollingText = canvas.interface!.getChildAt(10)));

export const animations = {
	standard: undefined,
	oldrpg: async function (this: InterfaceCanvasGroup, origin, content) {
		const isNumber = !Number.isNaN(+content);
		const negative = content[0] === '-';
		content = content.slice(1);

		const token = canvas!.tokens!.objects!.children.find((t: any) => t.center.x === origin.x && t.center.y === origin.y) as any;
		const hpMult = Math.clamped(isNumber ? +content / (getActorAttribute(token.actor, 'hpmax') / 5) : 1, 1, 2);

		const fontSize = (game.settings.get(MODULE, 'font-size') as number) * (canvas.scene!.grid.size / 100) * hpMult;

		const duration = 2000,
			textStyle = {
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
			const regex = /\((.+)\)/;
			const match = regex.exec(content)?.[1];
			content = match;
			const colors = map[match?.toLowerCase()];
			//@ts-ignore
			if (colors) textStyle.fill = +Color.fromString(colors[+negative] ?? colors[0]);
		}

		// Create text object
		const style = PreciseText.getTextStyle({ ...textStyle });
		const text = scrollingText.addChild(new PreciseText(content, style));
		text.visible = false;

		// Configure anchor point
		text.anchor.set(0.5, 0.5);

		// Set initial coordinates
		text.position.set(origin.x, origin.y - 10);

		// Position Text
		await CanvasAnimation.animate(
			[
				{ parent: text, attribute: 'alpha', from: 0, to: 1.0 },
				{ parent: text.scale, attribute: 'x', from: 0.6, to: 1.0 },
				{ parent: text.scale, attribute: 'y', from: 0.6, to: 1.0 },
				{ parent: text, attribute: 'y', from: text.position.y + 10, to: text.position.y + 10 },
			],
			{
				context: this,
				duration: duration * 0.05,
				easing: undefined,
				ontick: () => (text.visible = true),
			}
		);

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

		await CanvasAnimation.animate(
			[
				{ parent: text, attribute: 'alpha', to: 0.99 },
				{ parent: text, attribute: 'y', to: text.position.y },
			],
			{
				context: this,
				duration: duration * 0.75,
				easing: undefined,
				ontick: () => (text.visible = true),
			}
		);

		await CanvasAnimation.animate(
			[
				{ parent: text, attribute: 'alpha', to: 0.0 },
				//{ parent: text.scale, attribute: 'x', from: 1.0, to: 0 },
				//{ parent: text.scale, attribute: 'y', from: 1.0, to: 0 },
			],
			{
				context: this,
				duration: duration * 0.1,
				easing: undefined,
				ontick: () => (text.visible = true),
			}
		);

		// Clean-up
		scrollingText.removeChild(text);
		text.destroy();
	},
};

export function updateScrollingAnimation(value: keyof typeof animations) {
	canvas.interface!.createScrollingText = animations[value];
}
