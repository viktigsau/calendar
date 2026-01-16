/*
Copyright (C) 2026 viktig_sau
Project: https://github.com/viktigsau/calendar

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
*/

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

function rgbToHex(r, g, b) {
    if (typeof r === "string") {
        const rgb = r.match(/\d+/g).map(Number);
        [r, g, b] = rgb;
    }
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}

function GetColor() {
    const colors = [
        "#ff0000",
        "#ffff00", "#bb7700", 
        "#00ff00", "#008800",
        "#00ffff", "#008888",
        "#0000ff", "#000088",
        "#ff00ff", "#6600aa",
    ];
    return colors[Math.floor(Math.random() * colors.length)]
}