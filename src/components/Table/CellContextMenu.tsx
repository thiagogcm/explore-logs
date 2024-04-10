import React from 'react';
import { css } from '@emotion/css';

import { GrafanaTheme2, LinkModel } from '@grafana/data';
import { Icon, useTheme2 } from '@grafana/ui';

import { FilterOp } from '@/components/Context/QueryContext';
import { useScenesTableContext } from '@/components/Context/ScenesTableContext';

interface Props {
  fieldType?: 'derived';
  label: string;
  value: string;
  showColumn?: () => void;
  links?: LinkModel[];
}

const getStyles = (theme: GrafanaTheme2, bgColor?: string) => ({
  menu: css({
    position: 'relative',
    paddingRight: '5px',
    display: 'flex',
    minWidth: '60px',
    justifyContent: 'flex-start',
  }),
  menuItem: css({
    overflow: 'auto',
    textOverflow: 'ellipsis',
    background: theme.colors.background.secondary,
    cursor: 'pointer',
  }),
});

export const CellContextMenu = (props: Props) => {
  const theme = useTheme2();
  const styles = getStyles(theme);
  const { addFilter } = useScenesTableContext();

  return (
    <span className={styles.menu}>
      {props.fieldType !== 'derived' && (
        <>
          <div
            className={styles.menuItem}
            onClick={() => {
              addFilter({
                key: props.label,
                value: props.value,
                operator: FilterOp.Equal,
              });
            }}
          >
            <Icon title={'Add to search'} size={'lg'} name={'search-plus'} />
          </div>
          <div
            className={styles.menuItem}
            onClick={() => {
              addFilter({
                key: props.label,
                value: props.value,
                operator: FilterOp.NotEqual,
              });
            }}
          >
            <Icon title={'Exclude from search'} size={'lg'} name={'search-minus'} />
          </div>
        </>
      )}

      {props.showColumn && (
        <div onClick={props.showColumn} className={styles.menuItem}>
          <Icon title={'Add column'} size={'lg'} name={'columns'} />
        </div>
      )}

      {props.links &&
        props.links.map((link) => {
          return (
            <div
              className={styles.menuItem}
              onClick={() => {
                //@todo hacky openy
                window.open(link.href, '_blank');
              }}
              key={link.href}
            >
              <Icon title={link.title ?? 'Link'} key={link.href} size={'lg'} name={'link'} />
              {/*@todo this comes from user defined data in loki config, needs some limits */}
            </div>
          );
        })}
    </span>
  );
};
