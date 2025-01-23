{{- define "homelab-dashboard.name" -}}
{{ .Chart.Name }}
{{- end -}}

{{- define "homelab-dashboard.backendName" -}}
{{ include "homelab-dashboard.name" . }}-backend
{{- end -}}

{{- define "homelab-dashboard.frontendName" -}}
{{ include "homelab-dashboard.name" . }}-frontend
{{- end -}}
