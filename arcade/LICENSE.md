# Arcade section: licenses and provenance

## Included playable title: Neon Dodger
- **Developer:** Pixel Vault (original project contribution)
- **Year:** 2026
- **Genre / players:** Arcade action / 1 player
- **License:** CC0-1.0
- **Source:** [Arcade section source](https://github.com/NMoon-Whisper/My-First-Site/tree/feat/legal-arcade-section/arcade)
- **Attribution:** Original gameplay, visuals, and source code authored for this project. No third-party game assets or ROMs are included.
- **Metadata:** [games/neon-dodger.json](games/neon-dodger.json)

Neon Dodger is an original browser canvas game, not a dumped arcade ROM and not an emulated console title. Its code is dedicated under CC0 1.0 Universal, to the extent permitted by law.

## Third-party content policy
No third-party arcade ROMs, BIOS images, ROM sets, or box art are bundled. A title may be added to the curated catalog only after maintainers verify the rights holder, exact redistribution license or permission, canonical source URL, attribution text, release/version, and checksums for distributed assets. Store these details in a per-game JSON file under `games/` and update this document. If rights are unclear, exclude the title.

## Emulator runtime
The optional local-file player references EmulatorJS from its stable CDN at runtime. EmulatorJS and its separately distributed core/data files have their own licenses and notices; see the [EmulatorJS project](https://github.com/EmulatorJS/EmulatorJS) and notices shipped with the runtime. This repository does not vendor those binaries. Runtime code is third-party code fetched by the browser, so this feature requires a network connection and trust in that provider. For a hardened deployment, review and pin an exact compatible release and self-host reviewed assets with their licenses.

## User-provided files
Users are responsible for having the rights to selected files. Local loading does not establish that a file is lawful, compatible, or free of required BIOS dependencies. This app has no ROM upload endpoint.