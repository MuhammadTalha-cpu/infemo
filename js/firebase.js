/* ============================================================
   INFEMO — FIREBASE INTEGRATION
   Handles all authentication and Firestore operations.

   ⚠️  REQUIRED SETUP:
   Replace the firebaseConfig object below with YOUR config
   from Firebase Console → Project Settings → Your apps.
   ============================================================ */

/* ── YOUR FIREBASE CONFIG ───────────────────────────────────
   ⚠️  PASTE YOUR CONFIG HERE — replace every value below ⚠️
─────────────────────────────────────────────────────────── */
var firebaseConfig = {
  apiKey: "AIzaSyBipkBq2PYM3g5hLeB3a7kAELB0kEufBpw",
  authDomain: "infemo-8f714.firebaseapp.com",
  projectId: "infemo-8f714",
  storageBucket: "infemo-8f714.firebasestorage.app",
  messagingSenderId: "996853781354",
  appId: "1:996853781354:web:2fc931692269332c040b13",
};

/* ── Initialize Firebase ────────────────────────────────── */
/* Only initialize if not already initialized */
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

var FBAuth = firebase.auth();
var FBDb = firebase.firestore();

/* ══════════════════════════════════════════════════════════
   FIREBASE AUTH — All authentication operations
════════════════════════════════════════════════════════════ */

