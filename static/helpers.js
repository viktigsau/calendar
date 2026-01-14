function enableDrag(el, onMove) {
    let dragging = false;
    let startX, startY;

    el.addEventListener("pointerdown", e => {
        if (e.button !== 0) return;
        dragging = true;
        startX = e.clientX;
        startY = e.clientY;
        el.setPointerCapture(e.pointerId);
    });

    el.addEventListener("pointermove", e => {
        if (!dragging) return;
        onMove(e.clientX - startX, e.clientY - startY, e);
    });

    el.addEventListener("pointerup", e => {
        dragging = false;
        el.releasePointerCapture(e.pointerId);
    });

    el.addEventListener("pointercancel", () => {
        dragging = false;
    });
}