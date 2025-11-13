(function loadComponents() {
    const baseUrl = window.location.origin + "/";
    // Define component list using absolute URLs
    const components = [
        { id: "header", path: baseUrl + "components/header.html" },
        { id: "footer", path: baseUrl + "components/footer.html" },
        { id: "menu", path: baseUrl + "components/sidebar.html" },
    ];

    function insertHTML(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    function loadWithFetch({ id, path }) {
        fetch(path)
        .then(resp => {
            if (!resp.ok) throw new Error(`Failed to load ${path}`);
            return resp.text();
        })
        .then(html => insertHTML(id, html))
        .then(() => {
            // If header was just loaded, call its initializer module
            if (id === 'header') {
                // dynamic import from the served path
                import('/js/header-init.js')
                    .then(mod => {
                        if (mod && typeof mod.initHeader === 'function') {
                            mod.initHeader();
                        }
                    })
                    .catch(err => console.error('Failed to init header:', err));
            }
        })
        .catch(err => console.error(`Error loading ${path}:`, err));
    }

    if (window.jQuery) {
        $(function () {
        components.forEach(c => {
            const el = $("#" + c.id);
            if (el.length) el.load(c.path);
        });
        });
    } else {
        document.addEventListener("DOMContentLoaded", function () {
        components.forEach(loadWithFetch);
        });
    }
})();

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    const header = sidebar.querySelector('.menu-header');
    // Expand sidebar on hover
    sidebar.addEventListener('mouseenter', () => {
      sidebar.classList.add('expanded');
    });

    sidebar.addEventListener('mouseleave', () => {
      sidebar.classList.remove('expanded');
    });
    // Optional: toggle by clicking the header
    header.addEventListener('click', () => {
      sidebar.classList.toggle('expanded');
    });
  });

