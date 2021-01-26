---
title: Kubernetes Custom Resources
linkTitle: Kubernetes Custom Resources
weight: "3"
description: Define Kubernetes Custom Resources to Configure SiteWhere Components
---
SiteWhere uses Kubernetes [custom resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) for almost all aspects of configuration. When the custom resources are added/updated/deleted, the SiteWhere Kubernetes operator reacts to the changes in order to realize the components at runtime. The core SiteWhere custom resource model is documented below.

## `SiteWhereInstance`
> Declare and Configure a SiteWhere Instance

This custom resource is scoped at the cluster level and defines properties of a SiteWhere instance including:
* **Instance Id** - Unique name for the instance which is also used as the Kubernetes `Namespace` for all components in the instance. 
* **Configuration Template** - Reference to an `InstanceConfigurationTemplate` which contains the instance configuration that will be loaded into the instance when it is initially created.
* **Dataset Template** - Reference to an `InstanceDatasetTemplate` which has scripts that are used to bootstrap the new instance. This includes populating the initial list of users and creating any default tenants in the system.
* **Configuration** - The active configuration data for the instance. This data is initially copied from the configuration template, but may be edited directly via yaml or via the SiteWhere administrative user interface.
* **Docker Spec** - Default Docker settings used if not specified at the microservice level. This allows aspects such as the Docker repository and microservice version identifier to be set globally and overridden locally in the services.
* **Microservices** - The list of microservice specifications that will be managed by the instance. Each entry has the same content as the `spec` section of the declaration of a `SiteWhereMicroservice`. The SiteWhere operator automatically creates `SiteWhereMicroservice` resources for each entry in this list.

### Istio Ingress for Instances
When a `SiteWhereInstance` resource is added, the SiteWhere operator automatically creates an Istio `VirtualService` that routes a subpath of the ingress gateway to the REST APIs made available by the `instance-management` microservice. It also exposes the OpenAPI spec and Swagger UI for interacting with the REST APIs for the instance.

### Common `kubectl` Commands for Instances
The `kubectl` CLI may be used to interact with the `SiteWhereInstance` resources in a cluster. Below are some commonly used commands:

#### List Instances in a Cluster
`kubectl get swi` or `kubectl get instances`

```console
NAME        CONFIG    DATASET   TENANT MNG     USER MNG
sitewhere   default   default   Bootstrapped   Bootstrapped
```

