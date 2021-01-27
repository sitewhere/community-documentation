---
title: Descripción de la Plataforma
linkTitle: Descripción de la Plataforma
weight: "1"
description: Comprender la arquitectura de la plataforma SiteWhere y el modelo de implementación

---

SiteWhere is a cloud native application enablement platform (AEP) for the Internet of Things. The platform is designed to deploy and manage both the infrastructure elements (i.e. MQTT brokers, databases, etc) and the services that run on the infrastructure (e.g. device management, event processing, etc). SiteWhere is intended to address the core needs of various IoT vertical markets such as smart cities, healthcare, IIoT, and many others.

## Cloud Native Approach
SiteWhere is implemented as a [cloud native](https://docs.microsoft.com/en-us/dotnet/architecture/cloud-native/definition) platform and is deployed on top of [Kubernetes](https://kubernetes.io/), allowing it to run on almost any cloud or on-premise. 

### Kubernetes Integration
Most aspects of the system are designed to work much like the core Kubernetes tooling and resource model. Just as Kubernetes has custom resources such as `Pod` and `Service`, SiteWhere has its own custom resources such as `SiteWhereInstance` and `SiteWhereMicroservice`. Just as Kubernetes has `kubectl` for interacting with its core resource model, SiteWhere has `swctl` which allows clusters to be configured and instances to be launched using a simple CLI. Just as Kubernetes has controllers that manage its resources at runtime, SiteWhere has its own controllers which handle deployment of the core runtime components needed to realize SiteWhere instances.

### Microservice Deployment Model
Rather than implementing SiteWhere as a monolothic application, the platform has been split into a collection of [microservices](https://martinfowler.com/articles/microservices.html), each of which performs a specific task in the system and which may be scaled independently of other services. Each microservice takes care of a specific functional area and has its own independent configuration model, exposed APIs, persistence model, and other characteristics. 

### Istio Service Mesh Infrastructure
SiteWhere is designed to run on top of the [Istio](https://istio.io/) service mesh which enhances the capabilities of the system by supporting the ability to secure, observe and control microservice interactions. SiteWhere automatically creates a `Gateway` for each cluster and `VirtualService` resources for each deployed instance in order to integrate with the Istio ingress gateway. Other Istio constructs may be used to dynamically affect microservice behavior or support aspects such as distributed tracing.

## Messaging Infrastructure
Data flows through SiteWhere via a messaging bus implemented on top of [Apache Kafka](https://kafka.apache.org/) and [Kafka Streams](https://kafka.apache.org/documentation/streams/). Data flows between microservices through multiple durable pipelines that ensure no messages are lost between processing steps even if microservices fail. Kafka's pub/sub architecture and support for group subscriptions allow SiteWhere microservices to be dynamically scaled at runtime as the system load increases or decreases. The Kafka infrastructure also allows external applications to interact with real-time system events at various steps in the pipeline.

## Normalized model and Data Persistence
SiteWhere has a core data model which represents key entities such as devices, device types, assets, and device events. This model is made available as a [Java API](https://github.com/sitewhere/sitewhere-java-api) which may be reused across other applications and tooling. 

### Relational vs Time Series Data
The platform provides the ability to persist the runtime data into various databases depending on the type of data being stored. Data for the device management model tends to be relational in nature, so persistence of that data supports many standard relational databases. Device event data lends itself to a time series representation, so persistence of that data supports commonly used time series databases.

## Multitenancy
Support for multiple tenants running on the same platform instance is a key requirement of many IoT applications. Running separate infrastructure and services for each tenant quickly becomes cost-prohibitive and hard to manage. SiteWhere supports multitenancy on many levels depending on the requirements of the application. 

### Tenant Engines
SiteWhere tenants run in isolated tenant engines that execute separately within the microservices and do not share data. Each tenant of a microservice may be configured independently based on its specific requirements. Tenant engines may be reconfigured at runtime and started/stopped independently of other tenant engines. This allows for tenants to be dynamically reconfigured without affecting other tenants running in the same microservice container. Since tenant engines are specific to a given microservice, restarting a tenant engine for one microservice does not affect tenant engines for the tenant on other microservices.

### Data Isolation
Tenants can use separate database instances or even different database types. They can also be configured to coexist in the same database instance while still using separate logical databases. Tenants do not share data pipelines, but rather have separate Kafka topics that ensure that data is never comingled. This approach allows multiple tenants to run in the same microservice container, but with guarantees that no tenants can interact with data from other tenants.

### Customers vs Tenants
Having dedicated resources for tenants can be expensive in terms of memory and processing resources, so SiteWhere also offers the concept of customers within each tenant. Customers allow data to be differentiated within a tenant, but without having a separate dedicated database and pipelines. In cases where colocated data is acceptable, the tenant can have any number of customers, which share the same database and processing pipeline. This allows the best of both worlds in terms of security and scalability.

## Identity Management
Managing authentication and authorization for system users is complex and error-prone when writing an implementation from scratch. Rather than reinventing the wheel, SiteWhere delegates identity management to [Keycloak](https://www.keycloak.org/). Keycloak is a full-featured, hardened identity and access management system that is used by many large companies.

The SiteWhere cluster infrastructure includes a Keycloak instance and each SiteWhere instance in a cluster can have its own Keycloak realm and associated users. Instances may also be configured to share realms in order to have a common set of users across instances. Using Keycloak allows third-party applications to use SiteWhere as in identity provider via protocols such as OpenID Connect. This supports easy implementation of single sign-on for applications running on top of the SiteWhere platform.

