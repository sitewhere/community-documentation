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

