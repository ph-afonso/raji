export interface Group {
  id: string
  name: string
  slug: string
  familyId: string
  isDefault: boolean
  membersCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateGroupDto {
  name: string
}

export interface UpdateGroupDto {
  name: string
}

export interface PermissionDef {
  id: string
  module: string
  action: string
  description?: string
}

export interface GroupPermissions {
  groupId: string
  permissions: string[] // e.g. ['transactions:create', 'transactions:read']
}
