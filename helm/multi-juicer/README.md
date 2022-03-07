![MultiJuicer, Multi User Juice Shop Platform](https://raw.githubusercontent.com/iteratec/multi-juicer/master/images/multijuicer-cover.svg)

Running CTFs and Security Trainings with [OWASP Juice Shop](https://github.com/bkimminich/juice-shop) is usually quite tricky, Juice Shop just isn't intended to be used by multiple users at a time.
Instructing everybody how to start Juice Shop on their own machine works ok, but takes away too much valuable time.

MultiJuicer gives you the ability to run separate Juice Shop instances for every participant on a central kubernetes cluster, to run events without the need for local Juice Shop instances.

**What it does:**

- dynamically create new Juice Shop instances when needed
- runs on a single domain, comes with a LoadBalancer sending the traffic to the participants Juice Shop instance
- backup and auto apply challenge progress in case of Juice Shop container restarts
- cleanup old & unused instances automatically

![MultiJuicer, High Level Architecture Diagram](https://raw.githubusercontent.com/iteratec/multi-juicer/master/high-level-architecture.svg)

## Configuration

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| balancer.affinity | object | `{}` | Optional Configure kubernetes scheduling affinity for the created JuiceShops (see: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) |
| balancer.cookie.cookieParserSecret | string | `nil` | Set this to a fixed random alpa-numeric string (recommended length 24 chars). If not set this get randomly generated with every helm upgrade, each rotation invalidates all active cookies / sessions requirering users to login again. |
| balancer.cookie.name | string | `"balancer"` | Changes the cookies name used to identify teams. Note will automatically be prefixed with "__Secure-" when balancer.cookie.secure is set to `true` |
| balancer.cookie.secure | bool | `false` |  |
| balancer.metrics.basicAuth.password | string | `"ERzCT4pwBDxfCKRGmfrMa8KQ8sXf8GKy"` | Should be changed when metrics are enabled. |
| balancer.metrics.basicAuth.username | string | `"prometheus-scraper"` |  |
| balancer.metrics.dashboards.enabled | bool | `false` | if true, creates a Grafana Dashboard Config Map. (also requires metrics.enabled to be true). These will automatically be imported by Grafana when using the Grafana helm chart, see: https://github.com/helm/charts/tree/master/stable/grafana#sidecar-for-dashboards |
| balancer.metrics.enabled | bool | `true` | enables prometheus metrics for the balancer. If set to true you should change the prometheus-scraper password |
| balancer.metrics.serviceMonitor.enabled | bool | `false` | If true, creates a Prometheus Operator ServiceMonitor (also requires metrics.enabled to be true). This will also deploy a servicemonitor which monitors metrics from the Juice Shop instances |
| balancer.replicas | int | `1` | Number of replicas of the juice-balancer deployment |
| balancer.repository | string | `"iteratec/juice-balancer"` |  |
| balancer.resources.limits.cpu | string | `"400m"` |  |
| balancer.resources.limits.memory | string | `"256Mi"` |  |
| balancer.resources.requests.cpu | string | `"400m"` |  |
| balancer.resources.requests.memory | string | `"256Mi"` |  |
| balancer.securityContext | object | `{}` |  |
| balancer.service.clusterIP | string | `nil` | internal cluster service IP |
| balancer.service.externalIPs | string | `nil` | IP address to assign to load balancer (if supported) |
| balancer.service.loadBalancerIP | string | `nil` | IP address to assign to load balancer (if supported) |
| balancer.service.loadBalancerSourceRanges | string | `nil` | list of IP CIDRs allowed access to lb (if supported) |
| balancer.service.type | string | `"ClusterIP"` | Kubernetes service type |
| balancer.skipOwnerReference | bool | `false` | If set to true this skips setting ownerReferences on the teams JuiceShop Deployment and Services. This lets MultiJuicer run in older kubernetes cluster which don't support the reference type or the app/v1 deployment type |
| balancer.tag | string | `nil` |  |
| balancer.tolerations | list | `[]` | Optional Configure kubernetes toleration for the created JuiceShops (see: https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) |
| imagePullPolicy | string | `"Always"` |  |
| ingress.annotations | object | `{}` |  |
| ingress.enabled | bool | `false` |  |
| ingress.hosts[0].host | string | `"multi-juicer.local"` |  |
| ingress.hosts[0].paths[0] | string | `"/"` |  |
| ingress.tls | list | `[]` |  |
| juiceShop.affinity | object | `{}` | Optional Configure kubernetes scheduling affinity for the created JuiceShops (see: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) |
| juiceShop.config | string | See values.yaml for full details | Specify a custom Juice Shop config.yaml. See the JuiceShop Config Docs for more detail: https://pwning.owasp-juice.shop/part1/customization.html#yaml-configuration-file |
| juiceShop.ctfKey | string | `"zLp@.-6fMW6L-7R3b!9uR_K!NfkkTr"` | Change the key when hosting a CTF event. This key gets used to generate the challenge flags. See: https://pwning.owasp-juice.shop/part1/ctf.html#overriding-the-ctfkey |
| juiceShop.env | list | `[]` | Optional environment variables to set for each JuiceShop instance (see: https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/) |
| juiceShop.envFrom | list | `[]` |  |
| juiceShop.image | string | `"bkimminich/juice-shop"` | Juice Shop Image to use |
| juiceShop.maxInstances | int | `10` | Specifies how many JuiceShop instances MultiJuicer should start at max. Set to -1 to remove the max Juice Shop instance cap |
| juiceShop.nodeEnv | string | `"multi-juicer"` | Specify a custom NODE_ENV for JuiceShop. If value is changed to something other than 'multi-juicer' it's not possible to set a custom config via `juiceShop.config`. |
| juiceShop.resources | object | `{"requests":{"cpu":"150m","memory":"200Mi"}}` | Optional resources definitions to set for each JuiceShop instance |
| juiceShop.securityContext | object | `{}` |  |
| juiceShop.tag | string | `"v12.8.1"` |  |
| juiceShop.tolerations | list | `[]` | Optional Configure kubernetes toleration for the created JuiceShops (see: https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) |
| juiceShop.volumeMounts | list | `[]` |  |
| juiceShop.volumes | list | `[]` | Optional Volumes to set for each JuiceShop instance (see: https://kubernetes.io/docs/concepts/storage/volumes/) |
| juiceShopCleanup.affinity | object | `{}` | Optional Configure kubernetes scheduling affinity for the JuiceShopCleanup Job(see: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) |
| juiceShopCleanup.cron | string | `"0 * * * *"` | Cron in which the clean up job is run. Defaults to once in an hour. Change this if your grace period if shorter than 1 hour |
| juiceShopCleanup.enabled | bool | `true` |  |
| juiceShopCleanup.failedJobsHistoryLimit | int | `1` |  |
| juiceShopCleanup.gracePeriod | string | `"1d"` | Specifies when Juice Shop instances will be deleted when unused for that period. |
| juiceShopCleanup.repository | string | `"iteratec/cleaner"` |  |
| juiceShopCleanup.resources.limits.memory | string | `"256Mi"` |  |
| juiceShopCleanup.resources.requests.memory | string | `"256Mi"` |  |
| juiceShopCleanup.securityContext | object | `{}` |  |
| juiceShopCleanup.successfulJobsHistoryLimit | int | `1` |  |
| juiceShopCleanup.tag | string | `nil` |  |
| juiceShopCleanup.tolerations | list | `[]` | Optional Configure kubernetes toleration for the JuiceShopCleanup Job (see: https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) |
| nodeSelector | object | `{}` |  |
| progressWatchdog.affinity | object | `{}` | Optional Configure kubernetes scheduling affinity for the ProgressWatchdog (see: https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) |
| progressWatchdog.repository | string | `"iteratec/progress-watchdog"` |  |
| progressWatchdog.resources.limits.cpu | string | `"20m"` |  |
| progressWatchdog.resources.limits.memory | string | `"48Mi"` |  |
| progressWatchdog.resources.requests.cpu | string | `"20m"` |  |
| progressWatchdog.resources.requests.memory | string | `"48Mi"` |  |
| progressWatchdog.securityContext | object | `{}` |  |
| progressWatchdog.tag | string | `nil` |  |
| progressWatchdog.tolerations | list | `[]` | Optional Configure kubernetes toleration for the ProgressWatchdog (see: https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) |
| service.port | int | `3000` |  |
| service.type | string | `"ClusterIP"` |  |