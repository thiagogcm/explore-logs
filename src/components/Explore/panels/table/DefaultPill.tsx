import React, { ReactElement } from 'react';
import { css, cx } from '@emotion/css';

import { Field, FieldType, GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { CellIndex, getFieldMappings } from './DefaultCellComponent';
import { CellContextMenu } from './CellContextMenu';

interface DefaultPillProps {
  label: string;
  filterOut?: (label: string) => void;
  filterIn?: (label: string) => void;
  showColumns?: () => void;
  value: string | unknown | ReactElement;
  rowIndex: number;
  field: Field;
  cellIndex: CellIndex;
}

const getStyles = (theme: GrafanaTheme2, bgColor?: string) => ({
  activePillWrap: css({}),
  pillWrap: css({
    width: '100%',
  }),
  pill: css({
    border: `1px solid ${theme.colors.border.weak}`,
    '&:hover': {
      border: `1px solid ${theme.colors.border.strong}`,
    },
    marginRight: '5px',
    marginTop: '5px',
    padding: '2px 5px',
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'row-reverse',
    backgroundColor: bgColor ?? 'transparent',
  }),
  menu: css({
    width: '100%',
  }),
  menuItem: css({
    overflow: 'auto',
    textOverflow: 'ellipsis',
  }),
  menuItemText: css({
    width: '65px',
    display: 'inline-block',
  }),
});
export const DefaultPill = (props: DefaultPillProps) => {
  const { label, value } = props;
  const theme = useTheme2();
  const { cellIndex } = props;
  let bgColor;

  if (label === 'level') {
    const mappings = getFieldMappings().options;
    if (typeof value === 'string' && value in mappings) {
      bgColor = mappings[value].color;
    }
  }

  const isPillActive = cellIndex.index === props.rowIndex && props.field.name === cellIndex.fieldName;

  const styles = getStyles(theme, bgColor);
  return (
    <div className={cx(styles.pillWrap, isPillActive ? styles.activePillWrap : undefined)}>
      {!!value && (
        <>
          <span className={styles.pill}>
            <>{value}</>
          </span>
          {isPillActive && typeof value === 'string' && props.field.type !== FieldType.time && (
            <CellContextMenu label={props.label} value={value} addLabelFilter={(key, value, op) => {}} />
          )}
        </>
      )}
    </div>
  );
};
