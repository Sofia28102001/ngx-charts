| showDataLabel | boolean | Show or hide the data value labels in each cell |

## Data Format

The heat map component can display data labels inside each cell. To enable this feature, set the `showDataLabel` input property to `true`:

```html
<ngx-charts-heat-map [showDataLabel]="true" [results]="data"></ngx-charts-heat-map>
```