document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".layout div.slider");

    enableDrag(slider, (dx, dy, e) => {
        let subBoxMargin = getComputedStyle(document.documentElement).getPropertyValue("--sub-box-margin");
        subBoxMargin = parseFloat(subBoxMargin);

        document.documentElement.style.setProperty("--sidebar-width", e.clientX - subBoxMargin + "px");
    })
});