### Instance YAML
Below is an example of the yaml format of a `SiteWhereInstance`:
```yaml
apiVersion: sitewhere.io/v1alpha4
kind: SiteWhereInstance
metadata:
  creationTimestamp: "2021-01-26T17:18:15Z"
  generation: 2
  managedFields: {}
  name: sitewhere
  resourceVersion: "54134856"
  selfLink: /apis/sitewhere.io/v1alpha4/instances/sitewhere
  uid: 7c98450b-8b6e-4c8e-8926-4684611366f0
spec:
  configuration:
    infrastructure:
      grpc:
        backoffMultiplier: 1.5
        initialBackoffSeconds: 10
        maxBackoffSeconds: 600
        maxRetryCount: 6
        resolveFQDN: false
      kafka:
        defaultTopicPartitions: 8
        defaultTopicReplicationFactor: 3
        hostname: sitewhere-kafka-kafka-bootstrap
        port: 9092
      metrics:
        enabled: true
        httpPort: 9090
      namespace: sitewhere-system
      redis:
        hostname: sitewhere-redis-headless.sitewhere-system
        port: 6379
    persistenceConfigurations:
      rdbConfigurations:
        postgres:
          configuration:
            hostname: sitewhere-db-postgresql.sitewhere-system
            maxConnections: 5
            password: sitewhere
            port: 5432
            username: sitewhere
          type: postgres95
      timeSeriesConfigurations:
        influxdb:
          configuration:
            databaseName: tenant_${tenant.id}
            hostname: sitewhere-influxdb.sitewhere-system
            port: 8086
          type: influxdb
  configurationTemplate: default
  datasetTemplate: default
  dockerSpec:
    registry: docker.io
    repository: sitewhere
    tag: 3.0.1
  microservices:
  - debug:
      jdwpPort: 8006
      jmxPort: 1106
    description: Provides APIs for managing assets associated with device assignments
    functionalArea: asset-management
    icon: devices_other
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.asset
    multitenant: true
    name: Asset Management
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8011
      jmxPort: 1111
    description: Handles processing of operations which affect a large number of devices
    functionalArea: batch-operations
    icon: view_module
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.batch
    multitenant: true
    name: Batch Operations
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8012
      jmxPort: 1112
    description: Manages delivery of commands in various formats based on invocation
      events
    functionalArea: command-delivery
    icon: call_made
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.commands
    multitenant: true
    name: Command Delivery
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8004
      jmxPort: 1104
    description: Provides APIs for managing the device object model
    functionalArea: device-management
    icon: developer_board
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.device
    multitenant: true
    name: Device Management
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8013
      jmxPort: 1113
    description: Handles registration of new devices with the system
    functionalArea: device-registration
    icon: add_box
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.registration
    multitenant: true
    name: Device Registration
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8014
      jmxPort: 1114
    description: Provides device state management features such as device shadows
    functionalArea: device-state
    icon: warning
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.devicestate
    multitenant: true
    name: Device State
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8005
      jmxPort: 1105
    description: Provides APIs for persisting and accessing events generated by devices
    functionalArea: event-management
    icon: dynamic_feed
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.event
    multitenant: true
    name: Event Management
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8008
      jmxPort: 1108
    description: Handles inbound device data from various sources, protocols, and
      formats
    functionalArea: event-sources
    icon: forward
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.sources
    multitenant: true
    name: Event Sources
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8007
      jmxPort: 1107
    description: Common processing logic applied to enrich and direct inbound events
    functionalArea: inbound-processing
    icon: input
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.inbound
    multitenant: true
    name: Inbound Processing
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - configuration:
      userManagement:
        jwtExpirationInMinutes: 60
        syncopeHost: sitewhere-syncope.sitewhere-system.cluster.local
        syncopePort: 8080
    debug:
      jdwpPort: 8001
      jmxPort: 1101
    description: Handles APIs for managing global aspects of an instance
    functionalArea: instance-management
    icon: language
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.instance
      - level: info
        logger: com.sitewhere.web
    name: Instance Management
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
      - containerPort: 8080
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      - name: http-rest
        port: 8080
        protocol: TCP
        targetPort: 8080
      type: ClusterIP
  - debug:
      jdwpPort: 8009
      jmxPort: 1109
    description: Supports generating labels such as bar codes and QR codes for devices
    functionalArea: label-generation
    icon: label
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.labels
    multitenant: true
    name: Label Generation
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8016
      jmxPort: 1116
    description: Allows event streams to be delivered to external systems for additional
      processing
    functionalArea: outbound-connectors
    icon: label
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.connectors
    multitenant: true
    name: Outbound Connectors
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
  - debug:
      jdwpPort: 8018
      jmxPort: 1118
    description: Supports scheduling of various system operations
    functionalArea: schedule-management
    icon: label
    logging:
      overrides:
      - level: info
        logger: com.sitewhere
      - level: info
        logger: com.sitewhere.grpc.client
      - level: info
        logger: com.sitewhere.microservice.grpc
      - level: info
        logger: com.sitewhere.microservice.kafka
      - level: info
        logger: org.redisson
      - level: info
        logger: com.sitewhere.asset
      - level: info
        logger: com.sitewhere.schedule
    multitenant: true
    name: Schedule Management
    podSpec:
      dockerSpec:
        registry: docker.io
        repository: sitewhere
        tag: 3.0.1
      env:
      - name: sitewhere.config.k8s.name
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.name
      - name: sitewhere.config.k8s.namespace
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: metadata.namespace
      - name: sitewhere.config.k8s.pod.ip
        valueFrom:
          fieldRef:
            apiVersion: v1
            fieldPath: status.podIP
      - name: sitewhere.config.product.id
        value: sitewhere
      - name: sitewhere.config.keycloak.service.name
        value: sitewhere-keycloak-http
      - name: sitewhere.config.keycloak.api.port
        value: "80"
      - name: sitewhere.config.keycloak.realm
        value: sitewhere
      - name: sitewhere.config.keycloak.master.realm
        value: master
      - name: sitewhere.config.keycloak.master.username
        value: sitewhere
      - name: sitewhere.config.keycloak.master.password
        value: sitewhere
      - name: sitewhere.config.keycloak.oidc.secret
        valueFrom:
          secretKeyRef:
            key: client-secret
            name: sitewhere
      imagePullPolicy: IfNotPresent
      ports:
      - containerPort: 9000
        protocol: TCP
      - containerPort: 9090
        protocol: TCP
    replicas: 1
    serviceSpec:
      ports:
      - name: grpc-api
        port: 9000
        protocol: TCP
        targetPort: 9000
      - name: http-metrics
        port: 9090
        protocol: TCP
        targetPort: 9090
      type: ClusterIP
status:
  tenantManagementBootstrapState: Bootstrapped
  userManagementBootstrapState: Bootstrapped
```

## `SiteWhereMicroservice`
> Declare and Configure a SiteWhere Microservice within an Instance

