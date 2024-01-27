// DLX architecture features
// 32 32-bit integer registers
// 32 32-bit floating point registers
// TODO double precision floating point registers

const intRegistersProxyHandler = {
  set: (target: Int32Array, property, value) => {
    if (property !== 0) target[property] = value
    return true
  },
}

export class SingleIntRegister extends Int32Array {
  constructor() {
    const NUM_OF_REGISTERS = 1
    super(NUM_OF_REGISTERS)
  }

  getValue() {
    return this[0]
  }

  setValue(value: number) {
    this[0] = value
  }
}

// class IntRegisters extends Proxy {
//     constructor() {
//         super(new Int32Array(32), intRegistersProxyHandler);
//     }
//
//     private _setHandler(target: Int32Array, property, value) {
//         if (property !== 0)
//             target[property] = value;
//         return true;
//     }
//
// }

export type Register = Int32Array | Float32Array

class Registers {
  public NUM_INT_REGISTERS = 32
  public NUM_FLOAT_REGISTERS = 32
  private readonly _intRegistersBuffer = new ArrayBuffer(this.NUM_INT_REGISTERS * 4)

  constructor(registersStructuredClone?: Registers) {
    if (registersStructuredClone) {
      this._intRegistersBuffer = registersStructuredClone._intRegistersBuffer
    }
  }

  public get intRegisters() {
    return new Proxy(new Int32Array(this._intRegistersBuffer), intRegistersProxyHandler)
  }
}

export default Registers
