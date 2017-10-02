const _ = require('underscore')
const _slots = Symbol('slots')

module.exports = class HtmlMailBuilder {
  constructor(slots) {
    this[_slots] = slots
  }

  get morningSlots() {
    return this[_slots].filter(slot => slot.isMorningSlot())
  }

  get lunchtimeSlots() {
    return this[_slots].filter(slot => slot.isLunchtimeSlot())
  }

  get weekdayNightSlots() {
    return this[_slots].filter(slot => slot.isWeekdayNightSlot())
  }

  get weekendSlots() {
    return this[_slots].filter(slot => slot.isOnWeekend())
  }

  getSlotLines(slots) {
    const slot = slots[0]
    return (slot.toString() + ((slots.length > 1 ? ' (' + slots.length + ' banor) ' : '') + (!slot.link ? '' : slot.link.embedLink('boka'))))
  }

  buildDaytimeGroup(singleHeader, multiHeader, slots) {
    let result = ''
    if (slots && slots.length === 1) {
      result += singleHeader.h2Wrap().brAppend()
      result += slots[0].clubName.strongWrap().brAppend()
      result = result + slots[0].toString().pWrap().brAppend()
    } else if (slots && slots.length > 1) {
      result += multiHeader.h2Wrap()
      let slotsGroups = _.groupBy(slots, 'clubId')
      Object.keys(slotsGroups).forEach((clubGroup) => {
        let clubSlots = _.sortBy(slotsGroups[clubGroup], 'date')
        result += clubSlots[0].clubName.strongWrap().brAppend()

        let slotGrupedByTimeAndSurface = _.groupBy(clubSlots, (slot) => {
          return slot.getSlotKeyExcludingCourtNumber()
        })

        Object.keys(slotGrupedByTimeAndSurface).forEach((key) => {
          var slots = slotGrupedByTimeAndSurface[key]
          result = result + (this.getSlotLines(slots)).pWrap()
        })
        result.brAppend()
      })
    }

    return result
  }

  buildHtmlString() {
    let result = ''

    result += this.buildDaytimeGroup('Morgontid', 'Morgontider', this.morningSlots)
    result += this.buildDaytimeGroup('Lunchtid', 'Lunchtider', this.lunchtimeSlots)
    result += this.buildDaytimeGroup('Kvällstid', 'Kvällstider', this.weekdayNightSlots)
    result += this.buildDaytimeGroup('Helgtid', 'Helgtider', this.weekendSlots)
    result += `<hr /><i>Klicka <a href="http://tennistider.herokuapp.com/">här</a> för att ändra dina klubbar och tider</i>`.brAppend()

    return result.htmlBodyWrap()
  }
}

String.prototype.h2Wrap = function () {
  return '<h2 style="color:#000000;">' + this + '</h2>'
}

String.prototype.brAppend = function () {
  return this + '<br />'
}

String.prototype.strongWrap = function () {
  return '<strong style="color:#000000">' + this + '</strong>'
}

String.prototype.pWrap = function () {
  return '<p style="color:#000000">' + this + '</p>'
}

String.prototype.embedLink = function (linkText) {
  return ' <a href="' + this + '">' + linkText + '</a>'
}

String.prototype.htmlBodyWrap = function () {
  return '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/> <title>Tennistider</title> <meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>body{font-family: helvetica;color: #000000}strong{font-weight: bold;}</style></head><body style="margin: 0; padding: 0;">' + this + '</body></html>'
}
