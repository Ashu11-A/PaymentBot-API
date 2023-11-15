import { SetMetadata } from '@nestjs/common'

export const IS_PUBLIC_KEY= 'isPublic'
export const IsPublic = (enable?: boolean) => SetMetadata(IS_PUBLIC_KEY, enable ?? true)
