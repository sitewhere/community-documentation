---
title: Guía de Configuración
linkTitle: Configuration Guide
weight: "3"
description: Configurar SiteWhere para procesar cargas de IoT
---
SiteWhere is a cloud-native platform designed to run on top of a Kubernetes infrastructure. As such, it uses Kubernetes [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for almost all aspects of configuration. There are multiple levels of configuration in the system including instance, microservice, and tenant configuration.

## Instance Configuration
A SiteWhere instance is the top-level construct in the deployment hierarchy and instance-level configuration applies to aspects which are shared by all of the services in the system. Common information such as connectivity details for shared Kafka and Redis instances are configured at the instance level and inherited by the services. Other shared information such as globally defined database connectivity parameters may be defined at the instance level and referenced by the services to prevent having to redefine the properties repeatedly.
