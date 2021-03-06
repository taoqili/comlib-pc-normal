import { uuid, unitConversion, deepCopy } from '../util'
import {
  ColumnInnerJustifyType,
  Data,
  IRow,
  JustifyType,
  AlignType,
  ColumnParams
} from './runtime'

interface Result {
  data: Data
  focusArea: any
  output: any
  slot: any
}

function getRowItem(data: Data, focusArea: any) {
  const index = ~~focusArea.dataset.rowIndex
  return data.rows[index]
}

function getColItem(data: Data, focusArea: any) {
  const [rowIndex, colIndex]: number[] = getColIndex(focusArea)
  return data.rows[rowIndex] && data.rows[rowIndex].columns[colIndex]
}

function getColIndex(focusArea: any) {
  const [rowIndex, colIndex]: number[] = JSON.parse(focusArea.dataset.index)

  return [rowIndex, colIndex]
}

function setRowColumnsForEvenlySpan(columns: ColumnParams[]) {
  const [span, lastSpan] = evenlySplitSpan(columns.length)
  columns.map((item, index) => {
    if (index + 1 === columns.length && lastSpan !== 0) {
      item.span = lastSpan
      return { ...item }
    }
    item.span = span
    return { ...item }
  })
}

function evenlySplitSpan(columnCount: number, nextCount?: number) {
  if (!nextCount) {
    nextCount = columnCount
  }

  if (Math.floor(24 / nextCount) * columnCount > 24) {
    return evenlySplitSpan(columnCount, nextCount - 1)
  }

  const span = Math.floor(24 / nextCount)
  const lastSpan = (24 - span * columnCount) + span

  return [span, lastSpan]
}

function copyColumns(columns: ColumnParams[]) {
  const copy = {
    columns: [] as ColumnParams[],
    columnIds: [] as string[]
  }

  columns.map(item => {
    const columnId = uuid()
    item.key = columnId
    item.slot = columnId
    copy.columns.push({ ...item })
    copy.columnIds.push(columnId)
  })

  return copy
}

function generateColumns(columnCount: number) {
  const results = {
    columns: [] as ColumnParams[],
    columnIds: [] as string[]
  }

  for (let i = 0; i < columnCount; i++) {
    const columnId = uuid()
    results.columns.push({
      flex: 'row',
      justify: 'flex-start',
      align: 'center',
      span: 24 / columnCount,
      key: columnId,
      slot: columnId,
      widthOption: 'span',
      width: 300
    })

    results.columnIds.push(columnId)
  }

  return results
}

function generateColumnsTitle(columnCount: number) {
  return `col-${24 / columnCount} (${(100 / columnCount).toFixed(2)}%)`
}

function calculateSpans(data: Data, focusArea: any) {
  const [rowIndex, colIndex]: number[] = getColIndex(focusArea)
  let existSpans = 0
  data.rows[rowIndex].columns.forEach((column, index) => {
    if (index !== colIndex) {
      existSpans += column.span as number
    }
  })

  return 24 - existSpans
}

