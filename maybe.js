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

  fold(f, g) {
    return this.isNothing() ? f() : g(this.__value)
  }
}
