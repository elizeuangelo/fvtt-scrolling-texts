import { getMap } from './conditions.js';
import { MODULE } from './settings.js';
import { getActorAttribute } from './utils.js';

let scrollingText: any;
Hooks.once('ready', () => (scrollingText = canvas.interface!.getChildAt(10)));

export const animations = {
	none: () => {},
	standard: undefined,
	oldrpg: async function (this: InterfaceCanvasGroup, origin, content) {
		const isNumber = !Number.isNaN(+content);
		const negative = content[0] === '-';
		content = content.slice(1);

		const token = canvas!.tokens!.objects!.children.find((t: any) => t.center.x === origin.x && t.center.y === origin.y) as any;
		const hpmax = getActorAttribute(token.actor, 'hpmax') as number | undefined;
		let hpMult = 1;
		if (hpmax) hpMult = Math.clamped(isNumber ? (5 * +content) / hpmax : 1, 1, 2);

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
			const regex = / ?([a-z- ]+)/i;
			let match = regex.exec(content)?.[1];
			if (match![match!.length - 1] === ' ') match = match!.slice(0, match!.length - 1);
			content = match;
			const colors = map[match?.toLowerCase()];

			if (colors) {
				if (colors[+negative] === null) return;
				//@ts-ignore
				textStyle.fill = +Color.fromString(colors[+negative] ?? colors[0]);

				// Sound FXs
				if (colors[2] && !negative) await new Audio(colors[2]).play();
				if (colors[3] && negative) await new Audio(colors[3]).play();
			}
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

export function setDisplay(config: Boolean) {
	if (!config) updateScrollingAnimation('none');
	else updateScrollingAnimation(game.settings.get(MODULE, 'scrolling-type') as any);
}
