---
title: Guía de Configuración
linkTitle: Guía de Configuración
weight: "3"
description: Configurar SiteWhere para procesar cargas de IoT
---
SiteWhere es una plataforma nativa de la nube diseñada para ejecutarse sobre una infraestructura de Kubernetes. Como tal, utiliza Kubernetes [recursos personalizados] (https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/) para casi todos los aspectos de la configuración. Hay varios niveles de configuración en el sistema, incluida la configuración de instancias, microservicios y arrendatarios (tenants).

## Configuración de Instancias

Una instancia de SiteWhere es la construcción de nivel superior en la jerarquía de implementación y la configuración a nivel de instancia se aplica a los aspectos que son compartidos por todos los servicios del sistema. La información común, como los detalles de conectividad para instancias compartidas de Kafka y Redis, se configura a nivel de instancia y los servicios la heredan. Otra información compartida, como los parámetros de conectividad de la base de datos definidos globalmente, puede definirse a nivel de instancia y ser referenciada por los servicios para evitar tener que redefinir las propiedades repetidamente.
