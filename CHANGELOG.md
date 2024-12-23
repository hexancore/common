# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.16.5] - 2024-12-07

### Added

- added MapPlainParseHelper
- added JsonHelper methods: mapJsonSerializableMapToJson(), mapPrimitiveMapToJson(), mapJsonSerializableArrayToJson()

### Fixed

- JsonSchemaFactory.Object() add missing 'additionalProperties' option

## [0.16.4] - 2024-11-30

### Added

- added 'additionalProperties' option to JsonSchema Object
- added PlainParseHelper.parseRecord()

### Changed

- changed HDateTime.now() precision to milis
- changed HDateTime.toJson() return type to ISO 8601

## [0.16.3] - 2024-11-17

### Added

- added Uuid ValueObject
- added UuidBase converters to base62 and base36
- added JsonSchema prop to HObjects
- added OrganizationId, OrganizationGroupId, OrganizationMemberId, TenantId
- added PrimitiveComparable
- added ObjectFilter

### Changed

- UBigInt64 -> UInt64.
- HValueObject -> ValueObject
- GetQueryOptions -> GetListQueryOptions
- Dto -> DTO

### Removed

- temporaly removed EmailHash(need rework to support browser&node versions in one)
- removed AccountId -> replaced with TenantId

## [0.16.2] - 2024-10-05

### Changed

- reworked HObjects(no backward compatible changes)
  - AbstractValueObject -> HValueObject
  - Removed generic self from HObjects

## [0.16.1] - 2024-09-29

### Changed

- reworked HObjects(no backward compatible changes)
- renamed ValueObjects:
  - DateTime -> HDateTime
  - UIntValue -> UInt
  - UBigInt -> UBigInt64
  - StringValue -> HString
  - RegexStringValue -> HRegexString

## [0.16.0] - 2024-09-23

### Added

- added HObject concept with parse from unknown method generated from AOT(Transformer in core).
- added first package benchmark stuff
- added types: NonMethodRequiredPropertyNames,NonMethodOptionalPropertyNames,NonMethodProperties, ToJSONReturnType, JsonObjectType

### Changed

- refactor ValueObject concept to HObject.
- pascalCaseToSnakeCase() - implemented faster version.
- OK() returns constant objects for: `true`, `false`, `undefined`, `null` values for performence.

## [0.15.0] - 2024-06-27

### Added

- extractLoggerFromObject(), extractTestLoggerFromObject(), extractTestLoggerRecordsFromObject

### Changed

- AppMeta - default EnvProvider in NodeJS env.
- separated http exports(/http and ./testing/http).
- export ./testutil -> ./testing
- separated Jest matchers export ./testing/jest

### Removed

- removed MailContent Value Object

## [0.14.0] - 2024-06-15

### Changed

- shrinked build size

### Removed

- removed `xss` dep
- removed bin docker
- removed `string.prototype.matchall` dep

### Fixed

- small types fixes in strict mode

## [0.13.3] - 2024-02-03

### Fixed

- ES module build .

### Changed

- DateTime.c() and DateTime.cs() - better support date/time string formats: `2023-10-01`, `2023-10-01 08:50:00` `2023-10-01T08:50:00`.
- ConsoleLogger - `message -> msg` `timestamp` -> `time`.

### Removed

- Removed ConsoleLogger log record app_id and app_env append(with logging solution like fluentd we can append it on higher level).

## [0.13.2] - 2024-02-01

### Added

- RefId value object

## [0.13.1] - 2024-01-25

### Added

- DateTime.formatRfc1123()
- ARW() - more meaning name for wrapping Promise with AsyncResult

### Changed

- AsyncResult.fromPromise() -> AsyncResult.wrap().
- AsyncResult.fromPromiseOkTrue() -> AsyncResult.warpOnOkTrue().
- AsyncResult.from() - accepts functions returns Promise(async/await support).
- RetryHelper.retryAsync() - returns AR.

### Removed

- AsyncResult.fromSafePromise() - AsyncResult.from supports both.

### Deprecated

- P() - use ARW()
- PS() - use ARW()
- PB() - use ARWB()

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

[unreleased] https://github.com/hexancore/common/compare/0.16.5...HEAD   
[0.16.5] https://github.com/hexancore/common/compare/0.16.4...0.16.5   
[0.16.4] https://github.com/hexancore/common/compare/0.16.3...0.16.4  
[0.16.3] https://github.com/hexancore/common/compare/0.16.2...0.16.3  
[0.16.2] https://github.com/hexancore/common/compare/0.16.1...0.16.2  
[0.16.1] https://github.com/hexancore/common/compare/0.16.0...0.16.1  
[0.16.0] https://github.com/hexancore/common/compare/0.15.0...0.16.0  
[0.15.0] https://github.com/hexancore/common/compare/0.14.0...0.15.0  
[0.14.0] https://github.com/hexancore/common/compare/0.13.3...0.14.0  
[0.13.3] https://github.com/hexancore/common/compare/0.13.2...0.13.3  
[0.13.2] https://github.com/hexancore/common/compare/0.13.1...0.13.2  
[0.13.1] https://github.com/hexancore/common/compare/0.13.0...0.13.1  
[0.13.0] https://github.com/hexancore/common/compare/0.12.5...0.13.0  
[0.12.5] https://github.com/hexancore/common/compare/0.12.4...0.12.5  
[0.12.4] https://github.com/hexancore/common/compare/0.12.3...0.12.4  
[0.12.3] https://github.com/hexancore/common/compare/0.10.4...0.12.3  
[0.10.4] https://github.com/hexancore/common/releases/tag/0.10.4
