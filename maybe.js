class Maybe {
  constructor(x) {
    this.__value = x
  }

  static of(value) {
    return new this(value)
  }

  isNothing() {
    return this.__value === null || typeof this.__value === 'undefined'
  }

  map(f) {
    return this.isNothing() ? new Maybe(null) : new Maybe(f(this.__value))
  }

  getOrElse(defaultValue) {
    return this.isNothing() ? defaultValue : this.__value
  }
}
