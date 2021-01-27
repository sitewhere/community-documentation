---
title: Deployment Guide
linkTitle: Deployment Guide
weight: "2"
description: 'Deploy SiteWhere infrastructure and instances to Kubernetes'

---
SiteWhere installation includes two steps, installation of the infrastructure and installation of instances which run on top of that infrastructure. The initial infrastructure installation deploys Kubernetes [custom resource definitions](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRDs) for the SiteWhere model, a set of resource templates that are used as the default configuration for the system, and a set of infrastructure components which serve as a platform for instances to run on. Multiple SiteWhere instances may be deployed on top of the common infrastructure, each instance composed of many microservices which handle processing for the instance based on a configuration customized for that instance.

## Prerequisites

* Kubernetes Cluster 1.16+
* [Istio](https://istio.io) 1.8+ Installed in your cluster. Check Istio setup [documentation](https://istio.io/latest/docs/setup/).
* [swctl](https://github.com/sitewhere/swctl) v0.4.2 or later.

## Install SiteWhere Infrastructure

SiteWhere requires that the Kubernetes model and infrastructure components are installed on the Kubernetes cluster before deploying instances. To install SiteWhere insfrastucture components using [swctl](./swctl/), execute the following command:

```command
swctl install
```

This command will install all the necessary infrastructure components including:
* SiteWhere CRDs
* SiteWhere configuration templates
* SiteWhere Kubernetes operator
* Apache Kafka
* PostgreSQL database
* InfluxDB database
* Redis cache
* Apache Nifi

These components will be allocated in the `sitewhere-system` namespace, so listing the services will result in something like this:

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

## Install SiteWhere Instance

After the infrastructure components have been successfully installed, you can add an **instance** to you cluster. To create an instance, use the command:

```command
swctl create instance [NAME] [flags]
```

For example, if we want to create an instance named `sitewhere`, we would need to execute:

```command
swctl create instance sitewhere
```

This command will create a namespace with the same name as the instance, and the SiteWhere operator will create all the Kubernetes objects for the instance in this namespace. After a few minutes, you can query the cluster for the instance status using:

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

If your cluster Istio Ingress URL is `http://mycluser:80`, for accessing this
instance you need to address `http://mycluser:80/sitewhere`.

To find the IP address of the Istio Ingress Gateway Host use:

```console
kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
````

or, if a hostname was assigned, use:

```console
kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## Delete SiteWhere Instance

To delete a SiteWhere instance from your cluster use the command: 

```command
swctl delete instance [NAME] [flags]
```

For example, if we want to delete the instance `sitewhere`, we would execute:

```command
swctl delete instance sitewhere
```

To delete all the data and extra resources, add `--purge` flag. This flag will delete the namespace `sitewhere` along with all of its resources.

## Uninstall SiteWhere Infrastructure

To uninstall SiteWhere insfrastucture components using `swctl`, execute the following command:

```command
swctl uninstall
```

To delete all the data and extra resources, add `--purge` flag. This flag will delete the Namespace `sitewhere-system` along with all its resources.
