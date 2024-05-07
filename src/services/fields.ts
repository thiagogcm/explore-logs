import { DataFrame, PanelData } from '@grafana/data';
import { DrawStyle, StackingMode } from '@grafana/ui';
import { PanelBuilders, SceneCSSGridItem, SceneDataNode } from '@grafana/scenes';
import { getColorByIndex } from './scenes';
import { AddToFiltersButton } from 'Components/ServiceScene/Breakdowns/AddToFiltersButton';
import { levelOverrides } from './panel';

export type DetectedLabel = {
  label: string;
  cardinality: number;
};

export type DetectedLabelsResponse = {
  detectedLabels: DetectedLabel[];
};

interface ExtratedFields {
  type: 'logfmt' | 'json';
  fields: string[];
}

export function extractParserAndFieldsFromDataFrame(data: DataFrame) {
  const result: ExtratedFields = { type: 'logfmt', fields: [] };
  const labelTypesField = data.fields.find((f) => f.name === 'labelTypes');
  result.fields = Object.keys(
    labelTypesField?.values.reduce((acc: Record<string, boolean>, value: Record<string, string>) => {
      Object.entries(value)
        .filter(([_, v]) => v === 'P')
        .forEach(([k]) => (acc[k] = true));
      return acc;
    }, {}) || {}
  );

  const linesField = data.fields.find((f) => f.name === 'Line');
  result.type = linesField?.values[0]?.[0] === '{' ? 'json' : 'logfmt';

  return result;
}

export function getLabelValueScene(getTitle: (df: DataFrame) => string, style: DrawStyle, variableName: string) {
  return (data: PanelData, frame: DataFrame, frameIndex: number) => {
    const panel = PanelBuilders.timeseries() //
      .setOption('legend', { showLegend: false })
      .setCustomFieldConfig('fillOpacity', 9)
      .setTitle(getTitle(frame))
      .setData(new SceneDataNode({ data: { ...data, series: [frame] } }))
      .setColor({ mode: 'fixed', fixedColor: getColorByIndex(frameIndex) })
      .setOverrides(levelOverrides)
      .setHeaderActions(new AddToFiltersButton({ frame, variableName }));

    if (style === DrawStyle.Bars) {
      panel
        .setCustomFieldConfig('stacking', { mode: StackingMode.Normal })
        .setCustomFieldConfig('fillOpacity', 100)
        .setCustomFieldConfig('lineWidth', 0)
        .setCustomFieldConfig('pointSize', 0)
        .setOverrides(levelOverrides)
        .setCustomFieldConfig('drawStyle', DrawStyle.Bars);
    }
    return new SceneCSSGridItem({
      body: panel.build(),
    });
  };
}
