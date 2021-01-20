---
title: SiteWhere Control CLI
linkTitle: SiteWhere Control CLI
date: 2021-01-20
description: 'This page describes the installation of **swctl**, the SiteWhere Control
  CLI.

'

---
SiteWhere Control CLI `swctl` is a client-side tool that let you control the installation of SiteWhere components in a Kubernetes Cluster and manage the lifecycle of SiteWhere Instances.

## Installation

### Linux install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.linux.amd64 -o swctl && \ 
    chmod +x ./swctl && sudo mv ./swctl /usr/local/bin/swctl

### macOS Install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.darwin.amd64 -o swctl && \
    chmod +x ./swctl && sudo mv ./swctl /usr/local/bin/swctl

### Windows Install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.windows.amd64.exe -o swctl.exe