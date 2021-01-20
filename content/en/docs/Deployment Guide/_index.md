---
title: Deployment Guide
date: 2021-01-20T17:41:08.000-03:00
weight: "2"
description: 'This guide will help you deploy SiteWhere 3.0.

'

---
SiteWhere Control CLI `swctl` is a client-side tool that let you control the installation of SiteWhere components in a Kubernetes Cluster and manage the lifecycle of SiteWhere Instances.

## Installation

### Linux install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.linux.amd64 -o swctl && \ 
    chmod +x ./swctl && sudo mv ./swctl /usr/local/bin/swctl

### macOS Install

\`\`\`bash

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.darwin.amd64 -o swctl && \
    chmod +x ./swctl && sudo mv ./swctl /usr/local/bin/swctl

### Windows Install

    curl -L https://github.com/sitewhere/swctl/releases/latest/download/swctl.windows.amd64.exe -o swctl.exe