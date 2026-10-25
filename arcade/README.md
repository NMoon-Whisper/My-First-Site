# Pixel Vault Arcade

An isolated, static-hostable arcade section. The existing root homepage is not modified by this branch.

## Included content and support
- **Neon Dodger:** original browser canvas arcade game, CC0-1.0; no ROM or BIOS required.
- **Local arcade files:** optional EmulatorJS runtime configured for the `arcade` core. Compatibility depends on runtime version, core, ROM revision, machine driver, archive layout, and any required BIOS. This project does not claim every MAME/FBNeo title is supported.
- No third-party arcade ROMs, BIOS files, full sets, or third-party box art are included.
- See [LICENSE.md](LICENSE.md), [games/neon-dodger.json](games/neon-dodger.json), and [metadata-schema.json](metadata-schema.json) for provenance rules.

## Run
From the repository root, run a static server:
```sh
python -m http.server 8080
```
Visit `http://localhost:8080/arcade/`. There is no build step. Neon Dodger is playable without an emulator. The optional emulator downloads its runtime from the EmulatorJS CDN when launched, so that feature requires a network connection.

## Controls
Neon Dodger: arrow keys or WASD; touch directional buttons on mobile. Start/resume, pause, restart, fullscreen, and a measured FPS display are included. The local ROM player depends on EmulatorJS for its own controls and features. This section does not implement a uniform site-level save-state manager, control remapping, volume/mute, screenshots, six-button layout, or multi-file ZIP selection; those capabilities are not guaranteed by this initial integration.

## Security and production caveats
- Local file size is capped at 512 MiB; filenames are validated before launch.
- No ROM upload API is present. Selected files are passed as temporary object URLs to the in-browser runtime and the URL is revoked when stopped or the page closes.
- The CSP permits the EmulatorJS CDN because the optional runtime is remote. For a hardened production deployment, pin a reviewed runtime version, self-host its assets with matching licenses, set a restrictive response-header CSP, and perform dependency/license scanning.
- No service worker is configured in this section, so it does not cache ROMs or BIOS files.
- The curated catalog only includes the original Neon Dodger. Do not add third-party titles until redistribution rights are verified and their source, license, attribution, and asset hashes are documented.

## Test report (implementation review, not a device lab)
| Check | Status | Notes |
|---|---|---|
| Built-in game | Implemented | Original canvas game, no emulator required |
| Keyboard and touch | Implemented | WASD/arrows and pointer-based touch buttons |
| FPS overlay | Implemented | Measured using requestAnimationFrame timestamps; no hardware guarantee |
| Local file picker | Implemented | Browser File object and temporary object URL |
| Server upload | Not present | No upload endpoint or ROM upload request in the app code |
| Emulator boot for arcade ROMs | Not certified | CDN runtime configured; no title/core smoke test run |
| Multi-file ZIP handling | Not guaranteed | One selected file is passed to the runtime; archive behavior depends on core |
| Save states / remapping / volume / screenshot | Not implemented uniformly | Depends on runtime/core; not promised by this section |
| Chrome / Edge / Firefox / Safari | Not lab-tested | Verify current versions before release |
| 60 FPS target | Not certified | Overlay reports measured browser-game FPS; no hardware benchmark run |
| Input latency | Not lab-tested | No instrumented end-to-end latency measurement |

Before calling this production-ready, run browser automation and physical-device tests with a legally redistributable arcade test title, verify exact EmulatorJS arcade core behavior, and record browser/device/FPS/input latency/save-state results.
