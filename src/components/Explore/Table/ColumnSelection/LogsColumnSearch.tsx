import React, { useState } from 'react';
import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { Field, Input, useTheme2 } from '@grafana/ui';

import { useTableColumnContext } from '../../Context/TableColumnsContext';
import { FieldNameMetaStore } from '../TableTypes';
import { debouncedFuzzySearch } from '../uFuzzy/uFuzzy';

function getStyles(theme: GrafanaTheme2) {
  return {
    searchWrap: css({
      padding: `${theme.spacing(0.4)} 0 ${theme.spacing(0.4)} ${theme.spacing(0.4)}`,
    }),
  };
}
export function LogsColumnSearch() {
  const { columns, setFilteredColumns } = useTableColumnContext();
  const [searchValue, setSearchValue] = useState<string>('');

  // uFuzzy search dispatcher, adds any matches to the local state
  const dispatcher = (data: string[][]) => {
    const matches = data[0];
    let newColumnsWithMeta: FieldNameMetaStore = {};
    matches.forEach((match) => {
      if (match in columns) {
        newColumnsWithMeta[match] = columns[match];
      }
    });
    setFilteredColumns(newColumnsWithMeta);
  };

  // uFuzzy search
  const search = (needle: string) => {
    debouncedFuzzySearch(Object.keys(columns), needle, dispatcher);
  };

  // onChange handler for search input
  const onSearchInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget?.value;
    setSearchValue(value);
    if (value) {
      search(value);
    } else {
      // If the search input is empty, reset the local search state.
      setFilteredColumns(undefined);
    }
  };

  const theme = useTheme2();
  const styles = getStyles(theme);
  return (
    <Field className={styles.searchWrap}>
      <Input value={searchValue} type={'text'} placeholder={'Search fields by name'} onChange={onSearchInputChange} />
    </Field>
  );
}
