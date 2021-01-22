---
title: Deployment Guide
date: 2021-01-20T17:41:08.000-03:00
weight: "2"
description: 'This guide will help you deploy SiteWhere 3.0.

'

---
# SiteWhere 3.0 Deployment Guide

This pages guides you in the deployment of SiteWhere 3.0 in a Kubernetes Cluster

## Prerequisites

* Kubernetes Cluster 1.16+
* [Istio](https://istio.io) 1.8+ Installed in your cluster. Check Istio setup [documentation](https://istio.io/latest/docs/setup/).
* [swctl](./swctl.md) v0.4.2 or later.

## Install SiteWhere 3.0 CE

SiteWhere 3.0 CE requieres it insfrastucture components installed on the Kubernetes cluster you are going to deploy your instances.
After you instanall SiteWhere insfrastucture components you can deploy one or more instances in the cluster.

To install SiteWhere insfrastucture components using **swctl**, execute the following command:

```command
swctl install
```

This command will install all the necesary components (i.e. SiteWhere CRDs, SiteWhere Templantes, SiteWhere Operator, etc) for
SiteWhere to deploy instances in your cluster. All these components will be allocated in the Namespace `sitewhere-system`, so
if you list the services in this Namespace, you should probably see something like this

```console
kubectl get svc -n sitewhere-system
NAME                                           TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)                         AGE
sitewhere-controller-manager-metrics-service   ClusterIP      10.103.64.231    <none>        8443/TCP                        14s
sitewhere-db-postgresql                        ClusterIP      10.99.148.185    <none>        5432/TCP                        14s
sitewhere-db-postgresql-headless               ClusterIP      None             <none>        5432/TCP                        14s
sitewhere-influxdb                             ClusterIP      10.107.148.206   <none>        8086/TCP,8088/TCP               14s
sitewhere-kafka-zookeeper-client               ClusterIP      10.96.61.25      <none>        2181/TCP                        2s
sitewhere-kafka-zookeeper-nodes                ClusterIP      None             <none>        2181/TCP,2888/TCP,3888/TCP      2s
sitewhere-keycloak-headless                    ClusterIP      None             <none>        80/TCP                          14s
sitewhere-keycloak-http                        ClusterIP      10.100.225.19    <none>        80/TCP,8443/TCP,9990/TCP        14s
sitewhere-mosquitto                            LoadBalancer   10.108.38.202    localhost     1883:30647/TCP,9001:30202/TCP   14s
sitewhere-nifi                                 LoadBalancer   10.111.174.142   localhost     9090:32690/TCP                  14s
sitewhere-nifi-headless                        ClusterIP      None             <none>        8080/TCP,6007/TCP               14s
sitewhere-postgresql                           ClusterIP      10.101.117.168   <none>        5432/TCP                        14s
sitewhere-postgresql-headless                  ClusterIP      None             <none>        5432/TCP                        14s
sitewhere-redis-headless                       ClusterIP      None             <none>        6379/TCP                        14s
sitewhere-redis-master                         ClusterIP      10.109.13.78     <none>        6379/TCP                        14s
sitewhere-zookeeper                            ClusterIP      10.109.163.117   <none>        2181/TCP                        14s
sitewhere-zookeeper-headless                   ClusterIP      None             <none>        2181/TCP,3888/TCP,2888/TCP      14s
```

After this step is completed, you need to create an **instance** to you cluster. To create an instance, use the command:

```command
swctl create instance [NAME] [flags]
```

For example, if we want to create an instance called `sitewhere`, we would need to execute:

```command
swctl create instance sitewhere
```

This command will create a Namespace with the same name of the instance, and the SiteWhere Operator
will create all the Kubernetes objects for the instance in this Namespace. After a few minutes,
you can query the cluster for the instance status using:

```command
kubectl get swi sitewhere
NAME        CONFIG    DATASET   TENANT MNG     USER MNG
sitewhere   default   default   Bootstrapped   Bootstrapped
```

You can also see that the microservices are created in the namespace `sitewhere` using

```command
kubectl get swm -n sitewhere
NAME                  AREA
asset-management      asset-management
batch-operations      batch-operations
command-delivery      command-delivery
device-management     device-management
device-registration   device-registration
device-state          device-state
event-management      event-management
event-sources         event-sources
inbound-processing    inbound-processing
instance-management   instance-management
label-generation      label-generation
outbound-connectors   outbound-connectors
schedule-management   schedule-management
```
