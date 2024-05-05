(() => {

    const setAutoTheme = () => {
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-bs-theme', (isDarkMode ? 'dark' : 'light'))
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        setAutoTheme()
    })

    window.addEventListener('DOMContentLoaded', () => {
        setAutoTheme()
    })

})()