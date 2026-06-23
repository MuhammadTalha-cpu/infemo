/* ============================================================
   INFEMO — AUTH SCREEN
   First screen shown on first-ever visit.
   Handles: Guest mode, Email form toggle, Google (Phase 9)
   ============================================================ */

var AuthScreen = {
  /* ── State ──────────────────────────────────────────── */
  emailFormVisible: false,
  formMode: "signin", // 'signin' or 'register'

  /* ── render() ───────────────────────────────────────── */
  render() {
    const el = document.getElementById("screen-auth");
    if (!el) return;

    el.innerHTML = `
            <div class="auth-card">

                <!-- Logo & Tagline -->
                <div class="auth-logo">Infemo</div>
                <div class="auth-tagline">Master Languages at Your Pace</div>

                <!-- Buttons -->
                <div class="auth-buttons">

                    <!-- Google -->
                    <button class="btn btn-neutral btn-full" id="auth-google-btn">
                        <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    <!-- Email -->
                    <button class="btn btn-primary btn-full" id="auth-email-btn">
                        <i data-lucide="mail"></i>
                        Continue with Email
                    </button>

                    <!-- Email Form (hidden until button clicked) -->
                    <div class="auth-email-form" id="auth-email-form">

                        <div class="input-group">
                            <label class="input-label">Email address</label>
                            <input
                                class="input"
                                type="email"
                                id="auth-email-input"
                                placeholder="you@example.com"
                                autocomplete="email"
                            />
                        </div>

                        <div class="input-group">
                            <label class="input-label">Password</label>
                            <input
                                class="input"
                                type="password"
                                id="auth-password-input"
                                placeholder="••••••••"
                                autocomplete="current-password"
                            />
                        </div>

                        <!-- Name field — only shown in register mode -->
                        <div class="input-group" id="auth-name-group" style="display:none;">
                            <label class="input-label">Your name</label>
                            <input
                                class="input"
                                type="text"
                                id="auth-name-input"
                                placeholder="Muhammad Talha"
                                autocomplete="name"
                            />
                        </div>

                        <!-- Error message -->
                        <div class="auth-error" id="auth-error"></div>

                        <!-- Submit button -->
                        <button class="btn btn-primary btn-full" id="auth-submit-btn">
                            <i data-lucide="log-in"></i>
                            <span id="auth-submit-label">Sign In</span>
                        </button>

                        <!-- Toggle between sign in and register -->
                        <p class="auth-toggle-text">
                            <span id="auth-toggle-prompt">New here?</span>
                            <span class="auth-toggle-link" id="auth-toggle-link">
                                Create an account
                            </span>
                        </p>

                    </div>

                    <!-- Divider -->
                    <div class="divider-text auth-divider">
                        <span>or</span>
                    </div>

                    <!-- Guest -->
                    <button class="btn btn-ghost btn-full" id="auth-guest-btn">
                        Continue without Account
                    </button>

                </div><!-- end auth-buttons -->

                <!-- Helper note -->
                <div class="auth-note">
                    Google &amp; Email login require Firebase setup.
                    Use <strong>Continue without Account</strong> to
                    explore the app while building.
                </div>

            </div><!-- end auth-card -->
        `;

    // Attach event listeners after HTML is injected
    this.attachListeners();

    // Re-initialize Lucide icons
    if (window.lucide) lucide.createIcons();
  },

  /* ── attachListeners() ──────────────────────────────── */
  attachListeners() {
    /* ── Google Button ──────────────────────────────── */
    const googleBtn = document.getElementById("auth-google-btn");
    if (googleBtn) {
      googleBtn.addEventListener("click", () => {
        this.handleGoogle();
      });
    }

    /* ── Email Button ───────────────────────────────── */
    const emailBtn = document.getElementById("auth-email-btn");
    if (emailBtn) {
      emailBtn.addEventListener("click", () => {
        this.toggleEmailForm();
      });
    }

    /* ── Email Submit Button ────────────────────────── */
    const submitBtn = document.getElementById("auth-submit-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", () => {
        this.handleEmailSubmit();
      });
    }

    /* ── Enter Key in inputs ────────────────────────── */
    ["auth-email-input", "auth-password-input", "auth-name-input"].forEach(
      (id) => {
        const input = document.getElementById(id);
        if (input) {
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") this.handleEmailSubmit();
          });
        }
      },
    );

    /* ── Toggle Sign In / Register ──────────────────── */
    const toggleLink = document.getElementById("auth-toggle-link");
    if (toggleLink) {
      toggleLink.addEventListener("click", () => {
        this.toggleFormMode();
      });
    }

    /* ── Guest Button ───────────────────────────────── */
    const guestBtn = document.getElementById("auth-guest-btn");
    if (guestBtn) {
      guestBtn.addEventListener("click", () => {
        this.handleGuest();
      });
    }
  },

  /* ── toggleEmailForm() ──────────────────────────────── */
  toggleEmailForm() {
    this.emailFormVisible = !this.emailFormVisible;
    const form = document.getElementById("auth-email-form");
    if (form) {
      form.classList.toggle("visible", this.emailFormVisible);
    }
    if (this.emailFormVisible) {
      // Focus the email input
      setTimeout(() => {
        const emailInput = document.getElementById("auth-email-input");
        if (emailInput) emailInput.focus();
      }, 100);
    }
  },

  /* ── toggleFormMode() ───────────────────────────────── */
  toggleFormMode() {
    this.formMode = this.formMode === "signin" ? "register" : "signin";
    const isRegister = this.formMode === "register";

    const label = document.getElementById("auth-submit-label");
    const prompt = document.getElementById("auth-toggle-prompt");
    const link = document.getElementById("auth-toggle-link");
    const nameGrp = document.getElementById("auth-name-group");

    if (label) label.textContent = isRegister ? "Create Account" : "Sign In";
    if (prompt)
      prompt.textContent = isRegister
        ? "Already have an account?"
        : "New here?";
    if (link)
      link.textContent = isRegister ? "Sign in instead" : "Create an account";
    if (nameGrp) nameGrp.style.display = isRegister ? "flex" : "none";

    // Clear error when switching modes
    this.hideError();
  },

  /* ── handleGuest() ──────────────────────────────────── */
  handleGuest() {
    // Mark as visited and set guest mode
    Storage.set(Storage.KEYS.VISITED, true);
    Storage.set(Storage.KEYS.MODE, "guest");

    // Update app state
    AppState.setGuest();

    // All users go through Welcome first
    Router.navigate("#welcome");
  },

  /* ── handleGoogle() ─────────────────────────────────── */
  handleGoogle() {
    // Firebase Google auth — connected in Phase 9
    // For now show an informational message
    this.showError(
      "Google sign-in requires Firebase setup (coming in Phase 9). " +
        'Use "Continue without Account" to test the app now.',
    );
  },

  /* ── handleEmailSubmit() ────────────────────────────── */
  handleEmailSubmit() {
    const email = document.getElementById("auth-email-input")?.value?.trim();
    const password = document.getElementById("auth-password-input")?.value;
    const name = document.getElementById("auth-name-input")?.value?.trim();

    // Basic validation
    if (!email) {
      this.showError("Please enter your email address.");
      return;
    }
    if (!email.includes("@")) {
      this.showError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      this.showError("Password must be at least 6 characters.");
      return;
    }
    if (this.formMode === "register" && !name) {
      this.showError("Please enter your name.");
      return;
    }

    // Firebase email auth — connected in Phase 9
    // For now show an informational message
    this.showError(
      "Email sign-in requires Firebase setup (coming in Phase 9). " +
        'Use "Continue without Account" to test the app now.',
    );
  },

  /* ── showError(message) ─────────────────────────────── */
  showError(message) {
    const errorEl = document.getElementById("auth-error");
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("visible");

      // Ensure email form is visible to show the error
      if (
        !this.emailFormVisible &&
        !message.includes("Continue without Account")
      ) {
        // Only show form if error is form-related
      }
    }
  },

  /* ── hideError() ────────────────────────────────────── */
  hideError() {
    const errorEl = document.getElementById("auth-error");
    if (errorEl) {
      errorEl.classList.remove("visible");
      errorEl.textContent = "";
    }
  },
};
