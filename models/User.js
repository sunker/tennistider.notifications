const mongoose = require('mongoose'),
  {findWhere} = require('underscore'),
  Schema = mongoose.Schema,
  TimeSlot = require('./TimeSlot')

const userSchema = new Schema({
  id: {
    type: Schema.ObjectId
  },
  active: Boolean,
  email: {
    type: String,
    required: true,
    unique: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String
  },
  latestWeeklyReport: Number,
  slotPreference: [{
    clubId: Number,
    days: [
      []
    ]
  }],
  firstTimeUser: Boolean
})

userSchema.pre('save', function (next) {
  var user = this

  if (!findWhere(user.slotPreference, {
    clubId: -1
  })) {
    user.slotPreference.push({
      clubId: -1,
      days: [
        [new TimeSlot(8, 21).toJSON()], // sunday
        [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()], // monday
        [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()], // thuesday..
        [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()],
        [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()],
        [new TimeSlot(7, 9).toJSON(), new TimeSlot(12, 13, false).toJSON(), new TimeSlot(17, 21).toJSON()],
        [new TimeSlot(8, 21).toJSON()]
      ]
    })
  }

  next()

  // only hash the password if it has been modified (or is new)
  // if (!user.isModified('password')) return next();

  // // generate a salt
  // bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
  //     if (err) return next(err);

  //     // hash the password along with our new salt
  //     bcrypt.hash(user.password, salt, null, function (err, hash, progress, cb) {
  //         if (err) return next(err);

  //         // override the cleartext password with the hashed one
  //         user.password = hash;
  //         next();
  //     });
  // });
})

userSchema.methods = {
  validatePassword: function (password) {
    if (this.password === password) {
      return true
    } else {
      return false
    }
  },
  isDayInPreferenceRange: (date) => {
    return this.jsDaysOfPreference.indexOf(date) !== -1
  },
  isTimeInPreferenceRange: (timeSlot) => {
    this.timeIntervalsOfPreference.foreEach((prefTimeSlot) => {
      if (timeSlot.startTime >= prefTimeSlot.startTime &&
        timeSlot.startTime < prefTimeSlot.endTime) {
        return true
      }
    })

    return false
  },
  isClubPreferenceRange: (clubId) => {
    return this.clubsOfPreference.indexOf(clubId) !== -1
  },
  comparePasswords: function (candidatePassword, cb) {
    // bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    //   if (err) return cb(err)
    //         cb(null, isMatch)

    //     })
  },
  sendWeeklyReport: function () {
    if (!this.latestWeeklyReport) return true

    const currentSavedDate = new Date(this.latestWeeklyReport)
    const currentDate = new Date()

    if (currentDate.getWeek() > currentSavedDate.getWeek()) {
      return true
    } else {
      return false
    }
  },
  saveWeeklyReport: function () {
    return new Promise((resolve, reject) => {
      this.latestWeeklyReport = new Date().getTime()
      this.save(function (err, user) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(user)
          console.log('Weekly report saved')
        }
      })
    })
  }
}

userSchema.statics = {
  getById: function (userId) {
    return new Promise((resolve, reject) => {
      User.findById(userId, function (err, user) {
        if (err) {
          reject(err)
        } else {
          resolve(user)
        }
      })
    })
  },
  getByEmail: function (email) {
    return new Promise((resolve, reject) => {
      User.findOne({
        email: email
      }, function (err, user) {
        if (err || !user) {
          reject(err)
        } else {
          resolve(user)
        }
      })
    })
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      User.find({}, function (err, users) {
        if (err) {
          reject(err)
        } else {
          resolve(users)
        }
      })
    })
  },
  add: function (newUser) {
    return new Promise((resolve, reject) => {
      newUser.save(function (err, user) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          resolve(user)
          console.log('User created')
        }
      })
    })
  }
}

Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1)
  var millisecsInDay = 86400000
  return Math.ceil((((this - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7)
}

const User = mongoose.model('user', userSchema)

module.exports = User
