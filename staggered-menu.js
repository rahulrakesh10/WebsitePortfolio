document.addEventListener("DOMContentLoaded", () => {
  const position = "right";
  const menuButtonColor = "#fff";
  const openMenuButtonColor = "#fff";
  const changeMenuColorOnOpen = true;
  const closeOnClickAway = true;

  const wrapper = document.querySelector(".staggered-menu-wrapper");
  if (!wrapper) return;

  const panel = wrapper.querySelector(".staggered-menu-panel");
  const preContainer = wrapper.querySelector(".sm-prelayers");
  const preLayers = Array.from(preContainer ? preContainer.querySelectorAll(".sm-prelayer") : []);
  const toggleBtn = wrapper.querySelector(".sm-toggle");
  
  const plusH = wrapper.querySelector(".sm-icon-line:not(.sm-icon-line-v)");
  const plusV = wrapper.querySelector(".sm-icon-line-v");
  const icon = wrapper.querySelector(".sm-icon");
  const textInner = wrapper.querySelector(".sm-toggle-textInner");
  const logoText = wrapper.querySelector(".sm-logo-text");

  let open = false;
  let openTl = null;
  let closeTween = null;
  let spinTween = null;
  let textCycleAnim = null;
  let colorTween = null;
  let itemEntranceTween = null;
  let busy = false;

  const offscreen = position === "left" ? -100 : 100;

  // Initial Setup
  gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
  if (preContainer) {
    gsap.set(preContainer, { xPercent: 0, opacity: 1 });
  }
  gsap.set(plusH, { transformOrigin: "50% 50%", rotate: 0 });
  gsap.set(plusV, { transformOrigin: "50% 50%", rotate: 90 });
  gsap.set(icon, { rotate: 0, transformOrigin: "50% 50%" });
  gsap.set(textInner, { yPercent: 0 });
  if (toggleBtn) gsap.set(toggleBtn, { color: menuButtonColor });

  function buildOpenTimeline() {
    if (openTl) openTl.kill();
    if (closeTween) {
      closeTween.kill();
      closeTween = null;
    }
    if (itemEntranceTween) itemEntranceTween.kill();

    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
    const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
    const socialTitle = panel.querySelector(".sm-socials-title");
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));

    const layerStates = preLayers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: "power4.out" }, i * 0.07);
    });
    
    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;
    
    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power4.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: "power4.out",
          stagger: { each: 0.1, from: "start" }
        },
        itemsStart
      );
      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: 0.6,
            ease: "power2.out",
            "--sm-num-opacity": 1,
            stagger: { each: 0.08, from: "start" }
          },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;
      if (socialTitle) {
        tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: "power2.out" }, socialsStart);
      }
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power3.out",
            stagger: { each: 0.08, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTl = tl;
    return tl;
  }

  function playOpen() {
    if (busy) return;
    busy = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback("onComplete", () => {
        busy = false;
      });
      tl.play(0);
    } else {
      busy = false;
    }
  }

  function playClose() {
    if (openTl) openTl.kill();
    openTl = null;
    if (itemEntranceTween) itemEntranceTween.kill();

    const all = [...preLayers, panel];
    if (closeTween) closeTween.kill();
    
    closeTween = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: "power3.in",
      overwrite: "auto",
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel"));
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
        const numberEls = Array.from(panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item"));
        if (numberEls.length) gsap.set(numberEls, { "--sm-num-opacity": 0 });
        const socialTitle = panel.querySelector(".sm-socials-title");
        const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link"));
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });
        busy = false;
      }
    });
  }

  function animateIcon(opening) {
    if (!icon) return;
    if (spinTween) spinTween.kill();
    if (opening) {
      spinTween = gsap.to(icon, { rotate: 225, duration: 0.8, ease: "power4.out", overwrite: "auto" });
    } else {
      spinTween = gsap.to(icon, { rotate: 0, duration: 0.35, ease: "power3.inOut", overwrite: "auto" });
    }
  }

  function animateColor(opening) {
    if (!toggleBtn) return;
    if (colorTween) colorTween.kill();
    if (changeMenuColorOnOpen) {
      const targetColor = opening ? openMenuButtonColor : menuButtonColor;
      colorTween = gsap.to(toggleBtn, {
        color: targetColor,
        delay: 0.18,
        duration: 0.3,
        ease: "power2.out"
      });
      if(logoText) {
         gsap.to(logoText, {
            color: targetColor,
            delay: 0.18,
            duration: 0.3,
            ease: "power2.out"
         });
      }
    } else {
      gsap.set(toggleBtn, { color: menuButtonColor });
    }
  }

  function animateText(opening) {
    if (!textInner) return;
    if (textCycleAnim) textCycleAnim.kill();

    const currentLabel = opening ? "Menu" : "Close";
    const targetLabel = opening ? "Close" : "Menu";
    const cycles = 3;
    const seq = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === "Menu" ? "Close" : "Menu";
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    // Update DOM text lines
    textInner.innerHTML = "";
    seq.forEach(l => {
      const span = document.createElement("span");
      span.className = "sm-toggle-line";
      span.innerText = l;
      textInner.appendChild(span);
    });

    gsap.set(textInner, { yPercent: 0 });
    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;
    
    textCycleAnim = gsap.to(textInner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: "power4.out"
    });
  }

  function toggleMenu() {
    open = !open;
    if (open) {
      wrapper.setAttribute("data-open", "true");
      playOpen();
    } else {
      wrapper.removeAttribute("data-open");
      playClose();
    }
    animateIcon(open);
    animateColor(open);
    animateText(open);
  }

  function closeMenu() {
    if (open) {
      open = false;
      wrapper.removeAttribute("data-open");
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", toggleMenu);
  }

  // Smooth scroll links and close menu
  const menuLinks = panel.querySelectorAll(".sm-panel-item");
  menuLinks.forEach(link => {
    link.addEventListener("click", () => {
       closeMenu();
    });
  });

  if (closeOnClickAway) {
    document.addEventListener("mousedown", (event) => {
      if (open && panel && toggleBtn) {
        if (!panel.contains(event.target) && !toggleBtn.contains(event.target)) {
          closeMenu();
        }
      }
    });
  }
});
