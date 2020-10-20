String.prototype.replaceAll = function(regExp, routine) {
  let result = this;
  for(const match of [...result.matchAll(regExp)]) {
    result = result.split(match[0]).join(routine(match[0], match.slice(1)));
  }
  return result;
}

class Render {
  format = {
    count: (str) => {
      return str.length;
    }
  };
  rule = {
    each: {
      regex: /\{%\s*each\s*([\w_.-]+)\s*of\s*([\w_.-]+)\s*%\}(.*)\{%\s*end\s*each\s*%\}/gm,
      routine: (str, match) => {
        if(this.data[match[1]]) {
          let result = '';
          for(const item of this.data[match[1]]) {
            this.data[match[0]] = item;
            result += this.render(match[2]);
          }
          return result;
        } else
          return this.render(match[2]);
      }
    },
    comment: {
      regex: /\{#(.*)#\}/gm,
      routine: (str, match) => {
        return '';
      }
    },
    var: {
      regex: /\{\s*([\w_.-]+)(\s*\[[^\}]+\])?\s*\}/gm,
      routine: (str, match) => {
        let parts = match[0].split('.');
        let result = this.data;
        for(const part of parts) {
          if(result[part]) {
            result = result[part];
          } else {
            return str;
          }
        }
        if(match[1]) {
          let format = match[1].substring(1, match[1].length - 1);
          return this.format[format] ? this.format[format](result) : result;
        } else {
          return result;
        }
      }
    }
  };
  constructor(data) {
    this.data = data;
  }
  render(text) {
    let match;
    for(const rule of Object.values(this.rule)) {
      text = text.replaceAll(rule.regex, rule.routine);
    }
    return text;
  }
}
