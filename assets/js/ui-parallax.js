(function () {
    /**
     * Bind pointer-driven 3D tilt behavior to the given UI layer.
     * @param {HTMLElement | null} uiLayer
     */
    function initUiParallax(uiLayer) {
        if (!uiLayer) {
            return;
        }

        document.addEventListener("mousemove", (event) => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const offsetX = (event.clientX / width - 0.5) * 2;
            const offsetY = (event.clientY / height - 0.5) * 2;

            const maxRotateY = 4;
            const maxRotateX = 2;
            const rotateX = -(offsetY * maxRotateX);
            const rotateY = offsetX * maxRotateY;

            uiLayer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        document.addEventListener("mouseleave", () => {
            uiLayer.style.transform = "rotateX(0deg) rotateY(0deg)";
        });
    }

    window.initUiParallax = initUiParallax;
})();
