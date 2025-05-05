# CHANGELOG

## [2.0.0] 05-05-2025

### Breaking

- Overhaul `pathExists` to use linux based file system entity identification. This change fuses `PathExistsState.None` and `PathExistsState.Unknown`
- Overhaul `PathExistsState` from an `enum` to an `object` to fix `verbatimModuleSyntax` error on import.
- Rename `PathExistsState` to `FSEntity`

### Added

- New and optimized `readLines` function that reads files line by line faster than the `node:readline` interface.
- Type declarations for mapper objects `Chmod` and `FSEntity` with their corresponding `valueOf` types: `ChmodValues` and `FSEntityValues`

## [1.1.1] 02-25-2025

### Fixed

- Add forgotten type definitions of `exists`

## [1.1.0] 02-25-2025

### Added

- `hasFileContent`
- `exists`

### Fixed

- type definitions of `hasFlag`
