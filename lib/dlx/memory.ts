class Memory {
  private MEMORY_SIZE_IN_BYTES = 0x8000
  private DATA_START_ADDRESS = 1000
  private BYTE_SIZE = 4
  private LITTLE_ENDIAN = true
  private readonly _memoryBuffer = new ArrayBuffer(this.MEMORY_SIZE_IN_BYTES)
  private _memoryView = new DataView(this._memoryBuffer)

  constructor(memoryStructuredClone?: Memory) {
    if (memoryStructuredClone) {
      this._memoryBuffer = memoryStructuredClone._memoryBuffer
      this._memoryView = new DataView(this._memoryBuffer)
    }
  }

  public read(address: number) {
    // TODO: different types of reads
    return this._memoryView.getInt32(address, this.LITTLE_ENDIAN)
  }
  public write(address: number, value: number) {
    this._memoryView.setInt32(address, value, this.LITTLE_ENDIAN)
  }
  public writeProgram(program: number[]) {
    program.forEach((instruction, index) => {
      this.write(index * 4, instruction)
    })
  }

  public serialize() {
    const serialized = {}
    for (let i = 0; i < this.MEMORY_SIZE_IN_BYTES; i += this.BYTE_SIZE) {
      const value = this._memoryView.getInt32(i, this.LITTLE_ENDIAN)
      if (value !== 0) serialized[i] = value
    }
    return serialized
  }
}

export default Memory
