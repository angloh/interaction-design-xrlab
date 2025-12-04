Butterfly Simon — Secure Config Mode
===================================

How it works
------------
- The **experimenter setup** (`experimenter.html`) is only usable when opened with `?mode=config`.
- Access to the experimenter view is protected by an **Admin PIN** stored in `localStorage["ButterflySimonAdminPin"]`.
- The **subject view** (`subject.html`) runs normally, but if opened with `?mode=config` it shows a PIN gate that, on success, redirects to `experimenter.html?mode=config`.

Experimenter flow
-----------------
1. First time on this machine:
   - Open `experimenter.html?mode=config` in your browser.
   - You will see a yellow banner explaining that no Admin PIN is set yet.
   - Configure the task as desired.
   - In the new **Admin Access** section, set an **Admin PIN** and click **Save Config**.
2. Next time:
   - Opening `experimenter.html?mode=config` will show a PIN overlay.
   - Enter the Admin PIN to unlock and edit settings.

Subject flow
------------
- For participants, just open `subject.html?participant=S001` (or any ID) normally.
- The experimenter UI is hidden when `?mode=config` is not present.
- If `subject.html?mode=config` is used (by the experimenter), a gate appears:
  - If a PIN exists, it must be entered correctly.
  - If no PIN exists yet, it lets you proceed to `experimenter.html?mode=config` to set one.

Security note
-------------
This is a **local, convenience gate** (front-end only). It prevents casual access to the experimenter view but is not a cryptographic security barrier.
