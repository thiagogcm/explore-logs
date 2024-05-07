import React from 'react';

import {
  PanelBuilders,
  SceneComponentProps,
  SceneFlexItem,
  SceneFlexLayout,
  SceneObjectBase,
  SceneObjectState,
} from '@grafana/scenes';
import { DrawStyle, StackingMode } from '@grafana/ui';
import { getQueryRunner, levelOverrides } from 'services/panel';
import { buildBaseQueryExpression, buildLokiQuery } from 'services/query';
import { LEVEL_VARIABLE_VALUE } from 'services/variables';

export interface LogsVolumePanelState extends SceneObjectState {
  panel?: SceneFlexLayout;
}

export class LogsVolumePanel extends SceneObjectBase<LogsVolumePanelState> {
  constructor(state: LogsVolumePanelState) {
    super(state);

    this.addActivationHandler(this._onActivate.bind(this));
  }

  private _onActivate() {
    if (!this.state.panel) {
      this.setState({
        panel: this.getVizPanel(),
      });
    }
  }

  private getVizPanel() {
    return new SceneFlexLayout({
      direction: 'row',
      children: [
        new SceneFlexItem({
          body: PanelBuilders.timeseries()
            .setTitle('Log volume')
            .setOption('legend', { showLegend: false })
            .setData(
              getQueryRunner(
                buildLokiQuery(
                  `sum by (${LEVEL_VARIABLE_VALUE}) (count_over_time(${buildBaseQueryExpression(
                    this
                  )} | drop __error__ [$__auto]))`,
                  { legendFormat: `{{${LEVEL_VARIABLE_VALUE}}}` }
                )
              )
            )
            .setCustomFieldConfig('stacking', { mode: StackingMode.Normal })
            .setCustomFieldConfig('fillOpacity', 100)
            .setCustomFieldConfig('lineWidth', 0)
            .setCustomFieldConfig('pointSize', 0)
            .setCustomFieldConfig('drawStyle', DrawStyle.Bars)
            .setOverrides(levelOverrides)
            .build(),
        }),
      ],
    });
  }

  public static Component = ({ model }: SceneComponentProps<LogsVolumePanel>) => {
    const { panel } = model.useState();

    if (!panel) {
      return;
    }

    return <panel.Component model={panel} />;
  };
}