export default {
  ':root': [
    {
      title: '????????????',
      type: 'colorPicker',
      value: {
        get({ data }: Result) {
          return data.style?.backgroundColor
        },
        set({ data }: Result, value: string) {
          if (typeof data.style == 'undefined') {
            data.style = {}
          }
          data.style['backgroundColor'] = value
        }
      }
    },
    {
      title: '????????????',
      type: 'Slider',
      options: [
        {
          max: 100,
          min: 0,
          steps: 1,
          formatter: 'px',
        },
      ],
      value: {
        get({ data }: Result) {
          return data.style?.borderRadius ? parseInt(data.style?.borderRadius, 10) : 0
        },
        set({ data }: Result, value: number) {
          if (typeof data.style == 'undefined') {
            data.style = {}
          }
          data.style['borderRadius'] = value + 'px'
        }
      }
    },
    {
      title: '?????????',
      type: 'Button',
      value: {
        set({ data, slot }: Result) {
          const columnCount = 1;
          const rowId = uuid()
          const columnsInfo = generateColumns(columnCount)
          const row: IRow = {
            key: rowId,
            justify: 'start',
            gutter: [4, 4],
            align: 'top',
            columns: columnsInfo.columns,
          }

          const title = generateColumnsTitle(columnCount)
          columnsInfo.columnIds.forEach(columnId => slot.add(columnId, title))
          data.rows.push(row)
        },
      },
    },
    {
      title: '?????????(2???)',
      type: 'Button',
      value: {
        set({ data, slot }: Result) {
          const columnCount = 2;
          const rowId = uuid()
          const columnsInfo = generateColumns(columnCount)
          const row: IRow = {
            key: rowId,
            justify: 'start',
            gutter: [4, 4],
            align: 'top',
            columns: columnsInfo.columns,
          }

          const title = generateColumnsTitle(columnCount)
          columnsInfo.columnIds.forEach(columnId => slot.add(columnId, title))
          data.rows.push(row)
        },
      },
    },
    {
      title: '?????????(3???)',
      type: 'Button',
      value: {
        set({ data, slot }: Result) {
          const columnCount = 3;
          const rowId = uuid()
          const columnsInfo = generateColumns(columnCount)
          const row: IRow = {
            key: rowId,
            justify: 'start',
            gutter: [4, 4],
            align: 'top',
            columns: columnsInfo.columns,
          }

          const title = generateColumnsTitle(columnCount)
          columnsInfo.columnIds.forEach(columnId => slot.add(columnId, title))
          data.rows.push(row)
        },
      },
    },
  ],
  '.ant-row': {
    title: '???',
    items: [
      {
        title: '??????????????????',
        type: 'Select',
        options: [
          { value: 'start', label: '????????????' },
          { value: 'end', label: '????????????' },
          { value: 'center', label: '????????????' },
          { value: 'space-around', label: '????????????' },
          { value: 'space-between', label: '????????????' },
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            return item.justify
          },
          set({ data, focusArea }: Result, value: JustifyType) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            item.justify = value
          },
        },
      },
      {
        title: '??????????????????',
        type: 'Select',
        options: [
          { value: 'top', label: '????????????' },
          { value: 'middle', label: '????????????' },
          { value: 'bottom', label: '????????????' },
        ],
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            return item.align
          },
          set({ data, focusArea }: Result, value: AlignType) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            item.align = value
          },
        },
      },
      {
        title: '??????',
        type: 'Text',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            return item.height
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            item.height = unitConversion(value)
            // if (/^\d+(?:%)$/.test(value)) {
            //   item.height = value
            // } else {
            //   item.height = /^\d+(?:px)?$/.test(value) ? parseInt(value, 10) + 'px' : void 0
            // }
          },
        }
      },
      {
        title: '??????????????????',
        type: 'Switch',
        description: '??????????????????????????????',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            return item.flex
          },
          set({ data, slot, focusArea }: Result, value: boolean) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            item.flex = value ? 1 : 0;

            if (value) {
              data.style.display = 'flex'
              data.style.flexDirection = 'column'
              data.style.height = '100%'
              data.rowStyle = {
                flex: 1,
                alignItems: 'flex-start'
              }
            } else {
              data.style.display = ''
              data.style.flexDirection = ''
              data.style.height = ''
              data.rowStyle = {
                flex: 0,
                alignItems: ''
              }
            }
          }
        }
      },
      {
        title: '????????????',
        type: 'colorPicker',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            return item?.backgroundColor
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)

            if (typeof item.backgroundColor == 'undefined') {
              item.backgroundColor = ''
            }
            item['backgroundColor'] = value
          }
        }
      },
      {
        title: '?????????',
        type: 'Button',
        value: {
          // get({data, focusArea}: Result) {
          //   if (!focusArea) return
          //   const item = getRowItem(data, focusArea)
          //   const columnCount = item.columns.length

          //   return item.isEvenly
          // },
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            // item.isEvenly = value
            // if (value) {
            setRowColumnsForEvenlySpan(item.columns)
            // }
            const title = generateColumnsTitle(item.columns.length)
            item.columns.forEach(column => {
              slot.setTitle(column.slot, title)
            })
          },
        }
      },
      {
        title: '??????',
        type: 'Button',
        ifVisible({ focusArea }: Result) {
          if (!focusArea) return
          const index = ~~focusArea.dataset.rowIndex
          return index !== 0
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return
            const index = ~~focusArea.dataset.rowIndex
            const oldRow = data.rows[index]
            data.rows[index] = data.rows[index - 1]
            data.rows[index - 1] = oldRow
          }
        }
      },
      {
        title: '??????',
        type: 'Button',
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return
          const index = ~~focusArea.dataset.rowIndex
          return index + 1 < data.rows.length
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return
            const index = ~~focusArea.dataset.rowIndex
            const oldRow = data.rows[index]
            data.rows[index] = data.rows[index + 1]
            data.rows[index + 1] = oldRow
          }
        }
      },
      // {
      //   title: '??????????????????',
      //   type: 'Slider',
      //   options: [
      //     {
      //       max: 48,
      //       min: 0,
      //       step: 1,
      //       formatter: 'px',
      //     },
      //   ],
      //   value: {
      //     get({data, focusArea}: Result) {
      //       if (!focusArea) return
      //       const item = getRowItem(data, focusArea)
      //       return item.gutter[0]
      //     },
      //     set({data, focusArea}: Result, value: string) {
      //       if (!focusArea) return
      //       const item = getRowItem(data, focusArea)
      //       item.gutter[0] = value
      //     },
      //   },
      // },
      // {
      //   title: '??????????????????',
      //   type: 'Slider',
      //   options: [
      //     {
      //       max: 48,
      //       min: 0,
      //       step: 1,
      //       formatter: 'px',
      //     },
      //   ],
      //   value: {
      //     get({data, focusArea}: Result) {
      //       if (!focusArea) return
      //       const item = getRowItem(data, focusArea)
      //       return item.gutter[1]
      //     },
      //     set({data, focusArea}: Result, value: string) {
      //       if (!focusArea) return
      //       const item = getRowItem(data, focusArea)
      //       item.gutter[1] = value
      //     },
      //   },
      // },
      {
        title: '?????????',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            const lastColumn =
              item.columns[
              item.columns.length > 0 ? item.columns.length - 1 : 0
              ]
            const id = uuid()
            const column = {
              key: id,
              slot: id,
              flex: lastColumn ? lastColumn.flex : 'row',
              align: lastColumn ? lastColumn.align : 'center',
              justify: lastColumn ? lastColumn.justify : 'flex-start',
              span: lastColumn ? lastColumn.span as number : 4,
              widthOption: 'span',
              width: 300
            }

            item.columns.push(column)
            const title = generateColumnsTitle(24 / column?.span)
            slot.add(id, title)
          },
        },
      },
      {
        title: '??????',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return
            const item = deepCopy(getRowItem(data, focusArea))
            const rowId = uuid()
            const columnsInfo = copyColumns(item.columns)
            const row: IRow = {
              key: rowId,
              justify: item.justify,
              gutter: deepCopy(item.gutter),
              align: item.align,
              columns: columnsInfo.columns,
            }
            columnsInfo.columns.forEach((column, index) => {
              if (column.span) {
                slot.add(columnsInfo.columnIds[index], generateColumnsTitle(24 / Number(column.span)))
              }
            })
            data.rows.push(row)
          },
        },
      },
      {
        title: '??????',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return
            const item = getRowItem(data, focusArea)
            const index = ~~focusArea.dataset.rowIndex
            if (!item) {
              return
            }
            item.columns.forEach(columnItem => {
              slot.remove(columnItem.slot)
            })
            data.rows.splice(index, 1)
          },
        },
      },
    ],
  },
  '.ant-row > .ant-col': {
    title: '???',
    items: [
      // {
      //   title: '???????????????',
      //   type: 'Switch',
      //   description: '????????????????????????????????????',
      //   value: {
      //     get({data, focusArea}: Result) {
      //       if (!focusArea) return
      //       const item = getColItem(data, focusArea)
      //       return !Boolean(item.span) && !item.flex
      //     },
      //     set({data, focusArea}: Result, value: boolean) {
      //       if (!focusArea) return
      //       const item = getColItem(data, focusArea)
      //       item.span = value ? '' : 4
      //       item.flex = void 0
      //     },
      //   },
      // },
      {
        title: '??????????????????',
        type: 'Select',
        options: [
          { value: 'span', label: '24??????' },
          { value: 'auto', label: '????????????' },
          { value: 'px', label: '????????????' }
        ],
        value: {
          get({ data, focusArea }: Result) {
            return getColItem(data, focusArea).widthOption ? getColItem(data, focusArea).widthOption : 'span'
          },
          set({ data, slot, focusArea }: Result, value: string) {
            if (!focusArea) return
            const item = getColItem(data, focusArea)
            item.widthOption = value
          },
        }
      },
      {
        title: '??????(???24???)',
        type: 'Slider',
        options: {
          max: 24,
          min: 1,
          steps: 1,
          formatter: '/24',
        },
        ifVisible({ data, focusArea }: Result) {
          return !getColItem(data, focusArea).widthOption || getColItem(data, focusArea).widthOption === 'span'
        },
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            return getColItem(data, focusArea).span
          },
          set({ data, slot, focusArea }: Result, value: number) {
            if (!focusArea) return
            const item = getColItem(data, focusArea)
            item.span = value
            // const title = generateColumnsTitle(24 / item?.span)
            // slot.setTitle(item.slot, title)
          },
        },
      },
      {
        title: '????????????',
        type: 'Text',
        ifVisible({ data, focusArea }: Result) {
          return getColItem(data, focusArea).widthOption === 'px'
        },
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            return getColItem(data, focusArea).width
          },
          set({ data, slot, focusArea }: Result, value: number) {
            if (!focusArea) return
            const item = getColItem(data, focusArea)
            item.width = value
            // const title = generateColumnsTitle(24 / item?.span)
            // slot.setTitle(item.slot, title)
          },
        },
      },
      {
        title: '????????????',
        type: 'Select',
        options: [
          { value: 'flex-row', label: '????????????' },
          { value: 'flex-column', label: '????????????' }
        ],
        value: {
          get({ data, focusArea, slot }: Result) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)

            return mySlot.getLayout()
          },
          set({ data, focusArea, slot }: Result, value) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)

            return mySlot.setLayout(value)
          },
        },
      },
      {
        title: '????????????',
        type: 'Select',
        options: [
          { value: 'flex-start', label: '??????' },
          { value: 'center', label: '??????' },
          { value: 'flex-end', label: '??????' },
          { value: 'space-around', label: '????????????' },
          { value: 'space-between', label: '????????????' },
        ],
        ifVisible({ data, focusArea, slot }: Result): undefined | boolean {
          const item = getColItem(data, focusArea)
          if (item) {
            const mySlot = slot.get(item.slot)
            return mySlot.getLayout() === 'flex-row'
          }
        },
        value: {
          get({ data, focusArea, slot }: Result) {
            const item = getColItem(data, focusArea)

            const mySlot = slot.get(item.slot)
            return mySlot.getJustifyContent()
          },
          set({ data, focusArea, slot }: Result, value: ColumnInnerJustifyType) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            mySlot.setJustifyContent(value)
          },
        },
      },
      {
        title: '????????????',
        type: 'Select',
        options: [
          { value: 'flex-start', label: '??????' },
          { value: 'center', label: '??????' },
          { value: 'flex-end', label: '??????' }
        ],
        ifVisible({ data, focusArea, slot }: Result): undefined | boolean {
          const item = getColItem(data, focusArea)
          if (item) {
            const mySlot = slot.get(item.slot)
            return mySlot.getLayout() === 'flex-row'
          }
        },
        value: {
          get({ data, focusArea, slot }: Result) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            return mySlot.getAlignItems()
          },
          set({ data, focusArea, slot }: Result, value: ColumnInnerJustifyType) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            mySlot.setAlignItems(value)
          },
        },
      },
      {
        title: '????????????',
        type: 'Select',
        options: [
          { value: 'flex-start', label: '??????' },
          { value: 'center', label: '??????' },
          { value: 'flex-end', label: '??????' }
        ],
        ifVisible({ data, focusArea, slot }: Result): undefined | boolean {
          const item = getColItem(data, focusArea)
          if (item) {
            const mySlot = slot.get(item.slot)
            return mySlot.getLayout() === 'flex-column'
          }
        },
        value: {
          get({ data, focusArea, slot }: Result) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            return mySlot.getAlignItems()
          },
          set({ data, focusArea, slot }: Result, value: ColumnInnerJustifyType) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            mySlot.setAlignItems(value)
          },
        },
      },
      {
        title: '????????????',
        type: 'Select',
        options: [
          { value: 'flex-start', label: '??????' },
          { value: 'center', label: '??????' },
          { value: 'flex-end', label: '??????' },
          { value: 'space-around', label: '????????????' },
          { value: 'space-between', label: '????????????' },
        ],
        ifVisible({ data, focusArea, slot }: Result): undefined | boolean {
          const item = getColItem(data, focusArea)
          if (item) {
            const mySlot = slot.get(item.slot)
            return mySlot.getLayout() === 'flex-column'
          }
        },
        value: {
          get({ data, focusArea, slot }: Result) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            return mySlot.getJustifyContent()
          },
          set({ data, focusArea, slot }: Result, value: ColumnInnerJustifyType) {
            const item = getColItem(data, focusArea)
            const mySlot = slot.get(item.slot)
            mySlot.setJustifyContent(value)
          },
        },
      },
      {
        title: '????????????',
        type: 'Color',
        value: {
          get({ data, focusArea }: Result) {
            if (!focusArea) return
            const item = getColItem(data, focusArea)
            return item?.backgroundColor
          },
          set({ data, focusArea }: Result, value: string) {
            if (!focusArea) return
            const item = getColItem(data, focusArea)

            if (typeof item.backgroundColor == 'undefined') {
              item.backgroundColor = ''
            }
            item['backgroundColor'] = value
          }
        }
      },
      {
        title: '??????',
        type: 'Button',
        ifVisible({ focusArea }: Result) {
          if (!focusArea) return
          const [rowIndex, colIndex] = getColIndex(focusArea)
          return colIndex !== 0
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return
            const [rowIndex, colIndex] = getColIndex(focusArea)
            const row = data.rows[rowIndex]
            const oldColumn = row.columns[colIndex]
            row.columns[colIndex] = row.columns[colIndex - 1]
            row.columns[colIndex - 1] = oldColumn
          }
        }
      },
      {
        title: '??????',
        type: 'Button',
        ifVisible({ data, focusArea }: Result) {
          if (!focusArea) return
          const [rowIndex, colIndex] = getColIndex(focusArea)
          return colIndex + 1 < data.rows[rowIndex].columns.length
        },
        value: {
          set({ data, focusArea }: Result) {
            if (!focusArea) return
            const [rowIndex, colIndex] = getColIndex(focusArea)
            const row = data.rows[rowIndex]
            const oldColumn = row.columns[colIndex]
            row.columns[colIndex] = row.columns[colIndex + 1]
            row.columns[colIndex + 1] = oldColumn
          }
        }
      },
      {
        title: '??????',
        type: 'Button',
        value: {
          set({ data, slot, focusArea }: Result) {
            if (!focusArea) return
            const item = getColItem(data, focusArea)
            const [rowIndex, colIndex] = getColIndex(focusArea)
            if (!item) {
              return
            }
            slot.remove(item.slot)
            data.rows[rowIndex].columns.splice(colIndex, 1)
          },
        },
      },
    ],
  },
}
