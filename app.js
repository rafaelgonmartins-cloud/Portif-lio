document.addEventListener("DOMContentLoaded", () => {
  // 1. Intro Video Logic (Adaptive Desktop vs Mobile)
  const introScreen = document.getElementById("intro-screen");
  const introVideo = document.getElementById("intro-video");
  const introVideoSrc = document.getElementById("intro-video-src");
  const skipIntroBtn = document.getElementById("skip-intro");

  // Choose optimal intro video based on screen width
  const isMobile = window.innerWidth <= 768;
  const desktopIntro = "assets/loading_completo_desktop.mp4";
  const mobileIntro = "assets/Loading completo.mp4";
  const chosenIntro = isMobile ? mobileIntro : desktopIntro;

  if (introVideo && introVideoSrc) {
    if (introVideoSrc.getAttribute("src") !== chosenIntro) {
      introVideoSrc.setAttribute("src", chosenIntro);
      introVideo.load();
      introVideo.play().catch(e => console.log("Intro autoplay attempt:", e));
    }
  }

  function dismissIntro() {
    introScreen.classList.add("fade-out");
    if (introVideo) {
      introVideo.pause();
    }
    // Start playing all visible preview videos smoothly
    playAllPreviews();
  }

  if (introVideo) {
    introVideo.addEventListener("ended", dismissIntro);
  }

  if (skipIntroBtn) {
    skipIntroBtn.addEventListener("click", dismissIntro);
  }

  // Fallback safety: dismiss after 7 seconds max
  setTimeout(() => {
    if (!introScreen.classList.contains("fade-out")) {
      dismissIntro();
    }
  }, 7000);

  // 2. Mobile Menu Toggle
  const mobileBtn = document.getElementById("mobile-menu-toggle");
  const navLinks = document.getElementById("nav-links");
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // 3. Hero Video NLE Player
  const heroVideo = document.getElementById("hero-video");
  const heroPlayerBox = document.getElementById("hero-player-box");
  const heroOverlay = document.getElementById("hero-overlay");
  const heroTimecode = document.getElementById("hero-timecode");

  if (heroPlayerBox && heroVideo) {
    heroPlayerBox.addEventListener("click", () => {
      if (heroVideo.paused) {
        heroVideo.muted = false;
        heroVideo.play().then(() => {
          heroOverlay.classList.add("hidden");
        }).catch(err => {
          console.warn("Autoplay with sound blocked, trying muted:", err);
          heroVideo.muted = true;
          heroVideo.play();
          heroOverlay.classList.add("hidden");
        });
      } else {
        heroVideo.pause();
        heroOverlay.classList.remove("hidden");
      }
    });

    heroVideo.addEventListener("timeupdate", () => {
      const time = heroVideo.currentTime;
      const hours = String(Math.floor(time / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
      const seconds = String(Math.floor(time % 60)).padStart(2, '0');
      const frames = String(Math.floor((time % 1) * 24)).padStart(2, '0');
      heroTimecode.textContent = `${hours}:${minutes}:${seconds}:${frames}`;
    });
  }

  // 4. Play all previews in continuous loop
  function playAllPreviews() {
    const previewVideos = document.querySelectorAll(".project-video-preview");
    previewVideos.forEach(video => {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay prevented until user interaction
        });
      }
    });
  }

  // 5. Pause previews when modal opens to save GPU/CPU
  function pauseAllPreviews() {
    const previewVideos = document.querySelectorAll(".project-video-preview");
    previewVideos.forEach(video => {
      video.pause();
    });
  }

  // 6. Render Portfolio Projects (6-second 480p preview in loop)
  const projectsContainer = document.getElementById("projects-container");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function renderProjects(filter = "all") {
    if (!projectsContainer || typeof projectsData === "undefined") return;

    const filtered = filter === "all" 
      ? projectsData 
      : projectsData.filter(p => p.category === filter);

    projectsContainer.innerHTML = filtered.map(p => `
      <div class="project-card" data-id="${p.id}" onclick="openModal('${p.id}')">
        <div class="project-thumbnail ${p.aspectRatio === 'vertical' ? 'vertical-ratio' : ''}">
          <video class="project-video-preview" autoplay muted loop playsinline preload="auto">
            <source src="${p.videoPreview || p.videoSrc}" type="video/mp4">
          </video>
          <span class="project-badge-tag">${p.tag}</span>
          <div class="project-overlay">
            <div class="play-badge">
              <i class="fa-solid fa-expand"></i>
            </div>
          </div>
        </div>

        <div class="project-info">
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-meta">
            <span><i class="fa-solid fa-fire" style="color: var(--accent-neon);"></i> ${p.retention}</span>
            <div class="project-software">
              ${p.software.map(s => `<span class="software-tag">${s}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `).join("");

    playAllPreviews();
  }

  // Initial render
  renderProjects();

  // Filter Buttons Click
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      renderProjects(filter);
    });
  });

  // 7. Video Modal with High-Res Full HD / 4K Source
  const modal = document.getElementById("video-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDetails = document.getElementById("modal-details");
  const modalVideoPlayer = document.getElementById("modal-video-player");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  window.openModal = function(id) {
    const project = projectsData.find(p => p.id === id);
    if (!project) return;

    // Pause all background loops while watching expanded video
    pauseAllPreviews();

    modalTitle.textContent = project.title;
    modalDetails.innerHTML = `
      <p style="margin-bottom: 0.5rem;"><strong>Categoria:</strong> ${project.categoryLabel} &bull; <strong>Status:</strong> ${project.retention} &bull; <span style="color: var(--accent-cyan);"><i class="fa-solid fa-high-definition"></i> Alta Resolução (Original)</span></p>
      <p>${project.description}</p>
    `;
    modalVideoPlayer.src = project.videoSrc; // High-resolution original video
    modalVideoPlayer.muted = false;
    modal.classList.add("active");
    modalVideoPlayer.play().catch(e => console.log("Modal play caught:", e));
  };

  function closeModal() {
    modal.classList.remove("active");
    modalVideoPlayer.pause();
    modalVideoPlayer.src = "";
    // Resume background loop previews
    playAllPreviews();
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closeModal);
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeModal();
    }
  });

  // 8. Contact Form submission via WhatsApp
  window.handleFormSubmit = function(e) {
    e.preventDefault();
    const name = document.getElementById("form-name").value;
    const type = document.getElementById("form-type").value;
    const msg = document.getElementById("form-msg").value;

    const fullMessage = `Olá! Meu nome é *${name}*.\n\n*Tipo de Projeto:* ${type}\n*Detalhes:* ${msg}\n\nVi seu portfólio e gostaria de um orçamento!`;
    const whatsappUrl = `https://wa.me/5553991671680?text=${encodeURIComponent(fullMessage)}`;
    
    window.open(whatsappUrl, "_blank");
  };
});
