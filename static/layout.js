/*
Copyright (C) 2026 viktig_sau
Project: https://github.com/viktigsau/calendar

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
*/

function GetCalendar() {
    const events = {};
    const base = new Date("2025-01-12T00:00:00");

    let index = 6;
    while (index < 24*7) {
        const h = index;
        const length = Math.floor(Math.random() * 4) + 1;
        index += length;
        if (index % 24 > 16) index += 10;
        index += Math.floor(Math.random() * 4) + 2;

        const start = new Date(base);
        start.setHours(h);

        const end = new Date(start);
        end.setHours(h + length);

        // random color for each event
        events[`event${h + 1}`] = {
            color: GetColor(),
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
        { id: "1", name: "Personal", color: GetColor(), description: "My personal calendar", category: "my-calendars" },
        { id: "2", name: "Work", color: GetColor(), description: "Work related events", category: "my-calendars" },
        { id: "3", name: "Holidays", color: GetColor(), description: "Public holidays", category: "my-calendars" },
        { id: "4", name: "Team Events", color: GetColor(), description: "Events for the team", category: "other-calendars" }
    ];
}

function LoadCalendars() {
    const calendars = GetCalendars();

    const calendarEditor = document.querySelector("#calendar-editor");
    const closeEditorBtn = calendarEditor.querySelector(".cancelBtn");
    closeEditorBtn.addEventListener("click", () => calendarEditor.close());

    const calendarView = document.querySelector("#calendar-view");
    const closeBtn = calendarView.querySelector(".closeBtn");
    closeBtn.addEventListener("click", () => calendarView.close());
    const editBtn = calendarView.querySelector(".editBtn");
    editBtn.addEventListener("click", () => {
        calendarEditor.querySelector("input[name='name']").value = calendarView.querySelector(".title").textContent;
        calendarEditor.querySelector("textarea[name='description']").value = calendarView.querySelector(".description").textContent;
        calendarEditor.querySelector("input[name='color']").value = rgbToHex(getComputedStyle(calendarView.querySelector(".color-indicator")).backgroundColor);
        calendarEditor.dataset.calenderID = calendarView.dataset.calenderID;
        calendarEditor.querySelector("input[name='id']").value = calendarView.dataset.calendarID;
        calendarEditor.showModal();
        calendarView.close();
    });

    const newCalendarItems = document.querySelectorAll(".new-calendar-item");
    const calendarCreator = document.querySelector("#calendar-creator");
    const closeCreatorBtn = calendarCreator.querySelector(".cancelBtn");
    closeCreatorBtn.addEventListener("click", () => calendarCreator.close());
    for (const newCalendarItem of newCalendarItems) {
        const category = newCalendarItem.parentNode.dataset.category;

        newCalendarItem.addEventListener("click", () => {
            calendarCreator.querySelector(`select[name='category']`).value = category;
            calendarCreator.showModal();
        });
    }

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

        const newCalendarBtn = calendarList.querySelector(".new-calendar-item");
        if (newCalendarBtn) calendarList.insertBefore(calendarItem, newCalendarBtn)
        else calendarList.appendChild(calendarItem);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const slider = document.querySelector(".layout div.slider");

    enableDrag(slider, (dx, dy, e) => {
        let subBoxMargin = getComputedStyle(document.documentElement).getPropertyValue("--sub-box-margin");
        subBoxMargin = parseFloat(subBoxMargin);

        let sidebarWidth = e.clientX - subBoxMargin;
        if (sidebarWidth < 175) sidebarWidth = 175;

        document.documentElement.style.setProperty("--sidebar-width", sidebarWidth + "px");
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