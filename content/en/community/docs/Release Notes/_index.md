---
title: Release Notes
linkTitle: Release Notes
weight: "100"
description: Track new features and bug fixes added in SiteWhere releases


---
#### [**SiteWhere 3.0.4**](https://github.com/sitewhere/sitewhere/releases/tag/v3.0.4) (Installable via [swctl 0.7.0](https://github.com/sitewhere/swctl/releases/tag/v0.7.0))


###### _Bugs Fixed_
* API call for getting asset type label fails with NPE ([#946](https://github.com/sitewhere/sitewhere/issues/946))
* Current cache implementation does not respect TTL value ([#945](https://github.com/sitewhere/sitewhere/issues/945))
* Query of zones for an area does not return correct results ([#941](https://github.com/sitewhere/sitewhere/issues/941))
* Calling API for ending an assignment results in 415 response when called from admin UI ([#944](https://github.com/sitewhere/sitewhere/issues/944))

---
#### [**SiteWhere 3.0.3**](https://github.com/sitewhere/sitewhere/releases/tag/v3.0.3) (Installable via [swctl 0.6.0](https://github.com/sitewhere/swctl/releases/tag/v0.6.0))

###### _Features_
* Support extra name/description metadata in SiteWhereInstance CRD ([#935](https://github.com/sitewhere/sitewhere/issues/935))

---
#### [**SiteWhere 3.0.2**](https://github.com/sitewhere/sitewhere/releases/tag/v3.0.2) (Installable via [swctl 0.4.4](https://github.com/sitewhere/swctl/releases/tag/v0.4.4))

###### _Bugs Fixed_
* MQTT outbound connector not properly using outbound topic configuration ([#932](https://github.com/sitewhere/sitewhere/issues/932))

---
#### [**SiteWhere 3.0.1**](https://github.com/sitewhere/sitewhere/releases/tag/v3.0.1) (Installable via [swctl 0.4.2](https://github.com/sitewhere/swctl/releases/tag/v0.4.2))

###### _Bugs Fixed_
* Instance management microservice not retrying when Keycloak not available ([#923](https://github.com/sitewhere/sitewhere/issues/923))
* Issues with Redis chart stability and client losing connectivity ([#924](https://github.com/sitewhere/sitewhere/issues/924))

---
#### [**SiteWhere 3.0.0**](https://github.com/sitewhere/sitewhere/releases/tag/v3.0.0)

###### _Features_
* Initial SiteWhere 3.0 release.
