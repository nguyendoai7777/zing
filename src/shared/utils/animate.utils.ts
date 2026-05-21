import type { MouseEvent } from 'react';

export function onActivateEffect(params: MouseEvent<HTMLElement>, imgSrc: string) {
	const { currentTarget } = params;
	const rootParent = currentTarget.parentElement;
	const { x, y, top, height } = rootParent!.getBoundingClientRect();
	const notAtBottom = innerHeight - top - height - 90 > height * 1.5;
	const animateRoot = document.createElement('img');
	animateRoot.src = imgSrc;
	animateRoot.className = 'animate-root';
	animateRoot.style.top = y + 'px';
	animateRoot.style.left = x + 'px';
	document.body.appendChild(animateRoot);
	let ball = { x, y, speed: 0.01, t: 0, o: 1 };
	let points = [
		{ x: ball.x, y: ball.y },
		{ x: x * 2, y: 500 },
		{ x: ball.x * 2, y: 700 },
		{ x: innerWidth <= 700 ? innerWidth : innerWidth - 50 - 159, y: notAtBottom ? 70 : -70 },
	];
	const reDrawPosition = () => {
		animateRoot.style.left = ball.x + 'px';
		animateRoot.style.top = ball.y + 'px';
		animateRoot.style.opacity = ball.o + '';
	};
	const moveElement = () => {
		let [p0, p1, p2, p3] = points;
		let cx = p1.x - p0.x;
		let bx = p2.x - p1.x - cx;
		let ax = p3.x - p0.x - cx - bx;

		let cy = notAtBottom ? p1.y - p0.y : -(p1.y - p0.y);
		let by = notAtBottom ? p2.y - p1.y - cy : -(p2.y - p1.y) - cy;
		let ay = notAtBottom ? p3.y - p0.y - cy - by : -p3.y - p0.y - cy - by;
		let t = ball.t;

		ball.o -= ball.speed;
		if (ball.t >= 0.65) {
			ball.t += ball.speed + 0.0105;
		} else {
			ball.t += ball.speed;
		}
		let xt = ax * (t * t * t) + bx * t + cx * t + p0.x;
		let yt = ay * (t * t * t) + by * t + cy * t + p0.y;

		if (ball.o <= 0) {
			ball.o = 0;
		}
		if (ball.t > 1) {
			ball.t = 1;
		}

		ball.x = xt;
		ball.y = yt;
		reDrawPosition();
	};

	const animate = () => {
		requestAnimationFrame(animate);
		moveElement();
	};
	animate();
	const dl = setTimeout(() => {
		animateRoot.remove();
		clearTimeout(dl);
	}, 2000);
}
