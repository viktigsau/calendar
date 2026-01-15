function GetCalendar() {
    const events = {};
    const base = new Date("2025-01-12T00:00:00");

    for (let h = 0; h < 24; h++) {
        const start = new Date(base);
        start.setHours(h);

        const end = new Date(start);
        end.setHours(h + 1);

        // random color for each event
        events[`event${h + 1}`] = {
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
            start: start.toISOString(),
            end: end.toISOString(),
            title: `Event ${h + 1}`,
            description: `Event at ${String(h).padStart(2, "0")}:00`
        };
    }

    return { events };
}


function LoadItems() {
    const data = GetCalendar();

    for (const [id, event] of Object.entries(data.events)) {
        const start = new Date(event.start);
        const end = new Date(event.end);

        const dayElem = document.querySelector(`.week-day[data-date="${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}"]`);
        if (!dayElem) {
            console.warn(`No day (${start.getFullYear()}-${start.getMonth()+1}-${start.getDate()}) element found for event:`, id, event);
            continue
        };

        const totalMinutes = 24 * 60;
        const startMinutes = start.getHours() * 60 + start.getMinutes();
        const endMinutes = end.getHours() * 60 + end.getMinutes();

        const timeLabel = document.querySelector(`.time-label[data-hour="${start.getHours()}"]`);
        if (!timeLabel) {
            console.warn(`No time label found for hour ${start.getHours()}`);
            continue;
        }
        
        const top = timeLabel.offsetTop + (start.getMinutes() / 60) * (timeLabel.offsetHeight);
        const height = ((endMinutes - startMinutes) / totalMinutes) * dayElem.clientHeight;

        const eventElem = document.createElement("div");
        eventElem.id = `event-${id}`;
        eventElem.classList.add("item", "event");
        eventElem.dataset.id = id;
        eventElem.title = event.title + "\n" + event.description;
        eventElem.style.backgroundColor = event.color;
        eventElem.style.top = `${top}px`;
        eventElem.style.height = `${height - 5}px`;

        const label = document.createElement("span");
        label.classList.add("label");
        label.textContent = event.title;
        eventElem.appendChild(label);

        const timeStamp = document.createElement("span");
        timeStamp.classList.add("timestamp");
        timeStamp.textContent = `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")} - ${String(end.getHours()).padStart(2, "0")}:${String(end.getMinutes()).padStart(2, "0")}`;
        eventElem.appendChild(timeStamp);

        dayElem.appendChild(eventElem);
    }
}

function GetCalendars() {
    return [
        { id: "1", name: "Personal", color: "#ff0000", description: "My personal calendar", category: "my-calendars" },
        { id: "2", name: "Work", color: "#00ff00", description: "Work related events", category: "my-calendars" },
        { id: "3", name: "Holidays", color: "#0000ff", description: "Public holidays", category: "my-calendars" },
        { id: "4", name: "Team Events", color: "#ffff00", description: "Events for the team", category: "other-calendars" }
    ];
}

function LoadCalendars() {
    const calendars = GetCalendars();

    const calendarEditor = document.querySelector("#calendar-editor");
    const closeEditorBtn = calendarEditor.querySelector(".cancelBtn");
    closeEditorBtn.addEventListener("click", () => {
        calendarEditor.close();
    });

    const calendarView = document.querySelector("#calendar-view");
    const closeBtn = calendarView.querySelector(".closeBtn");
    closeBtn.addEventListener("click", () => {
        calendarView.close();
    });
    const editBtn = calendarView.querySelector(".editBtn");
    editBtn.addEventListener("click", () => {
        calendarEditor.querySelector("input[name='name']").value = calendarView.querySelector(".title").textContent;
        calendarEditor.querySelector("textarea[name='description']").value = calendarView.querySelector(".description").textContent;
        calendarEditor.querySelector("input[name='color']").value = rgbToHex(getComputedStyle(calendarView.querySelector(".color-indicator")).backgroundColor);
        calendarEditor.dataset.calenderID = calendarView.dataset.calenderID;
        calendarEditor.showModal();
        calendarView.close();
    });

    for (const calendar of calendars) {
        const calendarList = document.querySelector(`.calendar-list[data-category="${calendar.category}"]`);
        const calendarItem = document.createElement("div");
        calendarItem.classList.add("calendar-item");
        calendarItem.dataset.calenderID = calendar.id;

        const colorIndicator = document.createElement("span");
        colorIndicator.classList.add("color-indicator");
        colorIndicator.style.backgroundColor = calendar.color;
        calendarItem.appendChild(colorIndicator);

        const calendarName = document.createElement("span");
        calendarName.classList.add("calendar-name");
        calendarName.textContent = calendar.name;
        calendarItem.appendChild(calendarName);

        calendarItem.addEventListener("click", () => {
            calendarView.dataset.calenderID = calendar.id;
            calendarView.querySelectorAll(".title").forEach(title => title.textContent = calendar.name);
            calendarView.querySelectorAll(".description").forEach(description => description.textContent = calendar.description);
            calendarView.querySelectorAll(".category").forEach(category => category.textContent = calendar.category);
            calendarView.querySelectorAll(".color-indicator").forEach(indicator => indicator.style.backgroundColor = calendar.color);
            calendarView.showModal();
        });

        calendarList.appendChild(calendarItem);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".layout div.slider");

    enableDrag(slider, (dx, dy, e) => {
        let subBoxMargin = getComputedStyle(document.documentElement).getPropertyValue("--sub-box-margin");
        subBoxMargin = parseFloat(subBoxMargin);

        document.documentElement.style.setProperty("--sidebar-width", e.clientX - subBoxMargin + "px");
    });

    const main = document.querySelector("main");

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === "attributes") {

            }

            if (m.type === "childList" && m.addedNodes.length) {
                for (const node of m.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        
                    }
                }
            }
        }
    });

    observer.observe(main, {
        attributes: true,
        attributeFilter: ["data-top", "data-height"],
        childList: true,
        subtree: true
    });

    LoadCalendars();
    LoadItems();
});