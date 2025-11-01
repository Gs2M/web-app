import { sidebarConfig, sidebarAdvConfig, accessCountConfig } from "./sidebar-config.js";
function onSidebarLoaded(callback, id = "sidebar-content") {
  // If already exists → trigger immediately
  const existing = document.getElementById(id);
  if (existing) {
    callback(existing);
    return;
  }

  // Otherwise, watch for it to appear
  const observer = new MutationObserver(() => {
    const el = document.getElementById(id);
    if (el) {
      callback(el);
      observer.disconnect(); // stop watching after found
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

onSidebarLoaded(function () {
  const sidebarContainer = document.getElementById("sidebar-content");
  sidebarContainer.innerHTML += sidebarConfig.map(item => `
    <a href="#" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
      <span>${item.title}</span>
    </a>
    <ul class="collapse show list-group list-group-flush">
      ${item.items.map(link => `
        <li class="list-group-item py-1">
          <a href="${link.url}" class="text-reset small-text">${link.text}</a>
        </li>
      `).join('')}
    </ul>
  `).join('');
  });

onSidebarLoaded(function () {
  const sidebarContainer = document.getElementById("sidebar-adv");
  sidebarContainer.innerHTML += sidebarAdvConfig.map(item => `
    <a href="#" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
      <span>${item.title}</span>
    </a>
      ${item.items.map(link => `
        <img src="${link.url}" class="img-fluid my-2" alt="${link.text}">
      `).join('')}
  `).join('');
  }, "sidebar-adv");

onSidebarLoaded(function () {
  const sidebarContainer = document.getElementById("sidebar-access");
  sidebarContainer.innerHTML += accessCountConfig.map(item => `
    <a href="#" class="list-group-item list-group-item-action py-2 ripple" aria-current="true">
      <span>${item.title}</span>
    </a>
    <div class="access-count">
        <img src="/pub/images/0.png" alt="0">
        <img src="/pub/images/0.png" alt="0">
        <img src="/pub/images/7.png" alt="7">
        <img src="/pub/images/8.png" alt="8">
        <img src="/pub/images/0.png" alt="0">
        <img src="/pub/images/0.png" alt="0">
        <img src="/pub/images/3.png" alt="3">
        <img src="/pub/images/3.png" alt="3">
    </div>
    <ul class="collapse show list-group list-group-flush">
      ${item.items.map(link => `
        <li class="list-group-item py-1 tiny-text">
            <div class="link-row">
                <img src="${link.icon}">
                <p>${link.text}</p>
                
                <p>${link.value}</p>
            </div>
        </li>
      `).join('')}
    </ul>
  `).join('');
  }, "sidebar-access");
