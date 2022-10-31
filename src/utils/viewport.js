// Use center-center distance check for non-rotated rects.
export function hasOverlap(r1, r2) {
    let w1 = r1.width,
        h1 = r1.height;
    let w2 = r2.width,
        h2 = r2.height;

    let diff = { x: Math.abs(r1.x + w1 / 2 - (r2.x + w2 / 2)), y: Math.abs(r1.y + h1 / 2 - (r2.y + h2 / 2)) };

    let compWidth = (r1.width + r2.width) / 2,
        compHeight = (r1.height + r2.height) / 2;

    let hasOverlap = diff.x <= compWidth && diff.y <= compHeight;
    return hasOverlap;
}

export function viewportRectangle(stage) {
    const { x, y, scale, width, height } = stage;

    return {
        x: -x / scale,
        y: -y / scale,
        width: width / scale,
        height: height / scale,
    };
}
