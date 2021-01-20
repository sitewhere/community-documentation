---
title: SiteWhere Control CLI
linkTitle: SiteWhere Control CLI
date: 2021-01-20
description: 'This page describes the installation of **swctl**, the SiteWhere Control
  CLI.

'

---
SiteWhere Control CLI `swctl` is a client-side tool that let you control the installation of SiteWhere components in a Kubernetes Cluster and manage the lifecycle of SiteWhere Instances.

## Prerequistes

* Kubernetes Cluster 1.16+
* [Istio](https://istio.io) 1.8+ Installed in your cluster. Check Istio setup [documentation](https://istio.io/latest/docs/setup/).

If run into docker pull image request limit, use the following command

```command
istioctl install -y --set hub=gcr.io/istio-release
```

## Installation

### Linux install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.linux.amd64 -o swctl && \ 
    chmod +x ./swctl && sudo mv ./swctl /usr/local/bin/swctl

### macOS Install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.darwin.amd64 -o swctl && \
    chmod +x ./swctl && sudo mv ./swctl /usr/local/bin/swctl

### Windows Install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.windows.amd64.exe -o swctl.exe

## Commands

This is the list of available commands of **swctl**.

* install: install SiteWhere CRD and Operators.
* uninstall: uninstall SiteWhere CRD and Operators.
* create instance: create an instance.
* create tenant: create a tenant for an instance.
* delete instance: delete an instance.
* delete tenant: delete a tenant for an instance.
* version: print the swctl version information.

### install

Use this command to install SiteWhere 3.0 on a Kubernetes Cluster.
This command will install:

* SiteWhere System Namespace: `sitewhere-system`.
* SiteWhere Custom Resources Definition.
* SiteWhere Templates.
* SiteWhere Operator.
* SiteWhere Infrastructure.

```command
Usage:
  swctl install [flags]

Flags:
  -h, --help             help for install
  -o, --output format    prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --skip-crd         Skip Custom Resource Definition installation.
      --skip-infra       Skip Infrastructure installation.
      --skip-operator    Skip Operator installation.
      --skip-templates   Skip Templates installation.
  -w, --wait             Wait for components to be ready before return control.
````

This is an example of the output produced by the command `swctl install`

```command
COMPONENT                       STATUS   
Custom Resource Definitions     Installed
Templates                       Installed
Operator                        Installed
Infrastructure                  Installed
SiteWhere 3.0 Installed
```

This means that **swctl** has install the core components of SiteWhere CE 3.0 on your Kubernetes cluster. 
These components are created under the Namepace `sitewhere-system`.

### uninstall

Uninstall SiteWhere from your Kubernetes Cluster.
This command will uninstall:

* SiteWhere System Namespace: `sitewhere-system`.
* SiteWhere Custom Resources Definition.
* SiteWhere Templates.
* SiteWhere Operator.
* SiteWhere Infrastructure.

```command
Usage:
  swctl uninstall [flags]

Flags:
  -h, --help            help for uninstall
  -o, --output format   prints the output in the specified format. Allowed values: table, json, yaml (default table)
  -p, --purge           Purge data.
```

This is an example of the output produced by the command `swctl uninstall`

```command
SiteWhere 3.0 Uninstalled
```

This means that **swctl** has uninstall the core components of SiteWhere CE 3.0 from your Kubernetes cluster.
If the `--purge` flags has been used, the Namepace `sitewhere-system` would have beed removed too.
