const BLOG_LIST = [
    { title: 'How does table statistics affect query performance?', date: '2026-03-02', url: 'table-analyze-ctas.html' },
    { title: 'RL for noobs', date: '2024-12-15', url: 'rl-for-noobs.html' }
];

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function initBlogSidebar() {
    const sidebar = document.getElementById('blog-sidebar');
    const toggle = document.getElementById('blog-toggle');
    if (!sidebar || !toggle) return;

    const sorted = [...BLOG_LIST].sort((a, b) => new Date(b.date) - new Date(a.date));
    sidebar.innerHTML = `
        <h3>All posts</h3>
        <ul>
            ${sorted.map(b => `
                <li><a href="${b.url}">${b.title}</a></li>
            `).join('')}
        </ul>
    `;

    const overlay = document.getElementById('blog-sidebar-overlay');
    const closeSidebar = () => {
        sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (overlay) overlay.classList.toggle('open', sidebar.classList.contains('open'));
        toggle.setAttribute('aria-expanded', sidebar.classList.contains('open'));
    });
    if (overlay) overlay.addEventListener('click', closeSidebar);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBlogSidebar);
} else {
    initBlogSidebar();
}