var FirebaseAuth = {
  /* Prevents redirect loops when signing out intentionally */
  _intentionalSignOut: false,

  /* ── init() ─────────────────────────────────────────────
       Called in App.init(). Sets up the auth state listener.
       Fires once immediately with the current state, then
       again whenever the state changes.
    ─────────────────────────────────────────────────────── */
  init() {
    FBAuth.onAuthStateChanged((user) => {
      if (user) {
        /* User is signed in */
        AppState.setUser(user);
        Storage.set(Storage.KEYS.MODE, "user");
        Storage.set(Storage.KEYS.VISITED, true);
      } else {
        /* No user signed in */
        var mode = Storage.get(Storage.KEYS.MODE);

        /* Only redirect if this was a logged-in user session
                   that expired — not for guests */
        if (mode === "user" && !this._intentionalSignOut) {
          AppState.clearUser();
          Storage.remove(Storage.KEYS.MODE);
          if (window.location.hash !== "#auth") {
            Router.navigate("#auth");
          }
        }
      }
    });
  },

  /* ── signInWithGoogle() ─────────────────────────────────
       Opens Google sign-in popup.
    ─────────────────────────────────────────────────────── */
  async signInWithGoogle() {
    try {
      var provider = new firebase.auth.GoogleAuthProvider();
      var result = await FBAuth.signInWithPopup(provider);
      var user = result.user;

      await this.createUserDocument(user);

      Storage.set(Storage.KEYS.VISITED, true);
      Storage.set(Storage.KEYS.MODE, "user");

      Router.navigate("#welcome");
      return { success: true };
    } catch (error) {
      console.error("Google sign-in error:", error);
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  },

  /* ── signInWithEmail() ──────────────────────────────────
       Signs in an existing user with email + password.
    ─────────────────────────────────────────────────────── */
  async signInWithEmail(email, password) {
    try {
      await FBAuth.signInWithEmailAndPassword(email, password);

      Storage.set(Storage.KEYS.VISITED, true);
      Storage.set(Storage.KEYS.MODE, "user");

      Router.navigate("#welcome");
      return { success: true };
    } catch (error) {
      console.error("Email sign-in error:", error);
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  },

  /* ── registerWithEmail() ────────────────────────────────
       Creates a new account with email + password + name.
    ─────────────────────────────────────────────────────── */
  async registerWithEmail(email, password, name) {
    try {
      var result = await FBAuth.createUserWithEmailAndPassword(email, password);
      var user = result.user;

      /* Add display name to the Firebase user profile */
      await user.updateProfile({ displayName: name });

      /* Create Firestore document */
      await this.createUserDocument(user, name);

      Storage.set(Storage.KEYS.VISITED, true);
      Storage.set(Storage.KEYS.MODE, "user");

      Router.navigate("#welcome");
      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: this.getErrorMessage(error.code),
      };
    }
  },

  /* ── createUserDocument(user, displayName) ──────────────
       Creates user document in Firestore on first login.
       Safe to call every login — skips if doc already exists.
    ─────────────────────────────────────────────────────── */
  async createUserDocument(user, displayName) {
    try {
      var userRef = FBDb.collection("users").doc(user.uid);
      var doc = await userRef.get();

      if (!doc.exists) {
        await userRef.set({
          name: displayName || user.displayName || "",
          email: user.email || "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          theme: AppState.theme || "light",
        });
      }
    } catch (error) {
      /* Non-fatal — app still works without Firestore doc */
      console.warn("Could not create user document:", error);
    }
  },

  /* ── signOut() ──────────────────────────────────────────
       Shows a confirmation dialog then signs the user out.
    ─────────────────────────────────────────────────────── */
  showSignOutConfirm() {
    App.showModal({
      title: "Sign Out",
      body: `
                <div style="text-align:center; padding: var(--space-4) 0;">
                    <div style="
                        width:56px; height:56px; border-radius:50%;
                        background:var(--warning-bg); color:var(--warning);
                        display:flex; align-items:center; justify-content:center;
                        margin: 0 auto var(--space-4);
                    ">
                        <i data-lucide="log-out" style="width:24px;height:24px;"></i>
                    </div>
                    <p style="color:var(--text-secondary); font-size:var(--text-base);">
                        Are you sure you want to sign out?
                        Your progress is saved and will be here when you return.
                    </p>
                </div>
            `,
      footer: `
                <button class="btn btn-ghost" id="signout-cancel-btn">Cancel</button>
                <button class="btn btn-danger" id="signout-confirm-btn">
                    <i data-lucide="log-out"></i> Sign Out
                </button>
            `,
    });

    setTimeout(() => {
      var cancelBtn = document.getElementById("signout-cancel-btn");
      var confirmBtn = document.getElementById("signout-confirm-btn");
      var overlay = document.querySelector(".modal-overlay");

      if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
          if (overlay) overlay.remove();
        });
      }

      if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
          if (overlay) overlay.remove();
          FirebaseAuth.performSignOut();
        });
      }

      if (window.lucide) lucide.createIcons();
    }, 50);
  },

  /* ── performSignOut() ───────────────────────────────────
       Actually signs the user out after confirmation.
    ─────────────────────────────────────────────────────── */
  async performSignOut() {
    try {
      this._intentionalSignOut = true;
      await FBAuth.signOut();

      AppState.clearUser();
      Storage.remove(Storage.KEYS.MODE);
      Storage.remove(Storage.KEYS.LANGUAGE);

      this._intentionalSignOut = false;
      Router.navigate("#auth");
    } catch (error) {
      this._intentionalSignOut = false;
      console.error("Sign out error:", error);
      App.showToast("Sign out failed. Please try again.", "error");
    }
  },

  /* ── deleteAccount() ────────────────────────────────────
       Permanently deletes the user account and all data.
       Called from the Settings screen (Phase 22).
    ─────────────────────────────────────────────────────── */
  async deleteAccount() {
    var user = FBAuth.currentUser;
    if (!user) return { success: false, message: "No user signed in." };

    try {
      this._intentionalSignOut = true;

      /* Delete Firestore document */
      await FBDb.collection("users").doc(user.uid).delete();

      /* Delete Firebase Auth account */
      await user.delete();

      /* Clear everything locally */
      AppState.clearUser();
      Storage.clear();

      this._intentionalSignOut = false;
      Router.navigate("#auth");
      return { success: true };
    } catch (error) {
      this._intentionalSignOut = false;

      if (error.code === "auth/requires-recent-login") {
        return {
          success: false,
          message:
            "For security, please sign out and sign back in before deleting your account.",
        };
      }
      return {
        success: false,
        message: "Could not delete account. Please try again.",
      };
    }
  },

  /* ── showUpgradeModal() ─────────────────────────────────
       Shows "Start Fresh / Keep Progress" modal when a
       guest clicks "Login / Create Account" in the sidebar.
    ─────────────────────────────────────────────────────── */
  showUpgradeModal() {
    App.showModal({
      title: "Create an Account",
      subtitle: "You have been learning as a guest. What would you like to do?",
      body: `
                <div class="modal-option" id="modal-opt-fresh">
                    <div class="modal-option-icon"
                         style="background:var(--primary-light);">
                        <i data-lucide="refresh-cw"
                           style="color:var(--primary);width:18px;height:18px;"></i>
                    </div>
                    <div>
                        <div class="modal-option-title">Start Fresh</div>
                        <div class="modal-option-desc">
                            Create account and begin from zero.
                            Everything done as guest will be cleared.
                        </div>
                    </div>
                </div>
                <div class="modal-option" id="modal-opt-keep">
                    <div class="modal-option-icon"
                         style="background:var(--success-bg);">
                        <i data-lucide="check-square"
                           style="color:var(--success);width:18px;height:18px;"></i>
                    </div>
                    <div>
                        <div class="modal-option-title">Keep My Progress</div>
                        <div class="modal-option-desc">
                            Transfer all guest progress to your new account.
                            Nothing will be lost.
                        </div>
                    </div>
                </div>
            `,
    });

    setTimeout(() => {
      var freshBtn = document.getElementById("modal-opt-fresh");
      var keepBtn = document.getElementById("modal-opt-keep");
      var overlay = document.querySelector(".modal-overlay");

      if (freshBtn) {
        freshBtn.addEventListener("click", () => {
          Storage.set("upgrade_mode", "fresh");
          if (overlay) overlay.remove();
          Router.navigate("#auth");
        });
      }

      if (keepBtn) {
        keepBtn.addEventListener("click", () => {
          Storage.set("upgrade_mode", "keep");
          if (overlay) overlay.remove();
          Router.navigate("#auth");
        });
      }

      if (window.lucide) lucide.createIcons();
    }, 50);
  },

  /* ── getErrorMessage(code) ──────────────────────────────
       Converts Firebase error codes to friendly messages.
    ─────────────────────────────────────────────────────── */
  getErrorMessage(code) {
    var messages = {
      "auth/user-not-found": "No account found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/invalid-credential":
        "Invalid email or password. Please check and try again.",
      "auth/email-already-in-use": "An account already exists with this email.",
      "auth/weak-password": "Password must be at least 6 characters.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests": "Too many attempts. Please try again later.",
      "auth/network-request-failed": "Network error. Check your connection.",
      "auth/popup-closed-by-user": "Sign-in was cancelled. Please try again.",
      "auth/popup-blocked":
        "Popup was blocked. Please allow popups for this site.",
      "auth/cancelled-popup-request": "Sign-in cancelled. Please try again.",
    };
    return messages[code] || "Something went wrong. Please try again.";
  },
};
