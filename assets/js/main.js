document.addEventListener("DOMContentLoaded", () => {
    const uiLayer = document.getElementById("uiLayer");
    window.initUiParallax(uiLayer);
    window.initMouseSparkEffect({
        color: "74,169,255",
        scale: 1.5,
        opacity: 1.0,
        speed: 1.0,
    });
});
