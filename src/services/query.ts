import { AdHocFiltersVariable, CustomVariable, sceneGraph, SceneObject } from '@grafana/scenes';
import { PLUGIN_ID } from './routing';
import { VAR_FIELDS, VAR_LABELS, VAR_LINE_FILTER, VAR_LOGS_FORMAT, VAR_PATTERNS } from './variables';

export type LokiQuery = {
  refId: string;
  queryType: string;
  editorMode: string;
  supportingQueryType: string;
  expr: string;
  legendFormat?: string;
};
export const buildLokiQuery = (expr: string, queryParamsOverrides?: Record<string, unknown>): LokiQuery => {
  return {
    ...defaultQueryParams,
    ...queryParamsOverrides,
    expr,
  };
};

export function buildBaseQueryExpression(sceneObject: SceneObject) {
  let expr = '';

  // build streamselector from all indexed labels
  const indexedLabels = sceneGraph.lookupVariable(VAR_LABELS, sceneObject) as AdHocFiltersVariable | null;
  if (!indexedLabels || !indexedLabels.state.filterExpression) {
    return '';
  }
  let streamSelector = indexedLabels.state.filterExpression;
  expr = streamSelector;

  // add all pattern expressions
  const patterns = sceneGraph.lookupVariable(VAR_PATTERNS, sceneObject) as AdHocFiltersVariable | null;
  if (patterns && patterns.state.filterExpression) {
    expr += ' ' + patterns.state.filterExpression;
  }

  // add line filter expression
  const lineFilter = sceneGraph.lookupVariable(VAR_LINE_FILTER, sceneObject) as CustomVariable | null;
  if (lineFilter && lineFilter.state.value) {
    expr += ' ' + lineFilter.state.value;
  }

  // add `logfmt` or `json`
  const format = sceneGraph.lookupVariable(VAR_LOGS_FORMAT, sceneObject) as CustomVariable | null;
  if (format && format.state.value) {
    expr += ' ' + format.state.value;
  }

  // add all label filter expressions
  const labelFilters = sceneGraph.lookupVariable(VAR_FIELDS, sceneObject) as AdHocFiltersVariable | null;
  if (labelFilters && labelFilters.state.filterExpression) {
    expr += ' ' + labelFilters.state.filterExpression;
  }

  return expr;
}

const defaultQueryParams = {
  refId: 'A',
  queryType: 'range',
  editorMode: 'code',
  supportingQueryType: PLUGIN_ID,
};
