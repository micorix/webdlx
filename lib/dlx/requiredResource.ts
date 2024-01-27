interface RequiredResourceArgs {
  resourceType: string
  resourceId: number
  accessType: (typeof RequiredResource.RESOURCE_ACCESS_TYPES)[keyof typeof RequiredResource.RESOURCE_ACCESS_TYPES]
  ownerPcValue: number
}

export class RequiredResource {
  resourceType: string
  resourceId: number
  accessType: (typeof RequiredResource.RESOURCE_ACCESS_TYPES)[keyof typeof RequiredResource.RESOURCE_ACCESS_TYPES]
  private readonly _ownerPcValue: number | null = null

  static RESOURCE_ACCESS_TYPES = {
    READ: 'R',
    WRITE: 'W',
  } as const

  static RESOURCE_TYPES = {
    INT_REGISTER: 'INT_REGISTER',
    FLOAT_REGISTER: 'FLOAT_REGISTER',
    MEMORY: 'MEMORY',
  } as const

  constructor({ resourceType, resourceId, accessType, ownerPcValue }: RequiredResourceArgs) {
    this.resourceType = resourceType
    this.resourceId = resourceId
    this.accessType = accessType
    this._ownerPcValue = ownerPcValue
  }

  get ownerPcValue() {
    if (this._ownerPcValue === null) throw new Error('RequiredResource has no owner')
    return this._ownerPcValue
  }

  isSameResource(resource: RequiredResource) {
    return this.resourceType === resource.resourceType && this.resourceId === resource.resourceId
  }

  static requireIntRegisterR(registerNum: number, ownerPcValue: number) {
    return new RequiredResource({
      resourceType: RequiredResource.RESOURCE_TYPES.INT_REGISTER,
      resourceId: registerNum,
      accessType: RequiredResource.RESOURCE_ACCESS_TYPES.READ,
      ownerPcValue,
    })
  }

  static requireIntRegisterW(registerNum: number, ownerPcValue: number) {
    return new RequiredResource({
      resourceType: RequiredResource.RESOURCE_TYPES.INT_REGISTER,
      resourceId: registerNum,
      accessType: RequiredResource.RESOURCE_ACCESS_TYPES.WRITE,
      ownerPcValue,
    })
  }

  static requireMemoryR(ownerPcValue: number) {
    return new RequiredResource({
      resourceType: RequiredResource.RESOURCE_TYPES.MEMORY,
      resourceId: 0,
      accessType: RequiredResource.RESOURCE_ACCESS_TYPES.READ,
      ownerPcValue,
    })
  }

  static requireMemoryW(ownerPcValue: number) {
    return new RequiredResource({
      resourceType: RequiredResource.RESOURCE_TYPES.MEMORY,
      resourceId: 0,
      accessType: RequiredResource.RESOURCE_ACCESS_TYPES.WRITE,
      ownerPcValue,
    })
  }

  toString() {
    return `RequiredResource(${this.resourceType}, ${this.resourceId}, ${this.accessType}, ${this._ownerPcValue})`
  }
}

export class GlobalResourceManager {
  private _allRequiredResources: RequiredResource[] = []

  private _shouldIgnoreResource(requiredResource: RequiredResource) {
    return (
      requiredResource.resourceType === RequiredResource.RESOURCE_TYPES.INT_REGISTER &&
      requiredResource.resourceId === 0
    )
  }

  requestResourcesForInstruction(requestedResources: RequiredResource[]) {
    // add to all required resources if not used by some other instruction
    // if used by some other instruction, return false
    // if no required resources, return true

    const commonResources: RequiredResource[] = this._allRequiredResources.filter((resource) => {
      return requestedResources.some((requestedResource) => resource.isSameResource(requestedResource))
    })
    if (commonResources.length === 0) {
      requestedResources.forEach((resource) => {
        if (!this._shouldIgnoreResource(resource)) this._allRequiredResources.push(resource)
      })
      return true
    }

    return commonResources.every((resource) => {
      if (resource.ownerPcValue === requestedResources[0].ownerPcValue) return true

      const requestedResource = requestedResources.find((requestedResource) =>
        resource.isSameResource(requestedResource)
      )
      if (
        requestedResource?.accessType === RequiredResource.RESOURCE_ACCESS_TYPES.READ &&
        resource.accessType === RequiredResource.RESOURCE_ACCESS_TYPES.WRITE
      )
        return false
      if (
        requestedResource?.accessType === RequiredResource.RESOURCE_ACCESS_TYPES.WRITE &&
        resource.accessType === RequiredResource.RESOURCE_ACCESS_TYPES.WRITE
      )
        return true

      return false
    })
  }

  releaseRegisters(pcValue: number) {
    this._allRequiredResources = this._allRequiredResources.filter(
      (resource) => !(resource.resourceType === RequiredResource.RESOURCE_TYPES.INT_REGISTER)
    )
  }

  releaseMemory(pcValue: number) {
    this._allRequiredResources = this._allRequiredResources.filter(
      (resource) => !(resource.resourceType === RequiredResource.RESOURCE_TYPES.MEMORY)
    )
  }
}
