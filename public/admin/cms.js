import { numericValue, recordToRows, rowsToRecord } from './catalog-utils.js'

const { CMS, createClass, h } = window

const SizeRecordControl = createClass({
  getInitialState() {
    try {
      return { rows: recordToRows(this.props.value), error: '' }
    }
    catch (error) {
      return { rows: [], error: error.message }
    }
  },

  componentDidUpdate(previousProps) {
    if (previousProps.value === this.props.value)
      return
    try {
      const rows = recordToRows(this.props.value)
      // An emitted value is reflected back by CMS; keep local incomplete edits.
      if (JSON.stringify(rows) !== this.lastEmittedRows)
        this.setState({ rows, error: '' })
    }
    catch (error) {
      this.setState({ error: error.message })
    }
  },

  isValid() {
    if (this.state.error)
      return { error: { message: this.state.error } }
    try {
      rowsToRecord(this.state.rows)
      return true
    }
    catch (error) {
      return { error: { message: error.message } }
    }
  },

  updateRows(rows) {
    try {
      const value = rowsToRecord(rows)
      this.lastEmittedRows = JSON.stringify(recordToRows(value))
      this.setState({ rows, error: '' })
      this.props.onChange(value)
    }
    catch (error) {
      this.setState({ rows, error: error.message })
    }
  },

  changeRow(index, field, value) {
    // Turn edited numeric inputs into numbers, without altering untouched values.
    let amount = value
    if (field === 'amount') {
      try {
        amount = numericValue(value)
      }
      catch {
        // Keep incomplete input visible; validation blocks publishing it.
      }
    }
    this.updateRows(this.state.rows.map((row, rowIndex) => rowIndex === index
      ? { ...row, [field]: field === 'amount' ? amount : value }
      : row))
  },

  render() {
    const amountLabel = this.props.field.get('value_label', 'Значение')
    const id = this.props.forID
    return h('div', { id, className: `${this.props.classNameWrapper} size-record` }, ...this.state.rows.map((row, index) => h('div', { key: index, className: 'size-record__row' }, h('label', {}, 'Размер', h('input', {
      type: 'text',
      value: row.size,
      placeholder: '80×190',
      onChange: event => this.changeRow(index, 'size', event.target.value),
    })), h('label', {}, amountLabel, h('input', {
      type: 'text',
      inputMode: 'decimal',
      value: row.amount,
      placeholder: '0',
      onChange: event => this.changeRow(index, 'amount', event.target.value),
    })), h('button', {
      'type': 'button',
      'aria-label': `Удалить строку ${row.size || index + 1}`,
      'onClick': () => this.updateRows(this.state.rows.filter((_, rowIndex) => rowIndex !== index)),
    }, 'Удалить'))), h('button', {
      type: 'button',
      onClick: () => this.updateRows([...this.state.rows, { size: '', amount: '' }]),
    }, 'Добавить размер'), this.state.error ? h('p', { role: 'alert', className: 'size-record__error' }, this.state.error) : null)
  },
})

CMS.registerWidget('size-record', SizeRecordControl)
CMS.init()
