# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.13.0] - 2024-01-20

### Added

- JsonHelper class.
- Added optional error type constraint Result and AsyncResult.
- 
### Changed

- Handler in [Result|AsyncResult].onOk() and [Result|AsyncResult].onErr() now can return all values(Value will be Wrapped to Result if need).
- [Result|AsyncResult].onErr() now can filter what fn can handle on first parameter. 

### Removed
- Removed Result.onOkA - now onOk can change mode to async.
- Removed using object event type map to callback in [Result|AsyncResult].onErr().
- Removed [Result|AsyncResult].map() and [Result|AsyncResult].mapErr();
- Removed UNKNOWN_ERROR_TYPE.

## [0.12.5] - 2024-01-05

### Added

- AccountId and UserId.

## [0.12.4] - 2023-12-26

### Added

- Jest matcher: toMatchSuccessResult.
- function stripAnsiColors().
- function wrapToIterable().
- interface GetQueryOptions.
- class RetryHelper. 
- type DropFirstItem.
- type TupleTail.
- type ParamsTail.
- AccountId and UserId value Objects.

## [0.12.3] - 2023-12-03

### Added

- many changes, initial changelog.

## [0.10.4] - 2023-08-17

### Added

- many changes.

[unreleased] https://github.com/hexancore/common/compare/0.13.0...HEAD
[0.13.0] https://github.com/hexancore/common/compare/0.12.5...0.13.0
[0.12.5] https://github.com/hexancore/common/compare/0.12.4...0.12.5   
[0.12.4] https://github.com/hexancore/common/compare/0.12.3...0.12.4  
[0.12.3] https://github.com/hexancore/common/compare/0.10.4...0.12.3   
[0.10.4] https://github.com/test_owner/test_repository/releases/tag/0.10.4   