This custom resource is scoped at the instance namespace level and defines properties of a SiteWhere microservice including:
* **Name** - Name displayed in user interfaces when referencing the microservice. 
* **Description** - A short description of functionality provided by the service.
* **Functional Area** - Short name used internally for resource naming. Should be unique across all microservices.
* **Icon** - Icon displayed in user interfaces for the microservice.
* **Multitenant** - Flag for whether the given microservice has multitenant capabilities.
* **Pod Spec** - The `Pod` specification that will be used when creating a `Deployment` for the microservice.
* **Replicas** - The number of replicas which will be used by the `Deployment` for the microservice.
* **Service Spec** - The `Service` specification used when making the microservice available to external entities.
* **Logging** - Logger settings that will be applied to the service to affect which content is included in the microservice logs.
* **Debug** - Debugger settings used to expose ports for external debuggers to connect to.

### Microservice Resource Lifecycle
The `SiteWhereMicroservice` resource is not normally created manually, but rather as a side-effect of an instance being deployed. The `SiteWhereInstance` resource contains a list of microservice metadata which is used by the operator to create all of the microservices associated with the instance. When a `SiteWhereMicroservice` resource is added, the SiteWhere operator takes care of creating the Kubernetes `Deployment` and `Service` based on metadata from the microservice spec. This is intended to work much like the relationship of `Deployment` that create `Pod` resources based on the pod spec in the deployment.

### Common `kubectl` Commands for Microservices
The `kubectl` CLI may be used to interact with the `SiteWhereMicroservice` resources. Below are some commonly used commands:

#### List Microservices in an Instance
`kubectl -n sitewhere get swm` or `kubectl -n sitewhere get microservices`. Note that namespace is required in order to limit the microservices returned to a specific instance.

```console
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

### Microservice YAML
Below is an example of the yaml format of a `SiteWhereMicroservice`:
```yaml
apiVersion: sitewhere.io/v1alpha4
kind: SiteWhereMicroservice
metadata:
  creationTimestamp: "2021-01-26T17:18:15Z"
  generation: 1
  labels:
    sitewhere.io/functional-area: asset-management
    sitewhere.io/instance: sitewhere
  managedFields: {}
  name: asset-management
  namespace: sitewhere
  ownerReferences:
  - apiVersion: sitewhere.io/v1alpha4
    blockOwnerDeletion: true
    controller: true
    kind: SiteWhereInstance
    name: sitewhere
    uid: 7c98450b-8b6e-4c8e-8926-4684611366f0
  resourceVersion: "54134283"
  selfLink: /apis/sitewhere.io/v1alpha4/namespaces/sitewhere/microservices/asset-management
  uid: 6203b362-36d4-4ece-9ebc-2cf43898e77a
spec:
  debug:
    jdwpPort: 8006
    jmxPort: 1106
  description: Provides APIs for managing assets associated with device assignments
  functionalArea: asset-management
  icon: devices_other
  logging:
    overrides:
    - level: info
      logger: com.sitewhere
    - level: info
      logger: com.sitewhere.grpc.client
    - level: info
      logger: com.sitewhere.microservice.grpc
    - level: info
      logger: com.sitewhere.microservice.kafka
    - level: info
      logger: org.redisson
    - level: info
      logger: com.sitewhere.asset
    - level: info
      logger: com.sitewhere.asset
  multitenant: true
  name: Asset Management
  podSpec:
    dockerSpec:
      registry: docker.io
      repository: sitewhere
      tag: 3.0.1
    env:
    - name: sitewhere.config.k8s.name
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.name
    - name: sitewhere.config.k8s.namespace
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: metadata.namespace
    - name: sitewhere.config.k8s.pod.ip
      valueFrom:
        fieldRef:
          apiVersion: v1
          fieldPath: status.podIP
    - name: sitewhere.config.product.id
      value: sitewhere
    - name: sitewhere.config.keycloak.service.name
      value: sitewhere-keycloak-http
    - name: sitewhere.config.keycloak.api.port
      value: "80"
    - name: sitewhere.config.keycloak.realm
      value: sitewhere
    - name: sitewhere.config.keycloak.master.realm
      value: master
    - name: sitewhere.config.keycloak.master.username
      value: sitewhere
    - name: sitewhere.config.keycloak.master.password
      value: sitewhere
    - name: sitewhere.config.keycloak.oidc.secret
      valueFrom:
        secretKeyRef:
          key: client-secret
          name: sitewhere
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 9000
      protocol: TCP
    - containerPort: 9090
      protocol: TCP
  replicas: 1
  serviceSpec:
    ports:
    - name: grpc-api
      port: 9000
      protocol: TCP
      targetPort: 9000
    - name: http-metrics
      port: 9090
      protocol: TCP
      targetPort: 9090
    type: ClusterIP
status:
  deployment: asset-management
  services:
  - asset-management
```
