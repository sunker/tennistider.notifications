require('../models/Notification')
const Scraper = require('../scraping/scraper'),
  mongoose = require('mongoose'),
  Mail = require('../models/Mail'),
  User = mongoose.model('user'),
  Notification = mongoose.model('notification'),
  userSlotFilter = require('./userSlotFilter'),
  mailClient = require('./mailClient'),
  SlotCollection = require('../models/SlotCollection')

module.exports = () => {
  const scraper = Scraper.getInstance()

  this.notifyUsers = (slots) => {
    User.getAll().then((users) => {
      users.filter(x => x.active).forEach((user) => {
        this.notifyUser(user, slots)
      })
    })
  }

  this.notifyUser = (user, slots) => {
    let slotsOfInterest = userSlotFilter.filterSlots(user, slots)
    let slotsToBroadcastPromises = slotsOfInterest.map(slot => {
      return new Promise((resolve, reject) => {
        let key = slot.getKey(user.email)
        Notification.containsKey(key).then((containsKey) => {
          if (!containsKey) {
            resolve({
              key: key,
              slot: slot
            })
          } else {
            resolve(undefined)
          }
        })
      })
    })
    Promise.all(slotsToBroadcastPromises).then(function (slots) {
      const slotCollection = new SlotCollection(slots)
      slots = slots.filter(x => x)
      slots = _.uniq(slots, (x) => x.slot.getKey())
      slots = slots.filter(slot => userSlotFilter.isPrimeTime(slot.slot))

      if (slots.length === 0) return
      let mail = new Mail(slots.map(x => x.slot), user.email, false)
      mailClient.sendEmail(mail).then(() => {
        slotCollection.uniqueSlotKeys.forEach((key) => {
          Notification.containsKey(key).then((containsKey) => {
            if (!containsKey) {
              var notification = new Notification()
              notification.key = key
              notification.timestamp = new Date()
              Notification.add(notification).then(() => {
                console.log('Notification saved')
              })
            }
          })
        })
      }, (error) => {
        console.log('Duplicate key. Key mot saved')
      })
        .catch(function (error) {
          console.log('Could not send email')
        })
    })
      .catch(function (error) {
        console.log(error)
      })
  }

  scraper.on('slotsLoaded', (slotCollection) => {
    var time = new Date().getHours()
    if (time > 7 && time < 23) {
      this.notifyUsers(slotCollection.slots)
    }
  })
}
