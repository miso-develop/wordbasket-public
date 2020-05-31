export const log = (...v: any) => console.log(...v)
export const clog = (color = 'white', v: any) => {
  log(`${{
    black: '\u001b[30m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',
    reset: '\u001b[0m'
  }[color]}${v}`)
}
export const sleep = async (time: number) => await new Promise(resolve => setTimeout(resolve, time))
export const isLocal = (): boolean => location.href.indexOf('localhost') !== -1

// utils
export const escapeHTML = (str: string) => str.replace(/[&'`"<>]/g, match => ({
  '&': '&amp;',
  "'": '&#x27;',
  '`': '&#x60;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;'
})[match])

export const random = (max: number): number => Math.floor(Math.random() * max)

export const randomPop = <T> (array: T[]): T => {
  const index: number = random(array.length)
  const pop: T = array[index]
  array.splice(index, 1)
  return pop
}

export const zeroPadding = (val: any, len: number): string => (Array(len).join('0') + val).slice(-len)
