{{/*
Expand the name of the chart.
*/}}
{{- define "api.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "api.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "api.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "api.labels" -}}
helm.sh/chart: {{ include "api.chart" . }}
{{ include "api.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "api.selectorLabels" -}}
app.kubernetes.io/name: {{ include "api.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app: {{ include "api.fullname" . }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "api.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "api.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Service Annotations
*/}}
{{- define "api.serviceAnnotations" }}
service.beta.kubernetes.io/aws-load-balancer-type: nlb
service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
service.beta.kubernetes.io/aws-load-balancer-internal: 0.0.0.0/0
{{- end }}


{{/*
Service Annotations for external load balancing
*/}}
{{- define "api.serviceAnnotationsExternal" }}
service.beta.kubernetes.io/aws-load-balancer-type: nlb
service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled: "true"
# service.beta.kubernetes.io/aws-load-balancer-ssl-cert: {{ .Values.certArn }}
{{- end }}

{{/*
Annotations for docker-desktop cluster mode
*/}}
{{- define "annotations.dockerDesktop" }}
hello: yes
{{- end }}

{{/*
Produce the absolute path of the repo
*/}}
{{- define "api.repoPath" -}}
{{- printf "%s/%s" .Values.env.PROJECT_ROOT_PATH .Values.env.REPO_SUBPATH -}}
{{- end }}

# {{/* 
# Produce the absolute path for the repo certificates
# */}}
# {{- define "api.certsPath" -}}
# {{ printf "%s/%s" (include "api.repoPath" .) .Values.env.CERTS_SUBPATH }}
# {{- end }}

{{/* 
Produce path for a single certificate
*/}}
{{- define "api.singleCertPath" -}}
{{ printf "%s/%s" .global.Values.env.CERTS_PATH .subpath }}
{{- end }}