---
title: Microservices Guide
linkTitle: Microservices Guide
weight: "4"
description: 'Configure SiteWhere Instances and Microservices to Handle IoT Workloads'

---

## Instances and Microservices
An instance is the primary deployment unit for running SiteWhere. Each instance is implemented as a set of microservices which perform specific processing tasks related to IoT workloads. The microservices are not intended to run as standalone entites since they require some coordination in order to work together to accomplish tasks.

{{% alert title="Infrastructure Dependencies" color="primary" %}}
Note that SiteWhere microservices expect certain infrastructure services to already be running. Before creating a new instance, run `swctl install` in order to create the required infrastructure services. The microservices will generally wait for the underlying services (e.g. Keycloak identity management or Kafka Streams processing) to become available and can not fully start without these services.
{{% /alert %}}

## Instance Lifecycle
A new instance can be created using the SiteWhere command CLI by issuing a command such as:

```
swctl create instance sitewhere
```
where `sitewhere` is the instance name to be created. The CLI creates a `SiteWhereInstance` custom resource based on the default settings for the tooling. Included in the `SiteWhereInstance` custom resource is the list of microservices (or more specifically the microservice specification metadata) for all the microservices to be deployed in the instance. The default list of microservices to be deployed can be configured in the `.swctl/default.yaml` configuration file stored in the user directory.

### Instance Namespace
While `SiteWhereInstance` custom resources have cluster scope, all other Kubernetes resources for a SiteWhere instance are scoped to a namespace which is set to the instance name. Creating an instance via `swctl create instance sitewhere` will result in a namespace `sitewhere` being created.

### SiteWhere Operator
The [SiteWhere Kubernetes Operator](https://github.com/sitewhere/sitewhere-k8s-operator) is installed as part of the `swctl install` process and is responsible for managing the custom resources associated with SiteWhere instances. The operator takes care of many tasks for `SiteWhereInstance` resources such as:
* Creating the instance namespace
* Creating `SiteWhereMicroservice` resources for the list of specs in the `microservices` section of the spec.
* Creating an Istio `VirtualService` resource that handles routing to the REST APIs and other externally exposed resources on the instance

After the list of `SiteWhereMicroservice` resources are created for the instance, the operator also handles:
* Creating a Kubernetes `Deployment` for launching the pods for the microservice
* Creating a Kubernetes `Service` used to expose microservice functionality externally (e.g. REST APIs and gRPC APIs)

## Microservice Lifecycle
When `SiteWhereMicroservice` resources are created, the SiteWhere Kubernetes Operator creates `Deployment` resources which in turn create `Pod` resources that execute the microservice code. All of the core SiteWhere microservices are built on top of a [common microservice library](https://github.com/sitewhere/sitewhere-microservice-core) made available in an independent code repository. The microservices are written in [Java](https://go.java/) and are built on top of the [Quarkus](https://quarkus.io/) stack in order to support smaller memory footprints and faster service startup times.

{{% alert title="Native Images" color="primary" %}}
Note that the initial SiteWhere v3.0 release does not use Quarkus native image support, but rather uses the [GraalVM](https://www.graalvm.org/) Docker image to initially support the microservice runtime. Future releases will move to native images for all core microservices which will lower the memory footprint and speed up the bootstrapping of services.
{{% /alert %}}