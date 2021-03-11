---
title: SiteWhere Control CLI
linkTitle: SiteWhere Control CLI
date: 2021-01-20
description: "Install `swctl`, the SiteWhere Control CLI to manage SiteWhere deployments"
---

SiteWhere Control CLI `swctl` is a client-side tool that let you control the installation of SiteWhere components in a Kubernetes Cluster and manage the lifecycle of SiteWhere Instances.

## Prerequistes

- Kubernetes Cluster 1.16+
- [Istio](https://istio.io) 1.8+ Installed in your cluster. Check Istio setup [documentation](https://istio.io/latest/docs/setup/).

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

- install: install SiteWhere CRD and Operators.
- uninstall: uninstall SiteWhere CRD and Operators.
- create instance: create an instance.
- create tenant: create a tenant for an instance.
- delete instance: delete an instance.
- delete tenant: delete a tenant for an instance.
- version: print the swctl version information.

### install

Use this command to install SiteWhere 3.0 on a Kubernetes Cluster.
This command will install:

- SiteWhere System Namespace: `sitewhere-system`.
- SiteWhere Custom Resources Definition.
- SiteWhere Templates.
- SiteWhere Operator.
- SiteWhere Infrastructure.

```command
Usage:
  swctl install [flags]

Flags:
      --chart-version string    SiteWhere Infrastructure Helm Chart version to use. (default "0.1.10")
  -h, --help                    help for install
      --kafka-pvc-size string   Kafka PVC Storage Size.
  -m, --minimal                 Install minimal infrastructure.
  -o, --output format           prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --skip-crd                Skip Custom Resource Definition installation.
      --skip-infra              Skip Infrastructure installation.
      --skip-operator           Skip Operator installation.
      --skip-templates          Skip Templates installation.
  -s, --storage-class string    Storage Class of infrastructure components.
  -w, --wait                    Wait for components to be ready before return control.
```

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

- SiteWhere System Namespace: `sitewhere-system`.
- SiteWhere Custom Resources Definition.
- SiteWhere Templates.
- SiteWhere Operator.
- SiteWhere Infrastructure.

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

### create instance

Use this command to create an Instance of SiteWhere.
For example, to create an instance with name "sitewhere" use:

swctl create instance sitewhere

To create an instance with the minimal profile use:

```command
swctl create instance sitewhere -m
```

```command
Usage:
  swctl create instance [NAME] [flags]

Flags:
  -c, --config-template string    Configuration template. (default "default")
  -x, --dateset-template string   Dataset template. (default "default")
  -d, --debug                     Debug mode.
  -h, --help                      help for instance
  -m, --minimal                   Minimal installation.
  -n, --namespace string          Namespace of the instance.
  -o, --output format             prints the output in the specified format. Allowed values: table, json, yaml (default table)
      --registry string           Docker image registry. (default "docker.io")
  -r, --replicas int32            Number of replicas (default 1)
      --skip-istio-inject         Skip Istio Inject namespace label.
  -t, --tag string                Docker image tag. (default "latest")
```

This is an example of the output produced by the command `swctl create instance sitewhere`.

```command
INSTANCE        STATUS
sitewhere       Installed
```

This means that **swctl** has create an instace named `sitewhere`. All the resources for this instance will
be create under the Namespace `sitewhere`. Also the URL path for accessing the instance will be `sitewhere`. So,
if your cluster Istio Ingress URL is `http://mycluser:80`, for accessing this instance you need to address `http://mycluser:80/sitewhere`.

To find the IP address of the Istio Ingress Gateway Host use:

```console
kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

or, if a hostname was assigned, use:

```console
kubectl get svc istio-ingressgateway -n istio-system -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

### create tenant

Use this command to create a Tenant in SiteWhere Instance.

```command
Usage:
  swctl create tenant [NAME] [flags]

Flags:
  -t, --authenticationToken string     AuthenticationToken
  -u, --authorizedUserIds strings      Authorized User Ids
  -c, --configurationTemplate string   Configuration Template (default "default")
  -d, --datasetTemplate string         Dataset Template (default "construction")
  -h, --help                           help for tenant
  -i, --instance string                Instance name
  -o, --output format                  prints the output in the specified format. Allowed values: table, json, yaml (default table)
```

For example, to create a tenant with name `tenant2` in the instance `sitewhere` use:

```command
swctl create tenant tenant2 --instance=sitewhere
```

### delete instance

Use this command to delete a SiteWhere Instance. Use can use purge flag to remove the namespace of the instance.

```command
Usage:
  swctl delete instance [NAME] [flags]

Flags:
  -h, --help            help for instance
  -o, --output format   prints the output in the specified format. Allowed values: table, json, yaml (default table)
  -p, --purge           Purge instance.
```

### delete tenant

Use this command to delete a Tenant of a SiteWhere Instance.

```command
Usage:
  swctl delete tenant [NAME] [flags]

Flags:
  -h, --help              help for tenant
  -i, --instance string   Instance name
  -o, --output format     prints the output in the specified format. Allowed values: table, json, yaml (default table)
```

For example, to delete a tenant with name `tenant2` for instance `sitewhere` use:

```command
swctl delete tenant tenant2 --instance=sitewhere
```

### logs

Use this command to show the logs of a SiteWhere Microservice.

```command
Usage:
  swctl logs [OPTIONS] INSTANCE MS [flags]

Flags:
  -f, --follow   Specify if the logs should be streamed.
  -h, --help     help for logs
```

For example, to show the logs of `asset-management` for instance `sitewhere` use:

```command
swctl logs sitewhere asset-management
```

### log-level

Use this command to show the logs of a SiteWhere Microservice.

```command
Usage:
  swctl log-level INSTANCE MS LEVEL [OPTIONS] [flags]

Aliases:
  log-level, ll

Flags:
  -h, --help                 help for log-level
      --logger stringArray   set loggers to change
```

For example, to change the log level of `asset-management` for instance `sitewhere` to `debug` use:

```command
swctl log-level sitewhere asset-management debug
```

### completion

Generate autocompletion scripts for SiteWhere Control CLI for the specified shell.

```command
Usage:
  swctl completion [command]

Available Commands:
  bash        generate autocompletion script for bash
  fish        generate autocompletion script for fish
  powershell  generate autocompletion script for powershell
  zsh         generate autocompletion script for zsh

Flags:
  -h, --help              help for tenant
```

### completion bash

Generate the autocompletion script for SiteWhere Control CLI for the bash shell.

To load completions in your current shell session:

```console
source <(swctl completion bash)
```

To load completions for every new session, execute once:
Linux:

```console
swctl completion bash > /etc/bash_completion.d/swctl
```

MacOS:

```console
swctl completion bash > /usr/local/etc/bash_completion.d/swctl
```

### completion fish

Generate the autocompletion script for SiteWhere Control CLI for the fish shell.

To load completions in your current shell session:

```console
swctl completion fish | source
```

To load completions for every new session, execute once:

```console
swctl completion fish > ~/.config/fish/completions/swctl.fish
```

You will need to start a new shell for this setup to take effect.

### completion powershell

Generate the autocompletion script for SiteWhere Control CLI for PowerShell.

To load completions in your current shell session:

```console
swctl.exe completion powershell | Out-String | Invoke-Expression
```

To load completions for every new session, execute once:

```console
swctl.exe completion powershell > swctl.exe.ps1
```

and source this file from your PowerShell profile.

### completion zsh

Generate the autocompletion script for SiteWhere Control CLI for the zsh shell.

To load completions in your current shell session:

```console
source <(swctl completion zsh)
```

To load completions for every new session, execute once:

```console
swctl completion zsh > "${fpath[1]}/_swctl"
```

### version

Version will output the current build information of **swctl**.

```command
Usage:
  swctl version [flags]

Flags:
  -h, --help              help for version
      --short             print the version number
      --template string   template for version string format
```

This is an example of the output produced by the command `swctl version`.

```command
version.BuildInfo{Version:"v0.4.1", GitCommit:"26f97df7bd9f124d8e2c2f76d6ed0829bc4cc4c9", GitTreeState:"dirty", GoVersion:"go1.15.7"}
```
